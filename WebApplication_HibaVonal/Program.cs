
using Microsoft.EntityFrameworkCore;

namespace WebApplication_HibaVonal
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = "Server = localhost;" +
                                   "Database = ErrorLineDb;" +
                                   "Trusted_Connection=True;" +
                                   "TrustServerCertificate = True";

            builder.Services.AddDbContext<ErrorLineDbContext>(options =>
                                                               options.UseSqlServer(connectionString));

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            //builder.Services.AddOpenApi();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.MapOpenApi();
            //}

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
            
        }
    }
}
