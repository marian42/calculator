import { TaskElement } from "./TaskElement";
import { Task } from "../calculator/Task";

export class App {
	public taskContainer: HTMLElement;
	public tasks: TaskElement[];

	constructor() {
		this.taskContainer = document.getElementsByClassName("tasks").item(0) as HTMLElement;
		this.tasks = [];
		this.addTask();
	}

	private addTask(): TaskElement {
		var task = new Task();
		var element = new TaskElement(task, this.taskContainer);
		this.tasks.push(element);
		return element;
	}
}
