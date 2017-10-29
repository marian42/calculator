import { Result } from "./Result";

import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { CalculatorLexer } from "../generated/CalculatorLexer";
import { CalculatorParser } from "../generated/CalculatorParser";
import { CalculatorVisitorImpl } from "../calculator/CalculatorVisitorImpl";
import { ExpressionStatement } from "../calculator/ExpressionStatement";

export class Task {
	public query: string;
	public result: Result | null;
	public error: Error | null;

	public parser: CalculatorParser | null;

	constructor() {
		this.query = "";
		this.result = null;
		this.error = null;
	}

	update(query: string): void {
		this.query = query;
		this.result = null;

		try {
			let inputStream = new ANTLRInputStream(query);
			let lexer = new CalculatorLexer(inputStream);
			let tokenStream = new CommonTokenStream(lexer);
			this.parser = new CalculatorParser(tokenStream);

			let visitor = new CalculatorVisitorImpl();
			this.result = this.parser.statement().accept(visitor);
		} catch (e) {
			this.error = e;
		}
	}
}
