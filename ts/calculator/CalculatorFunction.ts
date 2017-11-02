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
