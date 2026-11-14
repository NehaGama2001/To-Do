using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Controllers;
using TodoApi.Data;
using TodoApi.Models;
using Xunit;

namespace TodoApi.Tests;

public class TodosControllerTests
{
    // Each test gets its own fresh in-memory database
    private static AppDbContext CreateDb()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_ReturnsCreatedTodo_AndSavesIt()
    {
        using var db = CreateDb();
        var controller = new TodosController(db);

        var result = await controller.Create(new TodoItem { Title = "Learn GitHub Actions" });

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var todo = Assert.IsType<TodoItem>(created.Value);
        Assert.Equal("Learn GitHub Actions", todo.Title);
        Assert.False(todo.IsCompleted);
        Assert.Equal(1, await db.Todos.CountAsync());
    }

    [Fact]
    public async Task GetAll_ReturnsAllTodos()
    {
        using var db = CreateDb();
        db.Todos.AddRange(new TodoItem { Title = "One" }, new TodoItem { Title = "Two" });
        await db.SaveChangesAsync();
        var controller = new TodosController(db);

        var result = await controller.GetAll();

        Assert.Equal(2, result.Value!.Count());
    }

    [Fact]
    public async Task GetById_ReturnsNotFound_WhenMissing()
    {
        using var db = CreateDb();
        var controller = new TodosController(db);

        var result = await controller.GetById(999);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task Update_MarksTodoAsCompleted()
    {
        using var db = CreateDb();
        db.Todos.Add(new TodoItem { Title = "Write tests" });
        await db.SaveChangesAsync();
        var id = (await db.Todos.FirstAsync()).Id;
        var controller = new TodosController(db);

        var result = await controller.Update(id, new TodoItem { Title = "Write tests", IsCompleted = true });

        Assert.IsType<NoContentResult>(result);
        Assert.True((await db.Todos.FindAsync(id))!.IsCompleted);
    }

    [Fact]
    public async Task Delete_RemovesTodo()
    {
        using var db = CreateDb();
        db.Todos.Add(new TodoItem { Title = "Delete me" });
        await db.SaveChangesAsync();
        var id = (await db.Todos.FirstAsync()).Id;
        var controller = new TodosController(db);

        var result = await controller.Delete(id);

        Assert.IsType<NoContentResult>(result);
        Assert.Equal(0, await db.Todos.CountAsync());
    }
}
