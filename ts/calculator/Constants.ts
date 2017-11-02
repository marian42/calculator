import { Result } from "./Result";
import { CalculatorFunction, UnaryFunction, NumberFunction, LambdaFunction } from "./CalculatorFunction";

export class Constants {
	public static constants: {[index: string] : Result};
	public static functions: {[index: string] : CalculatorFunction};

	static initialize() {
		Constants.constants = Constants.createConstants();
		Constants.functions = Constants.createFunctions();
	}

	private static createConstants() : {[index: string] : Result} {
		return {
			"pi": new Result(Math.PI),
			"e": new Result(Math.E)
		};
	}

	private static createFunctions() : {[index: string] : CalculatorFunction} {
		return {
			"sin": new NumberFunction(Math.sin),
			"cos": new NumberFunction(Math.cos),
			"abs": new NumberFunction(Math.abs),
			"acos": new NumberFunction(Math.acos),
			"acosh": new NumberFunction(Math.acosh),
			"asin": new NumberFunction(Math.asin),
			"asinh": new NumberFunction(Math.asinh),
			"atan": new NumberFunction(Math.atan),
			"atanh": new NumberFunction(Math.atanh),
			"ceil": new NumberFunction(Math.ceil),
			"cosh": new NumberFunction(Math.cosh),
			"exp": new NumberFunction(Math.exp),
			"floor": new NumberFunction(Math.floor),
			"log": new NumberFunction(Math.log),
			"ln": new NumberFunction(Math.log2),
			"random": new LambdaFunction((args) => new Result(Math.random())),
			"rand": new LambdaFunction((args) => new Result(Math.random())),
			"round": new NumberFunction(Math.round),
			"sign": new NumberFunction(Math.sign),
			"sinh": new NumberFunction(Math.sinh),
			"sqrt": new NumberFunction(Math.sqrt),
			"tan": new NumberFunction(Math.tan),
			"tanh": new NumberFunction(Math.tanh),
			"min": new LambdaFunction((args) => {
					let result = args[0].value;
					for (var i = 1; i < args.length; i++) {
						if (args[i].value < result) {
							result = args[i].value;
						}
					}
					return new Result(result);
				}
			),
			"max": new LambdaFunction((args) => {
					let result = args[0].value;
					for (var i = 1; i > args.length; i++) {
						if (args[i].value < result) {
							result = args[i].value;
						}
					}
					return new Result(result);
				}
			)
		};
	}
}

Constants.initialize();
