import { TinyNumber } from "../language/TinyNumber";

export class Result {
	public readonly value: number;

	public constructor(value: number) {
		this.value = value;
	}

	public toString(): string {
		if (this.value == Number.POSITIVE_INFINITY) {
			return "∞";
		} else if (this.value == Number.NEGATIVE_INFINITY) {
			return "-∞";
		} else if (this.value == Number.NaN) {
			return "not a number";
		} else if (Math.abs(this.value) < Number.EPSILON) {
			return "0";
		}
		return Result.formatNumber(this.value);
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
		const maxExponent = 6;
		const minExponent = -6;
		let exponent = Math.floor(Math.log10(value));
		if (exponent < minExponent || exponent > maxExponent) {
			var base = value / Math.pow(10, exponent);
			return Result.numberToString(base, 4) + "⨯10" + TinyNumber.create(exponent)
		}
		return Result.numberToString(value);
	}
}
