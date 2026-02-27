using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ======================
// ? ADD CONTROLLERS
// ======================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// ======================
// ? DATABASE CONTEXT (SQL SERVER)
// ======================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                      ?? builder.Configuration["DefaultConnection"]
                      ?? throw new Exception("Database connection string missing in BOTH 'ConnectionStrings:DefaultConnection' AND 'DefaultConnection'");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString)
);

// ======================
// ? CORS CONFIGURATION
// ======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "https://nutrifit-app.azurewebsites.net",
                "https://nutrifit-topaz.vercel.app",
                "https://nutrifit-bklgk8ci6-hrushikeshs-projects-7e5112e4.vercel.app",
                "http://localhost:3000"
              )
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Necessary for some auth flows
    });
});


// ======================
// ? SWAGGER (Development Only)
// ======================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "NutriFit API",
        Version = "v1"
    });

    // JWT Authentication in Swagger
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        Scheme = "bearer",
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Description = "Enter JWT token",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };

    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// ======================
// ? JWT AUTHENTICATION
// ======================
var jwtKey = builder.Configuration["Jwt:Key"]
             ?? throw new Exception("JWT Key is missing");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),
            ClockSkew = TimeSpan.Zero
        };
    });

// ======================
// ? BUILD APP
// ======================
var app = builder.Build();

// ======================
// ? MIDDLEWARE PIPELINE
// ======================
app.UseCors("AllowFrontend"); // CORS MUST come before auth

app.UseAuthentication();
app.UseAuthorization();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "NutriFit API v1");
        c.RoutePrefix = "swagger"; // Swagger available at /swagger
    });

    app.UseDeveloperExceptionPage();
}
else
{
    // Production: Azure Linux - HTTPS handled by platform
    // app.UseHttpsRedirection(); // optional on Azure
}

// ======================
// ? MAP CONTROLLERS
// ======================
app.MapControllers();

// ======================
// ? HEALTH CHECK
// ======================
app.MapGet("/", () => "?? NutriFit API is running");

// ======================
// ? RUN APP
// ======================
app.Run();

