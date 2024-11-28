using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Models;
using BusServiceAPI.Common;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();  // Needed for Swagger to work
builder.Services.AddSwaggerGen();  // Adds Swagger generation

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();  // Use Swagger middleware to serve the Swagger UI
    app.UseSwaggerUI();
}

app.MapGet("/", () => "Hello World!");


app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();



