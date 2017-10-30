import { BaseUnit } from "./BaseUnit";
import { Unit } from "./Unit";
import { BaseUnitBlock } from "./BaseUnitBlock";

export class NamedUnit extends Unit {
	public names: string[];
	public preferredPrefix: number;

	constructor(names: string[], factor: number, exponents: [BaseUnit, number][], preferredPrefix?: number) {
		super(factor, new BaseUnitBlock(exponents));
		this.names = names;
		if (preferredPrefix != undefined) {
			this.preferredPrefix = preferredPrefix;
		} else {
			this.preferredPrefix = 0;
		}
	}

	public isBasic(): boolean {
		return this.factor == 1;
	}

	public static readonly items : NamedUnit[] = [
		new NamedUnit(["m", "meter", "mtr", "meters"], 1, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["g", "gram", "grams"], 1, [[BaseUnit.Kilogram, 1]], 3),
		new NamedUnit(["s", "second", "seconds"], 1, [[BaseUnit.Second, 1]]),
		new NamedUnit(["A", "ampere", "amperes", "ampère", "ampères"], 1, [[BaseUnit.Ampere, 1]]),
		new NamedUnit(["K", "kelvin", "kelvins"], 1, [[BaseUnit.Kelvin, 1]]),
		new NamedUnit(["°F", "fahrenheit", "degrees fahrenheit"], 1, [[BaseUnit.Fahrenheit, 1]]),
		new NamedUnit(["°C", "celsius", "degrees celsius"], 1, [[BaseUnit.Celsius, 1]]),
		new NamedUnit(["mol", "mole", "moles"], 1, [[BaseUnit.Mole, 1]]),
		new NamedUnit(["cd", "candela", "candelas"], 1, [[BaseUnit.Candela, 1]]),
		new NamedUnit(["%", "percent"], 1, [[BaseUnit.Percent, 1]]),
		new NamedUnit(["rad", "radian", "radians"], 1, [[BaseUnit.Radian, 1]]),
		new NamedUnit(["bit", "b", "bits"], 1, [[BaseUnit.Kilogram, 1]]),
		new NamedUnit(["USD", "$", "dollar", "dollars"], 1, [[BaseUnit.Kilogram, 1]]),

		new NamedUnit(["miles", "mile"], 1609.34, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["nautical mile", "nautical miles"], 1.852e3, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["in", "inch", "inches", "\""], 0.0254, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["ft", "foot", "feet", "'"], 0.3048, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["yard", "yards"], 0.9144, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["AU", "astronomical unit"], 1.496e11, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["ly", "Ly", "light year"], 9.461e15, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["pc", "parsec", "parsecs"], 3.086e16, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["Å", "angstrom", "angstroms"], 1e-10, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["micron"], 1e-6, [[BaseUnit.Meter, 1]]),
		new NamedUnit(["acre", "acres"], 4046.8564224, [[BaseUnit.Meter, 2]]),
		new NamedUnit(["L", "liter", "liters", "litre", "litres"], 0.001, [[BaseUnit.Meter, 3]]),
		new NamedUnit(["gal", "gallon", "gallons"], 0.003785, [[BaseUnit.Meter, 3]]),
		new NamedUnit(["fluid ounce", "fl oz"], 2.8413062e-5, [[BaseUnit.Meter, 3]]),
		new NamedUnit(["g", "gram", "grams"], 0.001, [[BaseUnit.Kilogram, 1]]),
		new NamedUnit(["t", "ton", "tons"], 1000, [[BaseUnit.Kilogram, 1]]),
		new NamedUnit(["lb", "lbs", "pound", "pounds"], 0.4536, [[BaseUnit.Kilogram, 1]]),
		new NamedUnit(["u", "atomic units"], 1.6605402e-27, [[BaseUnit.Kilogram, 1]]),
		new NamedUnit(["oz", "ounce", "ounces"], 0.02853, [[BaseUnit.Kilogram, 1]]),
		new NamedUnit(["mph", "miles per hour"], 1609.34 / 3600, [[BaseUnit.Meter, 1], [BaseUnit.Second, -1]]),
		new NamedUnit(["mh"], 1 / 3600, [[BaseUnit.Meter, 1], [BaseUnit.Second, -1]], 3),
		new NamedUnit(["knots", "knot"], 1852/3600, [[BaseUnit.Meter, 1], [BaseUnit.Second, -1]]),
		new NamedUnit(["mpg", "miles to the gallon"], 1609.34 / 0.003785, [[BaseUnit.Meter, 1], [BaseUnit.Meter, -3]]),
		new NamedUnit(["B", "byte"], 8, [[BaseUnit.Bit, 1]]),
		new NamedUnit(["W", "watt", "watts"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -3]]),
		new NamedUnit(["J", "joule", "joules"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -2]]),
		new NamedUnit(["eV", "electron volts"], 1.6021766e-19, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -2]]),
		new NamedUnit(["V", "volt", "volts"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -3], [BaseUnit.Ampere, -1]]),
		new NamedUnit(["C", "coulomb"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -3], [BaseUnit.Ampere, -1]]),
		new NamedUnit(["Hz", "hertz"], 1, [[BaseUnit.Second, -1]]),
		new NamedUnit(["F", "farad", "farads"], 1, [[BaseUnit.Second, 4], [BaseUnit.Ampere, 2], [BaseUnit.Meter, -2], [BaseUnit.Kilogram, -1]]),
		new NamedUnit(["H", "henry", "henries"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -2], [BaseUnit.Ampere, -2]]),
		new NamedUnit(["T", "tesla", "teslas"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Second, -2], [BaseUnit.Ampere, -1]]),
		new NamedUnit(["N", "newton", "newtons"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 1], [BaseUnit.Second, -2]]),
		new NamedUnit(["Ω", "ohm", "ohms"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, 2], [BaseUnit.Second, -3], [BaseUnit.Ampere, -2]]),
		new NamedUnit(["S", "siemens"], 1, [[BaseUnit.Kilogram, -1], [BaseUnit.Meter, -2], [BaseUnit.Second, 3], [BaseUnit.Ampere, 2]]),
		new NamedUnit(["Pa", "pascal", "pascals"], 1, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, -1], [BaseUnit.Second, -2]]),
		new NamedUnit(["psi"], 6.894757e3, [[BaseUnit.Kilogram, 1], [BaseUnit.Meter, -1], [BaseUnit.Second, -2]]),
		new NamedUnit(["°", "deg", "degree", "degrees"], 17.45e-3, [[BaseUnit.Radian, 1]]),
		new NamedUnit(["Sv", "sievert", "sieverts"], 1, [[BaseUnit.Meter, 2], [BaseUnit.Second, -2]]),
		new NamedUnit(["min", "minute", "minutes"], 60, [[BaseUnit.Second, 1]]),
		new NamedUnit(["h", "hour", "hours"], 3600, [[BaseUnit.Second, 1]]),
		new NamedUnit(["d", "day", "days"], 86400, [[BaseUnit.Second, 1]]),
		new NamedUnit(["weeks", "week"], 604800, [[BaseUnit.Second, 1]]),
		new NamedUnit(["months", "month"], 2592000, [[BaseUnit.Second, 1]]),
		new NamedUnit(["years", "y", "yr", "year"], 31557600, [[BaseUnit.Second, 1]]),
		new NamedUnit(["€", "EUR", "euros", "euro"], 1.17, [[BaseUnit.Dollar, 1]]),
		new NamedUnit(["£", "GBP", "british pounds"], 1.32, [[BaseUnit.Dollar, 1]]),
		new NamedUnit(["₽", "RUB", "ruble", "rubles"], 0.017, [[BaseUnit.Dollar, 1]])
	];

	public static get(name: string): NamedUnit {
		for (var item of NamedUnit.items) {
			if (item.names.indexOf(name) != -1) {
				return item;
			}
		}
		throw new Error(name + " is not a named unit.");
	}

	public static getLexerRule(): string {
		var result = "NAMEDUNIT : ";
		var first = false;
		for (var namedUnit of NamedUnit.items) {
			for (var name of namedUnit.names) {
				if (!first) {
					result += " | ";
				} else {
					first = false;
				}
				result += "'" + name.replace("'", "\\'") + "'";
			}
		}
		result += ";";
		return result;
	}
}
