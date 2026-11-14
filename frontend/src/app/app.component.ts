import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private readonly todoService = inject(TodoService);

  todos: Todo[] = [];
  newTitle = '';
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.todoService.getAll().subscribe({
      next: (data) => {
        this.todos = data;
        this.error = '';
      },
      error: () => (this.error = 'Could not reach the API. Is the backend running on port 5000?'),
    });
  }

  add(): void {
    const title = this.newTitle.trim();
    if (!title) return;

    this.todoService.add(title).subscribe({
      next: (todo) => {
        this.todos = [todo, ...this.todos];
        this.newTitle = '';
      },
      error: () => (this.error = 'Could not add the task.'),
    });
  }

  toggle(todo: Todo): void {
    const updated = { ...todo, isCompleted: !todo.isCompleted };
    this.todoService.update(updated).subscribe({
      next: () => (todo.isCompleted = updated.isCompleted),
      error: () => (this.error = 'Could not update the task.'),
    });
  }

  remove(todo: Todo): void {
    this.todoService.delete(todo.id).subscribe({
      next: () => (this.todos = this.todos.filter((t) => t.id !== todo.id)),
      error: () => (this.error = 'Could not delete the task.'),
    });
  }
}
