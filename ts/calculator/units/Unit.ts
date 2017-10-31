import { BaseUnit } from "./BaseUnit";
import { NamedUnit } from "./NamedUnit";
import { BaseUnitBlock } from "./BaseUnitBlock";
import { TinyNumber } from "../../language/TinyNumber";

export class Unit {
	public exponents: BaseUnitBlock;
	public factor: number;

	public preferredNames: NamedUnit[];
	public prefixExponents: {[index: string]: number};

	constructor(factor?: number, exponents?: BaseUnitBlock) {
		if (factor != undefined) {
			this.factor = factor!;
		} else {
			this.factor = 1;
		}
		if (exponents == undefined) {
			this.exponents = new BaseUnitBlock();
		} else {
			this.exponents = exponents;
		}
		this.preferredNames = [];
		this.prefixExponents = {};
	}

	public toString(): [string, number] {
		var currentBlock = this.exponents.createCopy();
		var names = this.preferredNames.slice();

		var resultComposition: [NamedUnit, number][] = [];

		while (names.length > 0) {
			var bestFactor = 0;
			var bestUnit : NamedUnit | null = null;
			for (var i = 0; i < names.length; i++) {
				var currentFactor = currentBlock.getBestFactor(names[i].exponents);
				if (Math.abs(currentFactor) >= 2) {
					delete names[i];
					i--;
				} else if (Math.abs(currentFactor) > Math.abs(bestFactor)) {
					bestFactor = currentFactor;
					bestUnit = names[i];
				}
			}
			if (bestUnit == null) {
				break;
			}
			resultComposition.push([bestUnit, bestFactor]);
			currentBlock = currentBlock.createSum(bestUnit.exponents.createMultiple(-bestFactor));
		}

		while (!currentBlock.isOne()) {
			var namedUnit = NamedUnit.basicUnits.slice().sort((item) => -Math.abs(currentBlock.getBestFactor(item.exponents)))[0];
			var factor = currentBlock.getBestFactor(namedUnit.exponents);
			resultComposition.push([namedUnit, factor]);
			currentBlock = currentBlock.createSum(namedUnit.exponents.createMultiple(factor));
		}

		resultComposition.sort(tuple => -tuple[1]);
		var result = "";

		if (resultComposition.length == 0) {
			return [result, 1];
		}

		if (resultComposition[0][1] < 0) {
			result += "1";
		}

		var currentFactor = this.factor;

		for (var tuple of resultComposition) {
			if (tuple[1] < 0) {
				result += "/";
			}
			if (tuple[0].prefixExponent != 0) {
				result += Unit.getPrefixName(tuple[0].prefixExponent);
			}
			result += tuple[0].names[0];
			if (Math.abs(tuple[1]) != 1) {
				result += TinyNumber.create(Math.abs(tuple[1]));
			}
			currentFactor /= Math.pow(Math.pow(10, tuple[0].prefixExponent) * tuple[0].factor, tuple[1]);
		}

		return [result, currentFactor];
	}

	public static readonly prefixes: [[number, string, string]] = [
		[24, "Y", "yotta"],
		[21, "Z", "zetta"],
		[18, "E", "exa"],
		[15, "P", "peta"],
		[12, "T", "terra"],
		[9, "G", "giga"],
		[6, "M", "mega"],
		[3, "k", "kilo"],
		[2, "h", "hecto"],
		[-1, "d", "deci"],
		[-2, "c", "centi"],
		[-3, "m", "milli"],
		[-6, "µ", "micro"],
		[-9, "n", "nano"],
		[-12, "p", "pico"],
		[-15, "f", "femto"],
		[-18, "a", "atto"],
		[-21, "z", "zepto"],
		[-24, "y", "yocto"]
	];

	public static getPrefix(name: string): number {
		for (var tuple of Unit.prefixes) {
			if (tuple[1] == name || tuple[2] == name) {
				return tuple[0];
			}
		}
		throw new Error("Unknown unit prefix: " + name);
	}

	public static getPrefixName(value: number): string {
		for (var tuple of Unit.prefixes) {
			if (tuple[0] == value) {
				return tuple[1];
			}
		}
		throw new Error("No prefix available for exponent " + value);
	}

	public static getPrefixLexerRule(): string {
		var result = "UNITPREFIX : ";
		var first = true;
		for (var tuple of Unit.prefixes) {
			if (!first) {
				result += " | ";
			} else {
				first = false;
			}
			result += "'" + tuple[1] + "' | '" + tuple[2] + "'";
		}
		result += ";";
		return result;
	}
}
