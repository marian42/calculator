import { Result } from "./Result";

import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { CalculatorLexer } from "../generated/CalculatorLexer";
import { CalculatorParser } from "../generated/CalculatorParser";
import { CalculatorVisitorImpl } from "../calculator/CalculatorVisitorImpl";
import { Constants } from "./Constants";
import { CustomFunction, CalculatorFunction } from "./CalculatorFunction";

export class Task {
	public readonly previousTask: Task | null;

	public query: string;
	public result: Result | null;
	public error: Error | null;

	public exportedVariable: string | null;
	public exportedFunction: CustomFunction | null;

	public parser: CalculatorParser | null;

	constructor(previousTask?: Task) {
		this.query = "";
		this.result = null;
		this.error = null;
		if (previousTask != undefined) {
			this.previousTask = previousTask;
		}
	}

	update(query: string): void {
		this.query = query;
		this.result = null;

		try {
			let inputStream = new ANTLRInputStream(query);
			let lexer = new CalculatorLexer(inputStream);
			let tokenStream = new CommonTokenStream(lexer);
			this.parser = new CalculatorParser(tokenStream);

			let visitor = new CalculatorVisitorImpl(this);
			this.result = this.parser.statement().accept(visitor);
		} catch (e) {
			this.error = e;
			console.error(e);
		}
	}

	public resolveName(name: string): Result {
		if (this.previousTask != null && this.previousTask.exportedVariable != null && this.previousTask.exportedVariable == name && this.previousTask.result != null) {
			return this.previousTask.result!;
		}
		if ((name == "ans" || name == "answer") && this.previousTask != null && this.previousTask.result != null) {
			return this.previousTask.result!;
		}
		if (this.previousTask == null) {
			if (Constants.constants[name] != undefined) {
				return Constants.constants[name];
			} else {
				throw new Error("Unknown identifier: " + name);
			}
		}
		return this.previousTask.resolveName(name);
	}

	public resolveFunction(name: string): CalculatorFunction {
		if (this.previousTask != null && this.previousTask.exportedFunction != null && this.previousTask.exportedFunction.name == name) {
			return this.previousTask.exportedFunction;
		}
		if (this.previousTask != null) {
			return this.previousTask.resolveFunction(name);
		}
		if (Constants.functions[name] != undefined) {
			return Constants.functions[name];
		}

		throw new Error("Unknown function identifier " + name);
	}
}
