import { TaskElement } from "./TaskElement";
import { Task } from "../calculator/Task";

export class App {
	public taskContainer: HTMLElement;
	public tasks: TaskElement[];

	private url: URL;

	constructor() {
		this.taskContainer = document.getElementsByClassName("cards").item(0) as HTMLElement;
		this.tasks = [];
		this.checkUrlQuery();
		this.addTask().focus();
	}

	private checkUrlQuery() {
		this.url = new URL(window.location.href);
		if (this.url.searchParams.get("q") == null) {
			return;
		}
		var lines = this.url.searchParams.get("q")!.split("\n");
		for (var line of lines) {
			var task = this.addTask();
			task.task.update(line);
			task.queryElement.value = line;
			task.showResult();
		}
	}

	private addTask(): TaskElement {
		var task = new Task(this.tasks.length > 0 ? this.tasks[this.tasks.length - 1].task : undefined);
		var element = new TaskElement(task, this.taskContainer);
		if (this.tasks.length > 0) {
			this.tasks[this.tasks.length - 1].nextElement = element;
		}
		this.tasks.push(element);
		let app = this;
		element.queryElement.addEventListener("keydown", event => app.onKeyPress(event, element));
		element.queryElement.addEventListener("blur", event => app.onBlur(event, element));
		return element;
	}

	private updateQueryParameter() {
		var result = "";
		for (var task of this.tasks) {
			result += task.task.query + "\n";
		}
		result = result.trim();
		if (this.url.searchParams.get("q") == result) {
			return;
		}
		this.url.searchParams.set("q", result);
		history.replaceState(null, document.title, this.url.href);
	}

	private removeTask(index: number) {
		var taskElement = this.tasks[index];
		this.taskContainer.removeChild(taskElement.htmlElement);
		this.tasks.splice(index, 1);
		if (taskElement.nextElement != null) {
			taskElement.nextElement!.task.previousTask = taskElement.task.previousTask;
		}
		if (index > 0) {
			this.tasks[index - 1].nextElement = this.tasks[index];
		}
	}

	private onKeyPress(event: KeyboardEvent, taskElement: TaskElement) {
		let index = this.tasks.indexOf(taskElement);
		if (event.keyCode == 13) { // Enter
			if (index == this.tasks.length - 1) {
				let oldTaskElement = this.tasks[this.tasks.length - 1];
				if (oldTaskElement.task.result != null) {
				}
				if (oldTaskElement.task.error != null) {
					console.log(oldTaskElement.task.error);
				}
				let newTask = this.addTask();
				newTask.queryElement.focus();
				window.scrollTo(0, this.taskContainer.scrollHeight);
			} else {
				this.tasks[index + 1].focus();
			}
			this.onFinalize(taskElement);
		}
		if (event.keyCode == 38) { // Up
			this.tasks[(index - 1 + this.tasks.length) % this.tasks.length].focus();
		}
		if (event.keyCode == 40) { // Down
			this.tasks[(index + 1) % this.tasks.length].focus();
		}
		if (event.keyCode == 8 && taskElement.queryElement.value.length == 0 && this.tasks.length > 1) { // Bckspace
			this.removeTask(index);
			this.tasks[Math.max(0, index - 1)].focus();
			event.preventDefault();
		}
		if (event.keyCode == 46 && taskElement.queryElement.value.length == 0 && this.tasks.length > 1) { // Delete
			this.removeTask(index);
			this.tasks[Math.min(index, this.tasks.length - 1)].focus(false);
			event.preventDefault();
		}
	}

	private onFinalize(taskElement: TaskElement) {
		this.updateQueryParameter();
	}

	private onBlur(event: Event, taskElement: TaskElement) {
		this.onFinalize(taskElement);
	}
}
