using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;
using SmartHomeTEC_API.Profiles;

var builder = WebApplication.CreateBuilder(args);

// ===============================
// 1. Configuración de Servicios
// ===============================

// Configurar IIS
builder.WebHost.UseIIS();

// Agregar AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Agregar servicios de controladores
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Configurar la cadena de conexión a PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Agregar servicios de Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===============================
// 2. Construcción de la Aplicación
// ===============================

var app = builder.Build();

// ===============================
// 3. Configuración del Middleware
// ===============================

// Usar Swagger en todos los entornos
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartHomeTEC API V1");
    c.RoutePrefix = string.Empty; // Esto hace que Swagger UI esté disponible en la raíz
});

// Configurar HTTPS
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();

// Aplicar CORS
app.UseCors("AllowAll");
app.UseAuthorization();

// Mapear controladores
app.MapControllers();

// ===============================
// 4. Ejecutar la Aplicación
// ===============================

app.Run();