using ErrorLine_v2;
using ErrorLine_v2.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "Server = localhost;" +
                                   "Database = ErrorLineDb;" +
                                   "Trusted_Connection=True;" +
                                   "TrustServerCertificate = True";

builder.Services.AddDbContext<ErrorLineDbContext>(options =>
                                                   options.UseSqlServer(connectionString));

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddScoped<UnitOfWork>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
