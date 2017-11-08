import { Result } from "./Result";
import { CalculatorVisitorImpl } from "./CalculatorVisitorImpl";
import { ExpressionContext } from '../generated/CalculatorParser';
import { Task } from "./Task";

export abstract class CalculatorFunction {
	abstract invoke(args: Result[]): Result;
}

export class UnaryFunction extends CalculatorFunction {
	private func : (arg: Result) => Result;

	constructor(func : (arg : Result) => Result) {
		super();
		this.func = func;
	}

	invoke(args: Result[]): Result {
		return this.func(args[0]);
	}
}

export class NumberFunction extends CalculatorFunction {
	private func : (arg: number) => number;
	private keepUnit: boolean;

	constructor(func : (arg : number) => number, keepUnit?: boolean) {
		super();
		this.func = func;
		if (keepUnit != undefined) {
			this.keepUnit = keepUnit!;
		} else {
			this.keepUnit = false;
		}
	}

	invoke(args: Result[]): Result {
		if (this.keepUnit) {
			return new Result(this.func(args[0].value), args[0].unit);
		} else {
			return new Result(this.func(args[0].toNumber()));
		}
	}
}

export class LambdaFunction extends CalculatorFunction {
	private func : (arg: Result[]) => Result;

	constructor(func : (arg : Result[]) => Result) {
		super();
		this.func = func;
	}

	invoke(args: Result[]): Result {
		return this.func(args);
	}
}

export class CustomFunction extends CalculatorFunction {
	public readonly name: string;
	private readonly visitor: CalculatorVisitorImpl;
	private readonly context: ExpressionContext;
	private parameterNames: string[];

	constructor(name: string, context: ExpressionContext, task: Task, parameterNames: string[]) {
		super();
		this.name = name;
		this.visitor = new CalculatorVisitorImpl(task);
		this.visitor.localVariables = {};
		this.parameterNames = parameterNames;
		this.context = context;
	}

	public invoke(args: Result[]): Result {
		if (args.length != this.parameterNames.length) {
			throw new Error("Invalid number of parameters.");
		}
		for (var i = 0; i < this.parameterNames.length; i++) {
			this.visitor.localVariables![this.parameterNames[i]] = args[i];
		}
		return this.context.accept(this.visitor);
	}
}
