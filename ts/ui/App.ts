import { TaskElement } from "./TaskElement";
import { Task } from "../calculator/Task";

export class App {
	public taskContainer: HTMLElement;
	public tasks: TaskElement[];

	constructor() {
		this.taskContainer = document.getElementsByClassName("cards").item(0) as HTMLElement;
		this.tasks = [];
		this.addTask().focus();
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
		return element;
	}

	private onKeyPress(event: KeyboardEvent, taskElement: TaskElement) {
		let index = this.tasks.indexOf(taskElement);
		if (event.keyCode == 13 && index == this.tasks.length - 1) {
			let oldTaskElement = this.tasks[this.tasks.length - 1];
			if (oldTaskElement.task.result != null) {
			}
			if (oldTaskElement.task.error != null) {
				console.log(oldTaskElement.task.error);
			}
			let newTask = this.addTask();
			newTask.queryElement.focus();
			this.taskContainer.scrollTo(0, this.taskContainer.scrollHeight);
		}
		if (event.keyCode == 13 && index < this.tasks.length - 1) {
			this.tasks[index + 1].focus();
		}
		if (event.keyCode == 38) {
			this.tasks[(index - 1 + this.tasks.length) % this.tasks.length].focus();
		}
		if (event.keyCode == 40) {
			this.tasks[(index + 1) % this.tasks.length].focus();
		}
	}
}
