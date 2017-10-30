import { BaseUnit } from "./BaseUnit";
import { NamedUnit } from "./NamedUnit";
import { BaseUnitBlock } from "./BaseUnitBlock";

export class Unit {
	public exponents: BaseUnitBlock;
	public factor: number;

	public preferredNames: NamedUnit[];
	public preferedPrefixes: {[index: string]: number};

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
		this.preferedPrefixes = {};
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
		var first = false;
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
