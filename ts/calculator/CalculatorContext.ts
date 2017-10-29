import { Result } from "./Result";

export class CalculatorContext {
	public readonly variables: {[index: string] : Result};

	constructor() {
		this.variables = {};
	}
}
