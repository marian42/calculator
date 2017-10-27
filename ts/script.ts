import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';

import { CalculatorLexer } from "./generated/CalculatorLexer";
import { CalculatorParser } from "./generated/CalculatorParser";


// Create the lexer and parser
let inputStream = new ANTLRInputStream("text");
let lexer = new CalculatorLexer(inputStream);
let tokenStream = new CommonTokenStream(lexer);
let parser = new CalculatorParser(tokenStream);

// Parse the input, where `compilationUnit` is whatever entry point you defined
// let result = parser.compilationUnit();

console.log("Hello World");