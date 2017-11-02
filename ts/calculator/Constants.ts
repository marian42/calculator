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
			"abs": new NumberFunction(Math.abs, true),
			"acos": new NumberFunction(Math.acos),
			"acosh": new NumberFunction(Math.acosh),
			"asin": new NumberFunction(Math.asin),
			"asinh": new NumberFunction(Math.asinh),
			"atan": new NumberFunction(Math.atan),
			"atanh": new NumberFunction(Math.atanh),
			"ceil": new NumberFunction(Math.ceil, true),
			"floor": new NumberFunction(Math.floor, true),
			"cosh": new NumberFunction(Math.cosh),
			"exp": new NumberFunction(Math.exp),
			"log": new LambdaFunction((args) => {
				if (args.length == 1) {
					return new Result(Math.log(args[0].toNumber()));
				} else if (args.length == 2) {
					return new Result(Math.log(args[1].toNumber()) / Math.log(args[0].toNumber()));
				} else {
					throw new Error("Invalid number of parameters for log() function.");
				}
			}),
			"ln": new NumberFunction(Math.log),
			"random": new LambdaFunction((args) => new Result(Math.random())),
			"rand": new LambdaFunction((args) => new Result(Math.random())),
			"round": new NumberFunction(Math.round, true),
			"sign": new NumberFunction(Math.sign),
			"sinh": new NumberFunction(Math.sinh),
			"sqrt": new UnaryFunction((arg) => new Result(Math.sqrt(arg.value), arg.unit.power(0.5))),
			"tan": new NumberFunction(Math.tan),
			"tanh": new NumberFunction(Math.tanh),
			"min": new LambdaFunction((args) => {
					let result = args[0];
					for (var i = 1; i < args.length; i++) {
						if (args[i].toNumber() < result.toNumber()) {
							result = args[i];
						}
					}
					return result;
				}
			),
			"max": new LambdaFunction((args) => {
					let result = args[0];
					for (var i = 1; i < args.length; i++) {
						if (args[i].toNumber() > result.toNumber()) {
							result = args[i];
						}
					}
					return result;
				}
			)
		};
	}
}

Constants.initialize();
