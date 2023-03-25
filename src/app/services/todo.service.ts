import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Todo {
  id?: string;
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

  constructor(private readonly httpClient: HttpClient) {
    // this.setItems([
    //   {
    //     id: 1,
    //     title: 'First Todo',
    //     description: 'A first test of our todo item component!',
    //     done: false,
    //     active: false,
    //   },
    //   {
    //     id: 2,
    //     title: 'Second Todo',
    //     description: 'A second test of our todo item component!',
    //     done: false,
    //     active: false,
    //   },
    // ]);
  }

  get TodoSubject() {
    return this.todoSubject.asObservable();
  }

  getTodos() {
    this.httpClient
      .get<Todo[]>('http://localhost:3000/todo', {
        observe: 'body',
        reportProgress: true,
      })
      .pipe(
        map((t) =>
          t.map((todo) => {
            return { ...todo, active: false };
          })
        )
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.todoSubject.next(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  // Brauchen wir nicht mehr, da alles vom Server kommt
  setItems(todos: Todo[]) {
    this.todoSubject.next(todos);
    this.lastId = todos.length;
  }

  // Normal übergeben wir die ID als Parameter
  updateItem(todo: Todo) {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    const currentItemIndex = currentTodos.findIndex((f) => f.id === todo.id);
    if (currentItemIndex > -1) {
      this.httpClient.put<Todo>('http://localhost:3000/todo', todo).subscribe({
        next: (data) => {
          // Da nur ein Item, setzen wir es manuell ohne "map"
          data.active = true;
          currentTodos[currentItemIndex] = data;
          this.todoSubject.next(currentTodos);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  addItem(todo: Todo): Todo {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    // Brauchen wir nicht mehr -> Macht jetzt das Backend
    // todo.id = this.lastId + 1;
    // this.lastId++;

    this.httpClient.post<Todo>('http://localhost:3000/todo', todo).subscribe({
      next: (data) => {
        // Da nur ein Item, setzen wir es manuell ohne "map"
        data.active = true;
        todo = data;
        currentTodos.push(data);
        this.todoSubject.next(currentTodos);
      },
      error: (err) => {
        console.log(err);
      },
    });

    return todo;
  }

  // id ändern auf string
  deleteItem(id: string) {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    const currentItemIndex = currentTodos.findIndex((f) => f.id === id);
    if (currentItemIndex > -1) {
      this.httpClient
        .delete<Todo>('http://localhost:3000/todo/' + id)
        .subscribe({
          next: (data) => {
            // Da nur ein Item, setzen wir es manuell ohne "map"
            currentTodos.splice(currentItemIndex, 1);
            this.todoSubject.next(currentTodos);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  doneItem(id: string) {
    const currentTodos: Todo[] = this.todoSubject.getValue();
    const currentItemIndex = currentTodos.findIndex((f) => f.id === id);
    if (currentItemIndex > -1) {
      const todo = currentTodos[currentItemIndex];
      todo.done = true;

      this.httpClient.put<Todo>('http://localhost:3000/todo', todo).subscribe({
        next: (data) => {
          // Da nur ein Item, setzen wir es manuell ohne "map"
          currentTodos[currentItemIndex].done = true;
          this.todoSubject.next(currentTodos);
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }
}
