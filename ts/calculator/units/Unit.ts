import { BaseUnit } from "./BaseUnit";
import { NamedUnit } from "./NamedUnit";
import { BaseUnitBlock } from "./BaseUnitBlock";
import { TinyNumber } from "../../language/TinyNumber";

export class Unit {
	public readonly exponents: BaseUnitBlock;
	public readonly factor: number;

	public preferredNames: NamedUnit[];

	constructor(factor?: number, exponents?: BaseUnitBlock, preferredNames?: NamedUnit[]) {
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
		if (preferredNames != undefined) {
			this.preferredNames = preferredNames;
		} else {
			this.preferredNames = [];
		}
	}

	public multiplyWith(unit: Unit): Unit {
		return new Unit(this.factor * unit.factor, this.exponents.createSum(unit.exponents), this.preferredNames.concat(unit.preferredNames));
	}

	public divideBy(unit: Unit): Unit {
		return new Unit(this.factor / unit.factor, this.exponents.createSum(unit.exponents.createMultiple(-1)), this.preferredNames.concat(unit.preferredNames));
	}

	public power(exponent: number): Unit {
		return new Unit(Math.pow(this.factor, exponent), this.exponents.createMultiple(exponent), this.preferredNames);
	}

	public toString(): string {
		if (this.exponents.getActiveBaseUnits().length == 0) {
			return "";
		} else {
			return this.exponents.toString();
		}
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
			return new Unit(Math.pow(10, Unit.getPrefix(prefix)) * namedUnit.factor, namedUnit.exponents, [namedUnit]);
		}
		if (Unit.prefixNames == null) {
			Unit.initializePrefixNames();
		}

		for (var prefixName of Unit.prefixNames!) {
			if (value.startsWith(prefixName)) {
				var unitName = value.substr(prefixName.length).trim();
				if (NamedUnit.exists(unitName)) {
					var namedUnit = NamedUnit.get(unitName);
					return new Unit(Math.pow(10, Unit.getPrefix(prefixName)) * namedUnit.factor, namedUnit.exponents, [namedUnit]);
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
