using ErrorLine;
using ErrorLine.Context;
using ErrorLine.Entities;
using ErrorLine.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
namespace ErrorLine
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

            builder.Services.AddDbContext<AppDbContext>(options =>
                                                               options.UseSqlServer(connectionString));

            builder.Services.AddScoped<IIssueReportService, IssueReportService>();
            builder.Services.AddScoped<INoteService, NoteService>();
            builder.Services.AddScoped<IOrderService, OrderService>();
            builder.Services.AddScoped<IEquipmentService, EquipmentService>();
            builder.Services.AddScoped<ILocationService, LocationService>();
            builder.Services.AddScoped<IDormitaryService, DormitoryService>();
            builder.Services.AddScoped<IUserService, UserService>();

            //===== Add Jwt Authentication ========
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
            builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = false;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"])),
                        ClockSkew = TimeSpan.Zero
                    };
                });

            builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

            builder.Services.AddControllers();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontendDev",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5174")
                              .AllowAnyHeader()
                              .AllowAnyMethod()
                              .AllowCredentials();
                    });
            });

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "NetpincerApp API", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please insert JWT token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });
                c.AddSecurityRequirement(new OpenApiSecurityRequirement {
                {
                    new OpenApiSecurityScheme {
                        Reference = new OpenApiReference {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }});
            });

            var app = builder.Build();

            SeedSystemAdminAsync(app.Services).GetAwaiter().GetResult();

            static async Task SeedSystemAdminAsync(IServiceProvider serviceProvider)
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                if (!context.Users.Any(u => u.Role == UserRole.SystemAdmin))
                {
                    var systemAdmin = new User
                    {
                        Username = "systemadmin",
                        Email = "systemadmin@example.com",
                        Password = BCrypt.Net.BCrypt.HashPassword("Jelszo123!"),
                        Role = UserRole.SystemAdmin,
                        DormitoryId = null
                    };
                    context.Users.Add(systemAdmin);
                    await context.SaveChangesAsync();
                }
            }

            if (app.Environment.IsDevelopment())
            {
                
                app.UseSwagger();
                app.UseSwaggerUI();

            }

            app.UseHttpsRedirection();

            app.UseCors("AllowFrontendDev");

            app.UseAuthentication();

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
