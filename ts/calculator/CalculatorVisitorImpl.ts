import { CalculatorVisitor } from "../generated/CalculatorVisitor";
import { Result } from "./Result";
import { AssignStatement} from "./AssignStatement";

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

import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import { RuleNode } from 'antlr4ts/tree/RuleNode';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { Statement } from './Statement';

export class CalculatorVisitorImpl implements CalculatorVisitor<any> {

	visitExprInvert(ctx: ExprInvertContext) : Result {
		return new Result(-(this.visit(ctx.expression()) as Result).value);
	}

	visitExprVariable(ctx: ExprVariableContext) { throw new Error(); }

	visitExprAddSub(ctx: ExprAddSubContext) : Result {
		let left = ctx.expression(0).accept(this);
		let right = ctx.expression(1).accept(this);

		if (ctx._op.text == "+") {
			return new Result(left.value + right.value);
		} else if (ctx._op.text == "-") {
			return new Result(left.value - right.value);
		} else throw Error("Unknown operand " + ctx._op.text);
	}

	visitExprFunctioncall(ctx: ExprFunctioncallContext) { throw new Error(); }

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

		if (ctx._op.text == "*") {
			return new Result(left.value * right.value);
		} else if (ctx._op.text == "/") {
			return new Result(left.value / right.value);
		} else throw Error("Unknown operand " + ctx._op.text);
	}

	visitExprParentheses(ctx: ExprParenthesesContext) : Result {
		return ctx.expression().accept(this);
	}

	visitStatementExpression(ctx: StatementExpressionContext) {
		return ctx.expression().accept(this);
	}

	visitStatement(ctx: StatementContext) : Statement {
		return ctx.accept(this);
	}

	visitAssignment(ctx: AssignmentContext) {
		return new AssignStatement(ctx.ID().text, ctx.expression().accept(this));
	}

	visitExpression(ctx: ExpressionContext): Result {
		return ctx.accept(this);
	}

	visitNumber(ctx: NumberContext) : number {
		return Number.parseFloat(ctx.NUM()!.text);
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
