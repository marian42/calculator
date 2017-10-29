import { TaskElement } from "./TaskElement";
import { Task } from "../calculator/Task";
import { CalculatorContext } from "../calculator/CalculatorContext";

export class App {
	public taskContainer: HTMLElement;
	public tasks: TaskElement[];
	public context: CalculatorContext;

	constructor() {
		this.taskContainer = document.getElementsByClassName("tasks").item(0) as HTMLElement;
		this.tasks = [];
		this.context = new CalculatorContext();
		this.addTask();
	}

	private addTask(): TaskElement {
		var task = new Task(this.context);
		var element = new TaskElement(task, this.taskContainer);
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
				this.context.variables["ans"] = oldTaskElement.task.result!;
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
