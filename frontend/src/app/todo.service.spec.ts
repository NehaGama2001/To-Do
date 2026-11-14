import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo } from './todo.model';

describe('TodoService', () => {
  let service: TodoService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TodoService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('gets all todos with GET', () => {
    const mock: Todo[] = [{ id: 1, title: 'A', isCompleted: false, createdAt: '2024-01-01' }];

    service.getAll().subscribe((todos) => expect(todos).toEqual(mock));

    const req = http.expectOne(service.apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('adds a todo with POST', () => {
    service.add('Learn Angular').subscribe();

    const req = http.expectOne(service.apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ title: 'Learn Angular' });
    req.flush({ id: 1, title: 'Learn Angular', isCompleted: false, createdAt: '2024-01-01' });
  });

  it('deletes a todo with DELETE', () => {
    service.delete(5).subscribe();

    const req = http.expectOne(`${service.apiUrl}/5`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
