import { Statement } from "./Statement";
import { Result } from "./Result";

export class ExpressionStatement extends Statement {
	public readonly result: Result;

	public constructor(result: Result) {
		super();
		this.result = result;
	}
}
