import { TinyNumber } from "../language/TinyNumber";
import { Unit } from "./units/Unit";
import { BaseUnit } from "./units/BaseUnit";
import { BaseUnitBlock } from "./units/BaseUnitBlock";
import { NamedUnit } from "./units/NamedUnit";

export class Result {
	public readonly value: number;
	public readonly unit: Unit;

	public constructor(value: number, unit?: Unit | [BaseUnit, number][]) {
		this.value = value;
		if (unit == undefined) {
			this.unit = new Unit();
		} else if (unit instanceof Unit) {
			this.unit = unit;
		} else {
			this.unit = new Unit(1, new BaseUnitBlock(unit as [BaseUnit, number][]));
		}
	}

	public toString(): string {
		if (this.value == Number.POSITIVE_INFINITY) {
			return "∞";
		} else if (this.value == Number.NEGATIVE_INFINITY) {
			return "-∞";
		} else if (this.value == Number.NaN) {
			return "NaN";
		} else if (Math.abs(this.value) < Number.EPSILON) {
			return "0";
		}

		var prefix = "";
		var factor = this.unit.factor;
		var unit = "";

		var currentBlock = this.unit.exponents.createCopy();
		var names = this.unit.preferredNames.slice();
		names.sort((a, b) => b.exponents.getWeight() - a.exponents.getWeight());


		if (currentBlock.getExponent(BaseUnit.Percent) == 1 && currentBlock.getWeight() > 1) {
			currentBlock.addExponent(BaseUnit.Percent, -1);
		}

		if (currentBlock.getExponent(BaseUnit.Dollar) == 1) {
			var namedCurrency = NamedUnit.get("$");
			for (var name of names) {
				if (name.exponents.getExponent(BaseUnit.Dollar) == 1 && name.exponents.getExponentCount() == 1) {
					names.splice(names.indexOf(name), 1);
					namedCurrency = name;
				}
			}
			currentBlock.addExponent(BaseUnit.Dollar, -1);
			prefix = namedCurrency.names[0];
			factor /= namedCurrency.factor;
		}

		var resultComposition: [NamedUnit, number][] = [];

		while (names.length > 0) {
			var bestFactor = 0;
			var bestUnit : NamedUnit | null = null;
			for (var i = 0; i < names.length; i++) {
				var currentFactor = currentBlock.getBestFactor(names[i].exponents);
				currentFactor = Math.sign(currentFactor) * Math.floor(Math.abs(currentFactor));
				if (Math.abs(currentFactor) > Math.abs(bestFactor) || (currentFactor == bestFactor && bestUnit != null && bestUnit.exponents.getWeight() < names[i].exponents.getWeight())) {
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
		}

		for (var baseUnit of currentBlock.getActiveBaseUnits()) {
			for (var namedUnit of NamedUnit.basicUnits) {
				if (namedUnit.exponents.getExponent(baseUnit) == 0) {
					continue;
				}
				resultComposition.push([namedUnit, currentBlock.getExponent(baseUnit) / namedUnit.exponents.getExponent(baseUnit)]);
			}
		}

		resultComposition.sort((a, b) => {
			var expDifference = b[1] - a[1];
			if (expDifference != 0) {
				return expDifference;
			} else {
				return b[0].exponents.getWeight() - a[0].exponents.getWeight();
			}
		});

		if (resultComposition.length != 0) {
			for (var tuple of resultComposition) {
				if (tuple[0].prefixExponent != 0) {
					unit += Unit.getPrefixName(tuple[0].prefixExponent);
				}
				unit += tuple[0].names[0];
				if (tuple[1] != 1) {
					unit += TinyNumber.create(tuple[1]);
				}
				var x = factor;
				factor /= Math.pow(Math.pow(10, tuple[0].prefixExponent) * tuple[0].factor, tuple[1]);
			}
		}

		return prefix + Result.formatNumber(this.value * factor) + unit;
	}

	public toNumber(): number {
		return this.value * this.unit.factor;
	}

	private static numberToString(value: number, maxDecimalPoints = 8): string {
		var lower = Math.floor(value);
		var upper = Math.ceil(value);
		if (Math.abs(value - lower) < Number.EPSILON) {
			value = lower;
		} else if (Math.abs(value - upper) < Number.EPSILON) {
			value = upper;
		}
		var result = value.toString();
		if (result.indexOf('.') != -1) {
			var firstSignificantDigit = result.indexOf('.') + 1;
			while (firstSignificantDigit < result.length && result.charAt(firstSignificantDigit) == '0') {
				firstSignificantDigit++;
			}
			if (firstSignificantDigit + maxDecimalPoints < result.length) {
				result = result.substr(0, firstSignificantDigit + maxDecimalPoints);
			}
		}
		return result;
	}

	private static formatNumber(value: number): string {
		const maxExponent = 5;
		const minExponent = -5;
		let exponent = Math.floor(Math.log10(value));
		if (exponent < minExponent || exponent > maxExponent) {
			var base = value / Math.pow(10, exponent);
			return Result.numberToString(base, 4) + "⨯10" + TinyNumber.create(exponent)
		}
		return Result.numberToString(value);
	}

	public convertTo(unit: Unit): number {
		let value = this.value * this.unit.factor;

		// Temperatures
		if (this.unit.exponents.getExponentCount() == 1 && unit.exponents.getExponentCount() == 1) {
			var kelvin = undefined;
			if (this.unit.exponents.getExponent(BaseUnit.Kelvin) == 1) {
				kelvin = value;
			} else if (this.unit.exponents.getExponent(BaseUnit.Celsius) == 1) {
				kelvin = value + 273.15;
			} else if (this.unit.exponents.getExponent(BaseUnit.Fahrenheit) == 1) {
				kelvin = (value + 459.67) * 5/9;
			}
			if (kelvin != undefined) {
				if (unit.exponents.getExponent(BaseUnit.Kelvin) == 1) {
					value = kelvin;
				} else if (unit.exponents.getExponent(BaseUnit.Celsius) == 1) {
					value = kelvin - 273.15;
				} else if (unit.exponents.getExponent(BaseUnit.Fahrenheit) == 1) {
					value = kelvin * 9/5 - 459.67;
				}
			}
		}
		return value / unit.factor;
	}
}
