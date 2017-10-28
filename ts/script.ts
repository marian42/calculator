import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';

import { CalculatorLexer } from "./generated/CalculatorLexer";
import { CalculatorParser } from "./generated/CalculatorParser";
import { CalculatorVisitorImpl } from "./calculator/CalculatorVisitorImpl";
import { ExpressionStatement } from "./calculator/ExpressionStatement"

function test(query: string): void {
	let inputStream = new ANTLRInputStream(query);
	let lexer = new CalculatorLexer(inputStream);
	let tokenStream = new CommonTokenStream(lexer);
	let parser = new CalculatorParser(tokenStream);

	let visitor = new CalculatorVisitorImpl();
	let result = parser.statement().accept(visitor);

	console.log(query + " >> " + result.value);
}

test("3 * 3 + 4 * (5 + 1)");
