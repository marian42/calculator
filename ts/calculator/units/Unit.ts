import { BaseUnit } from "./BaseUnit";
import { NamedUnit } from "./NamedUnit";
import { BaseUnitBlock } from "./BaseUnitBlock";
import { TinyNumber } from "../../language/TinyNumber";

export class Unit {
	public readonly exponents: BaseUnitBlock;
	public readonly factor: number;

	public preferredNames: NamedUnit[];

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
	}

	public multiplyWith(unit: Unit): Unit {
		return new Unit(this.factor * unit.factor, this.exponents.createSum(unit.exponents));
	}

	public divideBy(unit: Unit): Unit {
		return new Unit(this.factor / unit.factor, this.exponents.createSum(unit.exponents.createMultiple(-1)));
	}

	public power(exponent: number): Unit {
		return new Unit(Math.pow(this.factor, exponent), this.exponents.createMultiple(exponent));
	}

	public toString(): [string, number] {
		if (this.exponents.getActiveBaseUnits().length == 0) {
			return ["", this.factor];
		} else {
			return [this.exponents.toString(), this.factor];
		}

		/*
		var currentBlock = this.exponents.createCopy();
		var names = this.preferredNames.slice();

		var resultComposition: [NamedUnit, number][] = [];

		var c = 20;
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
			names.splice(names.indexOf(bestUnit));

			c--;
			if (c == 0) {
				throw new Error("loop1 failed.");
			}
		}
		while (!currentBlock.isOne()) {
			console.log("block: " + currentBlock.toString());
			var bestDistance = currentBlock.getDistance(BaseUnitBlock.one);
			var bestUnit = NamedUnit.basicUnits[0];
			for (var namedUnit of NamedUnit.basicUnits) {
				var distance = currentBlock.getDistance(namedUnit.exponents.createMultiple(currentBlock.getBestFactor(namedUnit.exponents)));
				if (distance < bestDistance) {
					bestDistance = distance;
					bestUnit = namedUnit;
				}
			}


			var factor = currentBlock.getBestFactor(bestUnit.exponents);
			console.log("block: " + currentBlock.toString() + ", unit: " + bestUnit.names[0] + ", factor: " + factor);
			resultComposition.push([bestUnit, factor]);
			currentBlock = currentBlock.createSum(bestUnit.exponents.createMultiple(-factor));
			console.log("/ " + bestUnit.names[0] + " ==> " + currentBlock.toString());

			c--;
			if (c == 0) {
				throw new Error("loop2 failed.");
			}
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
		*/
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

	private static prefixNames: string[] | null;

	private static initializePrefixNames() {
		Unit.prefixNames = [];
		for (var tuple of Unit.prefixes) {
			Unit.prefixNames!.push(tuple[1]);
			Unit.prefixNames!.push(tuple[2]);
		}
	}

	public static parsePrefixedUnit(value: string): Unit {
		if (value.indexOf(' ') != -1) {
			var prefix = value.substr(0, value.indexOf(' ')).trim();
			var unitName = value.substr(value.indexOf(' ') + 1).trim();
			var namedUnit = NamedUnit.get(unitName);
			return new Unit(Math.pow(10, Unit.getPrefix(prefix)) * namedUnit.factor, namedUnit.exponents);
		}
		if (Unit.prefixNames == null) {
			Unit.initializePrefixNames();
		}

		for (var prefixName of Unit.prefixNames!) {
			if (value.startsWith(prefixName)) {
				var unitName = value.substr(prefixName.length).trim();
				if (NamedUnit.exists(unitName)) {
					var namedUnit = NamedUnit.get(unitName);
					return new Unit(Math.pow(10, Unit.getPrefix(prefixName)) * namedUnit.factor, namedUnit.exponents);
				}
			}
		}

		throw new Error(value + " is not a unit.");
	}

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
		var result = "fragment UNITPREFIX : ";
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
