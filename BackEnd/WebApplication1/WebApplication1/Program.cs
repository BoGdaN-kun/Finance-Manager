
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApplication1.Datacontext;
using WebApplication1.Hubs;
using WebApplication1.Interfaces;
using WebApplication1.Repository;

namespace WebApplication1
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);


            
            var key = Encoding.UTF8.GetBytes(builder.Configuration["JwtSettigns:key"]);

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddCookie(x =>
            {
                x.Cookie.Name = "token";
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        context.Token = context.Request.Cookies["token"];
                        return Task.CompletedTask;
                    }
                };
            });

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddSingleton<UserRepository>();

            builder.Services.AddScoped<IUserRepositoryAsync,UserRepositoryAsync>();
            builder.Services.AddScoped<ITransactionRepositoryAsync,TransactionRepositoryAsync>();
            builder.Services.AddSingleton<IUserRepositoryAsync, UserRepositoryAsync>();
            builder.Services.AddDbContextFactory<DataContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection2"));

            }); 
           // builder.Services.AddTransient<UserRepository>();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

            builder.Services.AddSignalR();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontendOrigin",
                    builder =>
                    {
                        builder
                            .WithOrigins("http://localhost:3000") // Adjust with your frontend origin
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });
            

            var app = builder.Build();

            //To enable CORS
            // Enable CORS



            /* app.UseCors(options =>
             {


                 options.AllowAnyOrigin(); // You can also use WithOrigins("http://example.com") to allow specific origins
                 options.AllowAnyMethod();
                 options.AllowAnyHeader();
                 options.SetIsOriginAllowed(origin => true); // Allow any origin
             });
             app.UseCors("AllowAll");*/
            app.UseCors("AllowFrontendOrigin");

            // Configure the HTTP request pipeline.
            app.UseSwagger();
            app.UseSwaggerUI();

            app.MapPost("api/braodcast", async (UserRepository userRepository) =>
            { 
                userRepository.GetUsers();
                return Results.Ok();
            });

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();
            

            app.MapControllers();

            app.MapHub<UserHub>("/userHub"); // Map your hub

            app.Run();
        }
    }
}
