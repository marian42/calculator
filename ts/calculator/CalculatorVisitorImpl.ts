import { CalculatorVisitor } from "../generated/CalculatorVisitor";
import { Result } from "./Result";
import { TinyNumber } from "../language/TinyNumber";
import { Unit } from "../calculator/units/Unit";
import { NamedUnit } from "../calculator/units/NamedUnit";

import {
	ExprInvertContext,
	ExprVariableContext,
	ExprAddSubContext,
	ExprFunctioncallContext,
	ExprPowerContext,
	ExprNumberContext,
	ExprMulDivContext,
	ExprParenthesesContext,
	StatementExpressionContext,
	StatementContext,
	AssignmentContext,
	ExpressionContext,
	ExprTinyPowerContext,
	NumberContext,
	UnitParenthesesContext,
	UnitPowerContext,
	UnitTinyPowerContext,
	UnitDivisionContext,
	UnitProductContext,
	UnitSquaredContext,
	UnitCubedContext,
	UnitNameContext,
	UnitContext,
	UnitWithPrefixContext
 } from '../generated/CalculatorParser';

import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import { RuleNode } from 'antlr4ts/tree/RuleNode';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { CalculatorContext } from "./CalculatorContext";

export class CalculatorVisitorImpl implements CalculatorVisitor<any> {
	private readonly context : CalculatorContext;

	constructor(context: CalculatorContext) {
		this.context = context;
	}

	visitExprInvert(ctx: ExprInvertContext) : Result {
		return new Result(-(this.visit(ctx.expression()) as Result).value);
	}

	visitExprVariable(ctx: ExprVariableContext) {
		let variableName = ctx.ID().text;
		if (this.context.variables[variableName] != undefined) {
			return this.context.variables[variableName];
		}
		if (this.context.constants[variableName] != undefined) {
			return this.context.constants[variableName];
		}
		throw new Error("Unknown identifier: " + variableName);
	}

	visitExprAddSub(ctx: ExprAddSubContext) : Result {
		let left = ctx.expression(0).accept(this);
		let right = ctx.expression(1).accept(this);

		if (ctx.ADD() != undefined) {
			return new Result(left.value + right.value);
		} else if (ctx.SUB() != undefined) {
			return new Result(left.value - right.value);
		} else throw Error("Unknown operand " + ctx._op.text);
	}

	visitExprFunctioncall(ctx: ExprFunctioncallContext): Result {
		let functionName = ctx.ID().text;
		let parameters = [];
		for (var i = 0; i < ctx.childCount; i++) {
			if (ctx.getChild(i) instanceof ExpressionContext) {
				parameters.push(ctx.getChild(i).accept(this));
			}
		}
		if (this.context.functions[functionName] != undefined) {
			return this.context.functions[functionName].invoke(parameters);
		}

		throw new Error("Unknown function identifier " + functionName);
	}

	visitExprPower(ctx: ExprPowerContext) : Result {
		let base = ctx.expression(0).accept(this);
		let exponent = ctx.expression(1).accept(this);

		return new Result(Math.pow(base.value, exponent.value));
	}

	visitExprNumber(ctx: ExprNumberContext) : Result {
		var unit = ctx.unit() == undefined ? new Unit() : ctx.unit()!.accept(this);
		return new Result(ctx.number().accept(this), unit);
	}

	visitExprMulDiv(ctx: ExprMulDivContext) : Result {
		let left = ctx.expression(0).accept(this);
		let right = ctx.expression(1).accept(this);

		if (ctx.MUL() != undefined) {
			return new Result(left.value * right.value);
		} else if (ctx.DIV() != undefined) {
			return new Result(left.value / right.value);
		} else throw Error("Unknown operand " + ctx._op.text);
	}

	visitExprParentheses(ctx: ExprParenthesesContext) : Result {
		var unit = ctx.unit() == undefined ? new Unit() : ctx.unit()!.accept(this);
		var innerResult = ctx.expression().accept(this);
		return new Result(innerResult.value, innerResult.unit.createMultiple(unit));
	}

	visitStatementExpression(ctx: StatementExpressionContext): Result {
		return ctx.expression().accept(this);
	}

	visitStatement(ctx: StatementContext) : Result {
		return ctx.accept(this);
	}

	visitAssignment(ctx: AssignmentContext): Result {
		let variableName = ctx.ID().text;
		let result = ctx.expression().accept(this);
		this.context.variables[variableName] = result;
		return result;
	}

	visitExpression(ctx: ExpressionContext): Result {
		return ctx.accept(this);
	}

	visitNumber(ctx: NumberContext) : number {
		let text = ctx.NUM()!.text;
		if (text.startsWith("0b")) {
			return Number.parseInt(text.substr(2), 2);
		} else if (text.startsWith("0x")) {
			return Number.parseInt(text.substr(2), 16);
		} else {
			return Number.parseFloat(text);
		}
	}

	visitExprTinyPower(ctx: ExprTinyPowerContext): Result {
		var exponent = TinyNumber.parse(ctx.TINYNUMBER().text);
		var unit = ctx.unit() == undefined ? new Unit() : ctx.unit()!.accept(this);
		return new Result(Math.pow(ctx.expression().accept(this).value, exponent), unit);
		// TODO pass unit
	}

	visitUnitParentheses(ctx: UnitParenthesesContext): Unit {
		return ctx.unit().accept(this);
	}

	visitUnitCubed(ctx: UnitCubedContext) : Unit {
		var unit = ctx.unit().accept(this);
		return unit.power(3);
	}

	visitUnitPower(ctx: UnitPowerContext): Unit {
		return ctx.unit().accept(this).power(ctx.number().accept(this));
	}

	visitUnitTinyPower(ctx: UnitTinyPowerContext) : Unit {
		return ctx.unit().accept(this).power(TinyNumber.parse(ctx.TINYNUMBER().text));
	}

	visitUnitDivision(ctx: UnitDivisionContext) : Unit {
		var left = ctx.unit(0).accept(this);
		var right = ctx.unit(1).accept(this);
		return left.divideBy(right);
	}

	visitUnitProduct(ctx: UnitProductContext) {
		var left = ctx.unit(0).accept(this);
		var right = ctx.unit(1).accept(this);
		return left.multiplyWith(right);
	}

	visitUnitSquared(ctx: UnitSquaredContext) {
		var unit = ctx.unit().accept(this);
		return unit.power(2);
	}

	visitUnitName(ctx: UnitNameContext): Unit {
		return new Unit(1, NamedUnit.get(ctx.NAMEDUNIT().text).exponents);
	}

	visitUnitWithPrefix(ctx: UnitWithPrefixContext): Unit {
		return Unit.parsePrefixedUnit(ctx.PREFIXEDUNIT().text);
	}

	visitUnit(ctx: UnitContext): Unit {
		return ctx.accept(this);
	}

	visit(tree: ParseTree): any {
		return tree.accept(this);
	}

	visitChildren(node: RuleNode): any {
		return node.accept(this);
	}

	visitTerminal(node: TerminalNode): any {
		return node.accept(this);
	}

	visitErrorNode(node: ErrorNode): any {
		return node.accept(this);
	}
}
