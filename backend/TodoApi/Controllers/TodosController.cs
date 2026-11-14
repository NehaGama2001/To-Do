using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Models;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly AppDbContext _db;

    public TodosController(AppDbContext db) => _db = db;

    // GET api/todos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoItem>>> GetAll()
        => await _db.Todos.OrderByDescending(t => t.Id).ToListAsync();

    // GET api/todos/5
    [HttpGet("{id:int}")]
    public async Task<ActionResult<TodoItem>> GetById(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        return todo is null ? NotFound() : todo;
    }

    // POST api/todos
    [HttpPost]
    public async Task<ActionResult<TodoItem>> Create(TodoItem input)
    {
        var todo = new TodoItem
        {
            Title = input.Title,
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow
        };

        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = todo.Id }, todo);
    }

    // PUT api/todos/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TodoItem input)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null) return NotFound();

        todo.Title = input.Title;
        todo.IsCompleted = input.IsCompleted;
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // DELETE api/todos/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null) return NotFound();

        _db.Todos.Remove(todo);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
