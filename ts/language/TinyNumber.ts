export class TinyNumber {
	private static readonly tinyCharacters = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⋅ᵉ";
	private static readonly normalCharacters = "0123456789+-.e";

	public static toTiny(value: string): string {
		var result = "";
		for (var i = 0; i < value.length; i++) {
			let index = TinyNumber.normalCharacters.indexOf(value[i]);
			if (index != -1) {
				result += TinyNumber.tinyCharacters[index];
			}
		}
		return result;
	}

	public static toNormal(value: string): string {
		var result = "";
		for (var i = 0; i < value.length; i++) {
			let index = TinyNumber.tinyCharacters.indexOf(value[i]);
			if (index != -1) {
				result += TinyNumber.normalCharacters[index];
			}
		}
		return result;
	}

	public static create(value: number): string {
		return TinyNumber.toTiny(value.toString());
	}

	public static parse(value: string): number {
		return Number.parseFloat(TinyNumber.toNormal(value));
	}
}
