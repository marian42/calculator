import { Task } from "../calculator/Task";

export class TaskElement {
	public static elementPrototype: HTMLElement | null;

	public readonly task: Task;

	public readonly htmlElement: HTMLElement;
	public readonly queryElement: HTMLInputElement;
	public readonly resultElement: HTMLInputElement;

	public constructor(task: Task, container: HTMLElement) {
		this.task = task;

		if (TaskElement.elementPrototype == null) {
			TaskElement.elementPrototype = document.getElementsByClassName("task").item(0) as HTMLElement;
			TaskElement.elementPrototype.parentElement!.removeChild(TaskElement.elementPrototype);
		}

		this.htmlElement = TaskElement.elementPrototype.cloneNode(true) as HTMLElement;
		container.appendChild(this.htmlElement);
		this.queryElement = (this.htmlElement.getElementsByClassName("query").item(0) as HTMLInputElement);
		this.resultElement = (this.htmlElement.getElementsByClassName("result").item(0) as HTMLInputElement);
		
		this.showResult();

		var el = this;
		this.queryElement.addEventListener("input", () => { el.readQueryAndUpdate(); });
	}

	private showResult() {
		if (this.task.result == null) {
			this.resultElement.value = "";
		} else {
			this.resultElement.value = this.task.result!.toString();
		}
	}

	public readQueryAndUpdate() {
		var newQuery = this.queryElement.value;
		if (newQuery == this.task.query) {
			return;
		}
		this.task.update(newQuery);
		this.showResult();
	}
}
