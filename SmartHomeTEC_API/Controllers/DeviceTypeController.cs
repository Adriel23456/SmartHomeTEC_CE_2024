using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;
using SmartHomeTEC_API.DTOs;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeviceTypeController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/DeviceType
        /// <summary>
        /// Obtiene todos los tipos de dispositivos.
        /// </summary>
        /// <returns>Lista de DeviceTypeDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceTypeDTO>>> GetDeviceTypes()
        {
            var deviceTypes = await _context.DeviceType.ToListAsync();
            return _mapper.Map<List<DeviceTypeDTO>>(deviceTypes);
        }

        // GET: api/DeviceType/{name}
        /// <summary>
        /// Obtiene un tipo de dispositivo específico por su nombre.
        /// </summary>
        /// <param name="name">Nombre del DeviceType</param>
        /// <returns>Objeto DeviceTypeDTO</returns>
        [HttpGet("{name}")]
        public async Task<ActionResult<DeviceTypeDTO>> GetDeviceType(string name)
        {
            var deviceType = await _context.DeviceType.FindAsync(name);

            if (deviceType == null)
            {
                return NotFound();
            }

            return _mapper.Map<DeviceTypeDTO>(deviceType);
        }

        // POST: api/DeviceType
        /// <summary>
        /// Crea un nuevo tipo de dispositivo.
        /// </summary>
        /// <param name="deviceTypeDTO">Objeto DeviceTypeDTO</param>
        /// <returns>Objeto DeviceTypeDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<DeviceTypeDTO>> PostDeviceType(DeviceTypeDTO deviceTypeDTO)
        {
            // Verificar si el DeviceType ya existe
            if (DeviceTypeExists(deviceTypeDTO.Name))
            {
                return Conflict("El tipo de dispositivo con este nombre ya existe.");
            }

            // Mapear DTO a Entidad
            var deviceType = _mapper.Map<DeviceType>(deviceTypeDTO);

            _context.DeviceType.Add(deviceType);
            await _context.SaveChangesAsync();

            var createdDeviceTypeDTO = _mapper.Map<DeviceTypeDTO>(deviceType);

            return CreatedAtAction(nameof(GetDeviceType), new { name = deviceType.Name }, createdDeviceTypeDTO);
        }

        // PUT: api/DeviceType/{name}
        /// <summary>
        /// Actualiza un tipo de dispositivo existente.
        /// </summary>
        /// <param name="name">Nombre del DeviceType a actualizar</param>
        /// <param name="deviceTypeDTO">Objeto DeviceTypeDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{name}")]
        public async Task<IActionResult> PutDeviceType(string name, DeviceTypeDTO deviceTypeDTO)
        {
            if (name != deviceTypeDTO.Name)
            {
                return BadRequest("El nombre del tipo de dispositivo no coincide.");
            }

            // Mapear DTO a Entidad
            var deviceType = _mapper.Map<DeviceType>(deviceTypeDTO);

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

        // DELETE: api/DeviceType/{name}
        /// <summary>
        /// Elimina un tipo de dispositivo específico por su nombre.
        /// </summary>
        /// <param name="name">Nombre del tipo de dispositivo a eliminar</param>
        /// <returns>Estado de la operación</returns>
        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteDeviceType(string name)
        {
            var deviceType = await _context.DeviceType.FindAsync(name);
            if (deviceType == null)
            {
                return NotFound("El tipo de dispositivo no existe.");
            }

            _context.DeviceType.Remove(deviceType);
            await _context.SaveChangesAsync();

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