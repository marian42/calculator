import { BaseUnit } from "./BaseUnit";
import { TinyNumber } from "../../language/TinyNumber";

export class BaseUnitBlock {
	public static readonly one = new BaseUnitBlock();

	private exponents: {[index: string] : number};

	constructor(exponents?: [BaseUnit, number][]) {
		this.exponents = {};
		if (exponents != undefined) {
			for (var item of exponents!) {
				this.exponents[item[0]] = item[1];
			}
		}
	}

	public toString(): string {
		var result = "";
		for (var key in this.exponents) {
			result += key;
			var exp = this.exponents[key];
			if (exp != 1) {
				result += TinyNumber.create(exp);
			}
		}
		return result;
	}

	public createCopy(): BaseUnitBlock {
		var paramExponents: [BaseUnit, number][] = [];
		for (var baseUnit in this.exponents) {
			paramExponents.push([baseUnit as BaseUnit, this.exponents[baseUnit]]);
		}
		return new BaseUnitBlock(paramExponents);
	}

	public getDistance(block: BaseUnitBlock): number {
		var result = 0;
		for (var key in this.exponents) {
			result += Math.abs(this.exponents[key] - block.getExponent(key as BaseUnit));
		}
		for (var baseUnit of block.getActiveBaseUnits()) {
			if (this.exponents[baseUnit] == undefined) {
				result += Math.abs(block.getExponent(baseUnit));
			}
		}
		return result;
	}

	public createMultiple(exponent: number): BaseUnitBlock {
		var result = new BaseUnitBlock();
		for (var key in this.exponents) {
			result.addExponent(key as BaseUnit, this.exponents[key] * exponent);
		}
		return result;
	}

	public createSum(block: BaseUnitBlock): BaseUnitBlock {
		var result = block.createCopy();
		for (var key in this.exponents) {
			result.addExponent(key as BaseUnit, this.exponents[key]);
		}
		return result;
	}

	// Returns the factor which lets the parameter block best approach the current block
	// If this block is m^-5*s and the parameter is m, the result will be -5, as m^-5 is the closest approximation.
	public getBestFactor(block: BaseUnitBlock): number {
		var candidates: number[] = [];
		for (var key in this.exponents) {
			if (this.exponents[key] == 0 || block.getExponent(key as BaseUnit) == 0) {
				continue;
			}
			var factor = this.exponents[key] / block.getExponent(key as BaseUnit);
			if (factor != 0 && candidates.indexOf(factor) == -1) {
				candidates.push(factor);
			}
		}
		var bestFactor = 0;
		var bestDistance = this.getDistance(BaseUnitBlock.one);
		for (var candidate of candidates) {
			var distance = this.getDistance(block.createMultiple(candidate));
			if (distance < bestDistance) {
				bestDistance = distance;
				bestFactor = candidate;
			}
		}
		return bestFactor;
	}

	public addExponent(baseUnit: BaseUnit, amount: number) {
		if (this.exponents[baseUnit] == undefined) {
			this.exponents[baseUnit] = 0;
		}
		this.exponents[baseUnit] += amount;
		if (this.exponents[baseUnit] == 0) {
			delete this.exponents[baseUnit];
		}
	}

	public getExponent(baseUnit: BaseUnit): number {
		if (this.exponents[baseUnit] == undefined) {
			return 0;
		} else {
			return this.exponents[baseUnit];
		}
	}

	public getActiveBaseUnits(): BaseUnit[] {
		var result = [];
		for (var key in this.exponents) {
			result.push(key as BaseUnit);
		}
		return result;
	}

	public isOne(): boolean {
		return Object.keys(this.exponents).length == 0;
	}

	public getExponentCount(): number {
		return Object.keys(this.exponents).length;
	}
}
