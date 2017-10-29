export class Result {
	public readonly value: number;

	public constructor(value: number) {
		this.value = value;
	}

	public toString(): string {
		return this.value.toString();
	}
}
