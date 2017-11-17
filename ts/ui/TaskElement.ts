import { Task } from "../calculator/Task";
import { ANTLRInputStream, CommonTokenStream } from 'antlr4ts';
import { CalculatorLexer } from "../generated/CalculatorLexer";
import { CalculatorParser } from "../generated/CalculatorParser";
import { CalculatorVisitorImpl } from "../calculator/CalculatorVisitorImpl";
import { ParserTreeVisitor } from "./ParseTreeVisitor";
import { App } from "./App";

export class TaskElement {
	public static elementPrototype: HTMLElement | null;

	public readonly task: Task;

	public nextElement: TaskElement | null;

	public readonly htmlElement: HTMLElement;
	public readonly queryElement: HTMLInputElement;
	public readonly resultElement: HTMLSpanElement;

	private parseTreeContainer: HTMLElement | null;

	private focussed: boolean;

	public constructor(task: Task, container: HTMLElement) {
		this.task = task;
		this.nextElement = null;

		if (TaskElement.elementPrototype == null) {
			TaskElement.elementPrototype = document.getElementsByClassName("task")[0] as HTMLElement;
			TaskElement.elementPrototype.parentElement!.removeChild(TaskElement.elementPrototype);
		}

		this.htmlElement = TaskElement.elementPrototype.cloneNode(true) as HTMLElement;
		container.appendChild(this.htmlElement);
		this.queryElement = (this.htmlElement.getElementsByClassName("query").item(0) as HTMLInputElement);
		this.resultElement = (this.htmlElement.getElementsByClassName("result").item(0) as HTMLSpanElement);

		this.showResult();

		var el = this;
		this.queryElement.addEventListener("input", () => { el.readQueryAndUpdate(); });
		this.queryElement.addEventListener("focus", () => { el.onFocus(); });
		this.focussed = false;
	}

	public showResult() {
		if (this.task.result == null) {
			this.resultElement.innerText = "";
			this.queryElement.style.width = "calc(100% - 40px)";
		} else {
			this.resultElement.innerText = this.task.result!.toString();
			this.queryElement.style.width = "calc(100% - 40px - " + this.resultElement.clientWidth + "px)";
		}
	}

	private showParseTree() {
		if (!this.focussed) {
			return;
		}
		if (this.parseTreeContainer == null) {
			var card = document.createElement("div");
			card.classList.add("card");
			this.parseTreeContainer = document.createElement("div");
			this.parseTreeContainer.classList.add("contentcard");
			card.appendChild(this.parseTreeContainer);
			this.htmlElement.parentNode!.insertBefore(card, this.htmlElement);
		} else {
			this.parseTreeContainer.style.display = "block";
		}
		while (this.parseTreeContainer.hasChildNodes()) {
		    this.parseTreeContainer.removeChild(this.parseTreeContainer.lastChild!);
		}
		let inputStream = new ANTLRInputStream(this.task.query);
		let lexer = new CalculatorLexer(inputStream);
		let tokenStream = new CommonTokenStream(lexer);
		let parser = new CalculatorParser(tokenStream);
		let visitor = new ParserTreeVisitor(this.task, lexer.vocabulary, parser.ruleNames);

		tokenStream.fill();
		var tokenDiv = document.createElement("div");
		tokenDiv.textContent = "Tokens: " + tokenStream.getTokens()
			.map(token => lexer.vocabulary.getDisplayName(token.type))
			.filter(name => name != "WS")
			.join(", ");
		this.parseTreeContainer.appendChild(tokenDiv);

		this.parseTreeContainer.appendChild(parser.statement().accept(visitor));
	}

	public readQueryAndUpdate(forceUpdate = false) {
		var newQuery = this.queryElement.value;
		if (newQuery == this.task.query && !forceUpdate) {
			return;
		}
		this.task.update(newQuery);
		this.showResult();
		if (App.instance.showParseTree) {
			this.showParseTree();
		}
		if (this.nextElement != null) {
			this.nextElement.readQueryAndUpdate(true);
		}
	}

	public focus(moveCursorRight?: boolean) {
		if (moveCursorRight == undefined) {
			moveCursorRight = true;
		}
		this.queryElement.focus();
		var position = moveCursorRight ? this.queryElement.value.length : 0;
		setTimeout(() => { this.queryElement.setSelectionRange(position, position); }, 0);
	}

	public onFocus() {
		this.focussed = true;
		if (App.instance.showParseTree) {
			this.showParseTree();
		}
	}

	public hideParseTree() {
		if (this.parseTreeContainer != null) {
			this.parseTreeContainer.style.display = "none";
		}
	}

	public onUnselect() {
		this.hideParseTree();
		this.focussed = false;
	}
}
