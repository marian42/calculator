import { BaseUnit } from "./BaseUnit";

export class BaseUnitBlock {
	private exponents: {[index: string] : number};

	constructor(exponents?: [BaseUnit, number][]) {
		this.exponents = {};
		if (exponents != undefined) {
			for (var item of exponents!) {
				this.exponents[item[0]] = item[1];
			}
		}
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
			result.push((<any>BaseUnit)[key]);
		}
		return result;
	}
}
