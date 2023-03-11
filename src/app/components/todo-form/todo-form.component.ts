import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo, TodoService } from 'src/app/services/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss'],
})
export class TodoFormComponent implements OnChanges {
  @Input() editTodo!: Todo | null;
  titleValue!: string;
  descriptionValue!: string;

  constructor(private todoService: TodoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editTodo']) {
      if (changes['editTodo'].currentValue) {
        // Todo übergeben
        this.titleValue = changes['editTodo'].currentValue.title;
        this.descriptionValue = changes['editTodo'].currentValue.description;
      } else {
        // Kein Todo vorhanden
        this.titleValue = '';
        this.descriptionValue = '';
      }
    }
  }

  onSaveClick() {
    // Wenn nicht "null" - geändert
    if (this.editTodo) {
      this.editTodo.title = this.titleValue;
      this.editTodo.description = this.descriptionValue;

      this.todoService.updateItem(this.editTodo);
    } else {
      this.editTodo = this.todoService.addItem({
        title: this.titleValue,
        description: this.descriptionValue,
        done: false,
        active: true,
      });
    }
  }

  onDeleteClick() {
    this.todoService.deleteItem(this.editTodo!.id!);
    this.editTodo = null;
    this.titleValue = '';
    this.descriptionValue = '';
  }
}
