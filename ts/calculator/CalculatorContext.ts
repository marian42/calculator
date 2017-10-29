import { Result } from "./Result";

export class CalculatorContext {
	public readonly variables: {[index: string] : Result};
	public readonly constants: {[index: string] : Result};

	constructor() {
		this.variables = {};
		this.constants = this.createConstants();
	}

	private createConstants() : {[index: string] : Result} {
		return {
			"pi": new Result(Math.PI),
			"e": new Result(Math.E)
		};
	}
}
