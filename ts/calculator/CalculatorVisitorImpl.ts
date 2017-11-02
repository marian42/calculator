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
	UnitWithPrefixContext,
	NameContext
 } from '../generated/CalculatorParser';

import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import { RuleNode } from 'antlr4ts/tree/RuleNode';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { Task } from './Task';
import { Constants } from './Constants';

export class CalculatorVisitorImpl implements CalculatorVisitor<any> {
	private readonly task : Task;

	constructor(task: Task) {
		this.task = task;
	}

	visitExprInvert(ctx: ExprInvertContext) : Result {
		var result: Result = this.visit(ctx.expression());
		return new Result(-result.value, result.unit);
	}

	visitExprVariable(ctx: ExprVariableContext): Result {
		let variableName = ctx.name().text;
	 	return this.task.resolveName(variableName);
	}

	visitName(ctx: NameContext): string {
		return ctx.text;
	}

	visitExprAddSub(ctx: ExprAddSubContext) : Result {
		let left: Result = ctx.expression(0).accept(this);
		let right: Result = ctx.expression(1).accept(this);

		if (ctx.ADD() != undefined) {
			return new Result(left.value + right.value * right.unit.factor / left.unit.factor, left.unit);
		} else if (ctx.SUB() != undefined) {
			return new Result(left.value - right.value * right.unit.factor / left.unit.factor, left.unit);
		} else throw Error("Unknown operand " + ctx._op.text);
	}

	visitExprFunctioncall(ctx: ExprFunctioncallContext): Result {
		let functionName = ctx.name().text;
		let parameters: Result[] = [];
		for (var i = 0; i < ctx.childCount; i++) {
			if (ctx.getChild(i) instanceof ExpressionContext) {
				parameters.push(ctx.getChild(i).accept(this));
			}
		}
		if (Constants.functions[functionName] != undefined) {
			return Constants.functions[functionName].invoke(parameters);
		}

		throw new Error("Unknown function identifier " + functionName);
	}

	visitExprPower(ctx: ExprPowerContext) : Result {
		let base = ctx.expression(0).accept(this);
		let exponent = ctx.expression(1).accept(this);

		return new Result(Math.pow(base.value, exponent.value), base.unit.power(exponent.value));
	}

	visitExprNumber(ctx: ExprNumberContext) : Result {
		var unit = ctx.unit() == undefined ? new Unit() : ctx.unit()!.accept(this);
		return new Result(ctx.number().accept(this), unit);
	}

	visitExprMulDiv(ctx: ExprMulDivContext) : Result {
		let left = ctx.expression(0).accept(this);
		let right = ctx.expression(1).accept(this);

		if (ctx.MUL() != undefined) {
			return new Result(left.value * right.value, left.unit.multiplyWith(right.unit));
		} else if (ctx.DIV() != undefined) {
			return new Result(left.value / right.value, left.unit.divideBy(right.unit));
		} else throw Error("Unknown operand " + ctx._op.text);
	}

	visitExprParentheses(ctx: ExprParenthesesContext) : Result {
		var unit: Unit = ctx.unit() == undefined ? new Unit() : ctx.unit()!.accept(this);
		var innerResult: Result = ctx.expression().accept(this);
		return new Result(innerResult.value, innerResult.unit.multiplyWith(unit));
	}

	visitStatementExpression(ctx: StatementExpressionContext): Result {
		this.task.exportedVariable = null;
		return ctx.expression().accept(this);
	}

	visitStatement(ctx: StatementContext) : Result {
		return ctx.accept(this);
	}

	visitAssignment(ctx: AssignmentContext): Result {
		this.task.exportedVariable = ctx.name().text;
		return ctx.expression().accept(this);
	}

	visitExpression(ctx: ExpressionContext): Result {
		return ctx.accept(this);
	}

	visitNumber(ctx: NumberContext): number {
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
		var base = ctx.expression().accept(this);
		var exponent = TinyNumber.parse(ctx.TINYNUMBER().text);
		var unit = ctx.unit() == undefined ? new Unit() : ctx.unit()!.accept(this);
		return new Result(Math.pow(base.value, exponent), base.unit.power(exponent));
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

	visitUnitTinyPower(ctx: UnitTinyPowerContext): Unit {
		return ctx.unit().accept(this).power(TinyNumber.parse(ctx.TINYNUMBER().text));
	}

	visitUnitDivision(ctx: UnitDivisionContext): Unit {
		var left = ctx.unit(0).accept(this);
		var right = ctx.unit(1).accept(this);
		return left.divideBy(right);
	}

	visitUnitProduct(ctx: UnitProductContext): Unit {
		var left = ctx.unit(0).accept(this);
		var right = ctx.unit(1).accept(this);
		return left.multiplyWith(right);
	}

	visitUnitSquared(ctx: UnitSquaredContext): Unit {
		var unit = ctx.unit().accept(this);
		return unit.power(2);
	}

	visitUnitName(ctx: UnitNameContext): Unit {
		return NamedUnit.get(ctx.NAMEDUNIT().text);
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
