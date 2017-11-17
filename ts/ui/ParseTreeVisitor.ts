import { CalculatorVisitor } from "../generated/CalculatorVisitor";
import { } from '../generated/CalculatorParser';

import { ParseTreeVisitor } from 'antlr4ts/tree/ParseTreeVisitor';
import { ParseTree } from 'antlr4ts/tree/ParseTree';
import { ErrorNode } from 'antlr4ts/tree/ErrorNode';
import { RuleNode } from 'antlr4ts/tree/RuleNode';
import { TerminalNode } from 'antlr4ts/tree/TerminalNode';
import { Task } from '../calculator/Task';

import { Vocabulary } from 'antlr4ts/Vocabulary';

export class ParserTreeVisitor implements CalculatorVisitor<HTMLElement> {
	private readonly task : Task;
	private readonly vocabulary: Vocabulary;
	private readonly ruleNames: string[];

	constructor(task: Task, vocabulary: Vocabulary, ruleNames: string[]) {
		this.task = task;
		this.vocabulary = vocabulary;
		this.ruleNames = ruleNames;
	}

	private createHtmlElement(text: string): HTMLElement {
		var result = document.createElement("div");
		result.classList.add("parseTreeItem");
		result.innerText = text;
		return result;
	}

	visit(tree: ParseTree): any {
		return tree.accept(this);
	}

	visitChildren(node: RuleNode): any {
		var result = this.createHtmlElement(this.ruleNames[node.ruleContext.ruleIndex] + " (" + node.ruleContext.constructor.name.substring(0, node.ruleContext.constructor.name.length - 7) + "): " + node.text);
		for (var i = 0; i < node.childCount; i++) {
			result.appendChild(node.getChild(i).accept(this));
		}
		return result;
	}

	visitTerminal(node: TerminalNode): any {
		return this.createHtmlElement(this.vocabulary.getDisplayName(node.symbol.type) + ": " + node.text);
	}

	visitErrorNode(node: ErrorNode): any {
		var result = this.createHtmlElement(node.text);
		result.classList.add("error");
		return result;
	}
}
