using Microsoft.EntityFrameworkCore;
using BusServiceAPI.Models;
using BusServiceAPI.Common;
using Microsoft.Extensions.Configuration;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS policy to allow all origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", builder =>
    {
        builder.AllowAnyOrigin()  // Allow any origin
               .AllowAnyMethod()  // Allow any HTTP method
               .AllowAnyHeader();  // Allow any headers
    });
});

builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Add both HTTP and HTTPS ports
    serverOptions.Listen(IPAddress.Any, 5099);  // HTTP port
    serverOptions.Listen(IPAddress.Any, 7169, listenOptions =>
    {
        listenOptions.UseHttps();  // HTTPS port
    });
});

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

// Use CORS middleware with the defined policy
app.UseCors("AllowAllOrigins");

app.MapGet("/", () => "Hello World!");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
