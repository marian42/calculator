import { CalculatorVisitor } from "../generated/CalculatorVisitor";
import { Result } from "./Result";
import { TinyNumber } from "../language/TinyNumber";

import { ExprInvertContext } from '../generated/CalculatorParser';
import { ExprVariableContext } from '../generated/CalculatorParser';
import { ExprAddSubContext } from '../generated/CalculatorParser';
import { ExprFunctioncallContext } from '../generated/CalculatorParser';
import { ExprPowerContext } from '../generated/CalculatorParser';
import { ExprNumberContext } from '../generated/CalculatorParser';
import { ExprMulDivContext } from '../generated/CalculatorParser';
import { ExprParenthesesContext } from '../generated/CalculatorParser';
import { StatementExpressionContext } from '../generated/CalculatorParser';
import { StatementContext } from '../generated/CalculatorParser';
import { AssignmentContext } from '../generated/CalculatorParser';
import { ExpressionContext } from '../generated/CalculatorParser';
import { NumberContext } from '../generated/CalculatorParser';
import { ExprTinyPowerContext } from '../generated/CalculatorParser';

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
		console.log();
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
		return new Result(ctx.number().accept(this));
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
		return ctx.expression().accept(this);
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
		return new Result(Math.pow(ctx.expression().accept(this).value, exponent));
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
