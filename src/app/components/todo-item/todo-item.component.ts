import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss'],
})
export class TodoItemComponent {
  @Input() item!: Todo;
  @Output() onItemClick = new EventEmitter<MouseEvent>();

  constructor(private todoService: TodoService) {}

  onContainerClick(event: MouseEvent) {
    this.onItemClick.emit(event);
  }

  onDoneClick(id: number | undefined) {
    if (id) this.todoService.doneItem(id);
  }
}
