import { Statement } from "./Statement";
import { Result } from "./Result";

export class AssignStatement extends Statement {
	public readonly expression: Result;
	public readonly variableName: string;

	public constructor(variableName: string, expression: Result) {
		super();
		this.expression = expression;
		this.variableName = variableName;
	}
}
