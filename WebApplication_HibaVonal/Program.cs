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

            
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            
            if (app.Environment.IsDevelopment())
            {
                
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ErrorLine API V1");
                    options.RoutePrefix = string.Empty; 
                });
            }

            app.UseHttpsRedirection(); 

            app.UseAuthorization(); 

            app.MapControllers(); 

            app.Run(); 
        }
    }
}
