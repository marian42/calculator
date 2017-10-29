import { Result } from "./Result";

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

	constructor(func : (arg : number) => number) {
		super();
		this.func = func;
	}

	invoke(args: Result[]): Result {
		return new Result(this.func(args[0].value));
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
