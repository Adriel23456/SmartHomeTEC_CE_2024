using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;

var builder = WebApplication.CreateBuilder(args);

// ===============================
// 1. Configuración de Servicios
// ===============================

// Agregar servicios de controladores
builder.Services.AddControllers();

// Configurar la cadena de conexión a PostgreSQL desde appsettings.json
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configurar CORS para permitir cualquier origen, método y encabezado
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// Agregar servicios de Swagger/OpenAPI para documentación y pruebas
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===============================
// 2. Construcción de la Aplicación
// ===============================

var app = builder.Build();

// ===============================
// 3. Configuración del Middleware
// ===============================

// Configurar el middleware de Swagger solo en entorno de desarrollo
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Redirigir HTTP a HTTPS
app.UseHttpsRedirection();

// Aplicar la política de CORS definida anteriormente
app.UseCors("AllowAll");

// Configurar autorización (puedes ajustarlo según tus necesidades)
app.UseAuthorization();

// Mapear los controladores a las rutas de la API
app.MapControllers();

// ===============================
// 4. Ejecutar la Aplicación
// ===============================

app.Run();