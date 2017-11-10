import { Task } from "../calculator/Task";

export class TaskElement {
	public static elementPrototype: HTMLElement | null;

	public readonly task: Task;

	public nextElement: TaskElement | null;

	public readonly htmlElement: HTMLElement;
	public readonly queryElement: HTMLInputElement;
	public readonly resultElement: HTMLSpanElement;

	public constructor(task: Task, container: HTMLElement) {
		this.task = task;
		this.nextElement = null;

		if (TaskElement.elementPrototype == null) {
			TaskElement.elementPrototype = document.getElementById("taskPrototype") as HTMLElement;
			TaskElement.elementPrototype.parentElement!.removeChild(TaskElement.elementPrototype);
		}

		this.htmlElement = TaskElement.elementPrototype.cloneNode(true) as HTMLElement;
		container.appendChild(this.htmlElement);
		this.queryElement = (this.htmlElement.getElementsByClassName("query").item(0) as HTMLInputElement);
		this.resultElement = (this.htmlElement.getElementsByClassName("result").item(0) as HTMLSpanElement);

		this.showResult();

		var el = this;
		this.queryElement.addEventListener("input", () => { el.readQueryAndUpdate(); });
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

	public readQueryAndUpdate(forceUpdate = false) {
		var newQuery = this.queryElement.value;
		if (newQuery == this.task.query && !forceUpdate) {
			return;
		}
		this.task.update(newQuery);
		this.showResult();
		if (this.nextElement != null) {
			this.nextElement.readQueryAndUpdate(true);
		}
	}

	public focus() {
		this.queryElement.focus();
		setTimeout(() => { this.queryElement.setSelectionRange(this.queryElement.value.length, this.queryElement.value.length); }, 0);
	}
}
