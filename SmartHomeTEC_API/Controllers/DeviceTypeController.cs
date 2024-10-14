using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DeviceTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DeviceType
        /// <summary>
        /// Obtiene todos los tipos de dispositivos.
        /// </summary>
        /// <returns>Lista de DeviceType</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceType>>> GetDeviceTypes()
        {
            return await _context.DeviceType.ToListAsync();
        }

        // GET: api/DeviceType/{name}
        /// <summary>
        /// Obtiene un tipo de dispositivo específico por su nombre.
        /// </summary>
        /// <param name="name">Nombre del DeviceType</param>
        /// <returns>Objeto DeviceType</returns>
        [HttpGet("{name}")]
        public async Task<ActionResult<DeviceType>> GetDeviceType(string name)
        {
            var deviceType = await _context.DeviceType.FindAsync(name);

            if (deviceType == null)
            {
                return NotFound();
            }

            return deviceType;
        }

        // POST: api/DeviceType
        /// <summary>
        /// Crea un nuevo tipo de dispositivo.
        /// </summary>
        /// <param name="deviceType">Objeto DeviceType</param>
        /// <returns>Objeto DeviceType creado</returns>
        [HttpPost]
        public async Task<ActionResult<DeviceType>> PostDeviceType(DeviceType deviceType)
        {
            // Verificar si el DeviceType ya existe
            if (DeviceTypeExists(deviceType.Name))
            {
                return Conflict("El tipo de dispositivo con este nombre ya existe.");
            }

            _context.DeviceType.Add(deviceType);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDeviceType), new { name = deviceType.Name }, deviceType);
        }

        // PUT: api/DeviceType/{name}
        /// <summary>
        /// Actualiza un tipo de dispositivo existente.
        /// </summary>
        /// <param name="name">Nombre del DeviceType a actualizar</param>
        /// <param name="deviceType">Objeto DeviceType con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{name}")]
        public async Task<IActionResult> PutDeviceType(string name, DeviceType deviceType)
        {
            if (name != deviceType.Name)
            {
                return BadRequest("El nombre del tipo de dispositivo no coincide.");
            }

            _context.Entry(deviceType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceTypeExists(name))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si un DeviceType existe por su nombre.
        /// </summary>
        /// <param name="name">Nombre del DeviceType</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool DeviceTypeExists(string name)
        {
            return _context.DeviceType.Any(e => e.Name == name);
        }
    }
}