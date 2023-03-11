import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';
import { Todo, TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [TodoItemComponent, TodoFormComponent, CommonModule],
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  items: Todo[] = [];
  selectedTodo!: Todo | null;
  private todoSub!: Subscription;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.todoSub = this.todoService.TodoSubject.subscribe((data) => {
      this.items = data;
    });
  }

  ngOnDestroy(): void {
    this.todoSub.unsubscribe;
  }

  onItemClick(event: MouseEvent, index: number) {
    const unselect = this.items[index].active;
    this.selectedTodo = null;
    for (let item of this.items) {
      item.active = false;
    }
    if (!unselect) {
      this.items[index].active = true;
      this.selectedTodo = this.items[index];
    }
    console.log(this.items);
  }
}
