import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Todo {
  id?: number;
  title: string;
  description: string;
  done: boolean;
  active: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  todoSubject: BehaviorSubject<Todo[]> = new BehaviorSubject([] as Todo[]);
  lastId: number = 0;

  constructor() {
    this.setItems([
      {
        id: 1,
        title: 'First Todo',
        description: 'A first test of our todo item component!',
        done: false,
        active: false,
      },
      {
        id: 2,
        title: 'Second Todo',
        description: 'A second test of our todo item component!',
        done: false,
        active: false,
      },
    ]);
  }

  get TodoSubject() {
    return this.todoSubject.asObservable();
  }

  setItems(todos: Todo[]) {
    this.todoSubject.next(todos);
    this.lastId = todos.length;
  }

  updateItem(todo: Todo) {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    const currentItemIndex = currentTodos.findIndex((f) => f.id === todo.id);
    if (currentItemIndex > -1) {
      currentTodos[currentItemIndex] = todo;
      this.todoSubject.next(currentTodos);
    }
  }

  addItem(todo: Todo): Todo {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    todo.id = this.lastId + 1;
    this.lastId++;
    currentTodos.push(todo);
    this.todoSubject.next(currentTodos);

    return todo;
  }

  deleteItem(id: number) {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    const currentItemIndex = currentTodos.findIndex((f) => f.id === id);
    if (currentItemIndex > -1) {
      currentTodos.splice(currentItemIndex, 1);
      this.todoSubject.next(currentTodos);
    }
  }

  doneItem(id: number) {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    const currentItemIndex = currentTodos.findIndex((f) => f.id === id);
    if (currentItemIndex > -1) {
      currentTodos[currentItemIndex].done = true;
      this.todoSubject.next(currentTodos);
    }
  }
}
