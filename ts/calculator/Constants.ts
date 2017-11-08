import { Result } from "./Result";
import { CalculatorFunction, UnaryFunction, NumberFunction, LambdaFunction } from "./CalculatorFunction";
import { BaseUnit } from "./units/BaseUnit";

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
			"e": new Result(Math.E),
			"c": new Result(299792458, [[BaseUnit.Meter, 1], [BaseUnit.Second, -1]]),
			"h": new Result(6.626070050e-34, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, 1]]),
			"G": new Result(6.67408e-11, [[BaseUnit.Kilogram, -1], [BaseUnit.Meter, 3], [BaseUnit.Second, -2]]),
			"epsilon_0": new Result(8.854187817, [[BaseUnit.Ampere, 2], [BaseUnit.Second, 4], [BaseUnit.Kilogram, -1], [BaseUnit.Meter, -3]]),
			"mu_0": new Result(4e-7*Math.PI, [[BaseUnit.Ampere, -2], [BaseUnit.Kilogram, 1], [BaseUnit.Second, -2]]),
			"m_e": new Result(9.10938356e-39, [[BaseUnit.Kilogram, 1]]),
			"m_p": new Result(1.672621898e-27, [[BaseUnit.Kilogram, 1]]),
			"m_n": new Result(1.674927471e-27, [[BaseUnit.Kilogram, 1]]),
			"m_µ": new Result(1.8835315-28, [[BaseUnit.Kilogram, 1]]),
			"N_A": new Result(6.022140857e23, [[BaseUnit.Mole, -1]]),
			"k": new Result(1.38064852e-23, [[BaseUnit.Kelvin, -1], [BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -2]]),
			"k_B": new Result(1.38064852e-23, [[BaseUnit.Kelvin, -1], [BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -2]]),
			"R": new Result(8.3144598, [[BaseUnit.Mole, -1], [BaseUnit.Kelvin, -1], [BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -2]]),
			"g": new Result(9.80665, [[BaseUnit.Meter, 1], [BaseUnit.Second, -2]]),
			"a_0": new Result(5.29177211e-11, [[BaseUnit.Meter, 1]]),

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
			),
			"step": new NumberFunction(x => x >= 0 ? 1 : 0),
			"saturate": new NumberFunction(x => {
				if (x > 1) {
					return 1;
				} else if (x < 0) {
					return 0;
				} else {
					return x;
				}
			}),
			"lerp": new LambdaFunction(args => new Result(args[0].toNumber() + (args[1].toNumber() - args[0].toNumber()) * args[2].toNumber())),
			"map": new LambdaFunction(args => new Result((args[0].toNumber() - args[1].toNumber()) * (args[4].toNumber() - args[3].toNumber()) / (args[2].toNumber() - args[1].toNumber()) + args[3].toNumber()))
		};
	}
}

Constants.initialize();
