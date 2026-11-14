import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { TodoService } from './todo.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let http: HttpTestingController;
  let apiUrl: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    http = TestBed.inject(HttpTestingController);
    apiUrl = TestBed.inject(TodoService).apiUrl;
  });

  it('shows the heading', () => {
    fixture.detectChanges();
    http.expectOne(apiUrl).flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('My Tasks');
  });

  it('renders todos returned by the API', () => {
    fixture.detectChanges();
    http.expectOne(apiUrl).flush([
      { id: 1, title: 'First task', isCompleted: false, createdAt: '2024-01-01' },
      { id: 2, title: 'Second task', isCompleted: true, createdAt: '2024-01-02' },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(2);
  });

  it('shows an error message when the API is down', () => {
    fixture.detectChanges();
    http.expectOne(apiUrl).error(new ProgressEvent('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.error')).toBeTruthy();
  });
});
