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
    public class DeviceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeviceController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Device
        /// <summary>
        /// Obtiene todos los dispositivos.
        /// </summary>
        /// <returns>Lista de DeviceDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeviceDTO>>> GetDevices()
        {
            var devices = await _context.Device.ToListAsync();
            return _mapper.Map<List<DeviceDTO>>(devices);
        }

        // GET: api/Device/{serialNumber}
        /// <summary>
        /// Obtiene un dispositivo específico por su número de serie.
        /// </summary>
        /// <param name="serialNumber">Número de serie del Device</param>
        /// <returns>Objeto DeviceDTO</returns>
        [HttpGet("{serialNumber}")]
        public async Task<ActionResult<DeviceDTO>> GetDevice(int serialNumber)
        {
            var device = await _context.Device.FindAsync(serialNumber);

            if (device == null)
            {
                return NotFound();
            }

            return _mapper.Map<DeviceDTO>(device);
        }

        // POST: api/Device
        /// <summary>
        /// Crea un nuevo dispositivo.
        /// </summary>
        /// <param name="deviceDTO">Objeto DeviceDTO</param>
        /// <returns>Objeto DeviceDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<DeviceDTO>> PostDevice(DeviceDTO deviceDTO)
        {
            // Verificar si el Device ya existe
            if (DeviceExists(deviceDTO.SerialNumber))
            {
                return Conflict("El dispositivo con este número de serie ya existe.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(deviceDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El DeviceType especificado no existe.");
            }

            // Verificar si el Distributor existe (si se proporciona)
            if (deviceDTO.LegalNum.HasValue)
            {
                var distributor = await _context.Distributor.FindAsync(deviceDTO.LegalNum);
                if (distributor == null)
                {
                    return BadRequest("El Distributor especificado no existe.");
                }
            }

            // Mapear DTO a Entidad
            var device = _mapper.Map<Device>(deviceDTO);

            _context.Device.Add(device);
            await _context.SaveChangesAsync();

            var createdDeviceDTO = _mapper.Map<DeviceDTO>(device);

            return CreatedAtAction(nameof(GetDevice), new { serialNumber = device.SerialNumber }, createdDeviceDTO);
        }

        // PUT: api/Device/{serialNumber}
        /// <summary>
        /// Actualiza un dispositivo existente.
        /// </summary>
        /// <param name="serialNumber">Número de serie del Device a actualizar</param>
        /// <param name="deviceDTO">Objeto DeviceDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{serialNumber}")]
        public async Task<IActionResult> PutDevice(int serialNumber, DeviceDTO deviceDTO)
        {
            if (serialNumber != deviceDTO.SerialNumber)
            {
                return BadRequest("El número de serie del dispositivo no coincide.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(deviceDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El DeviceType especificado no existe.");
            }

            // Verificar si el Distributor existe (si se proporciona)
            if (deviceDTO.LegalNum.HasValue)
            {
                var distributor = await _context.Distributor.FindAsync(deviceDTO.LegalNum);
                if (distributor == null)
                {
                    return BadRequest("El Distributor especificado no existe.");
                }
            }

            // Mapear DTO a Entidad
            var device = _mapper.Map<Device>(deviceDTO);

            _context.Entry(device).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeviceExists(serialNumber))
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

        // GET: api/Device/Details
        /// <summary>
        /// Obtiene todos los dispositivos con sus respectivos DeviceType y Distributor.
        /// </summary>
        /// <returns>Lista de DeviceDetailDTO</returns>
        [HttpGet("Details")]
        public async Task<ActionResult<IEnumerable<DeviceDetailDTO>>> GetDeviceDetails()
        {
            var devices = await _context.Device
                .Include(d => d.DeviceType)
                .Include(d => d.Distributor)
                .ToListAsync();

            var deviceDetails = _mapper.Map<List<DeviceDetailDTO>>(devices);

            return deviceDetails;
        }

        // GET: api/Device/Details/{serialNumber}
        /// <summary>
        /// Obtiene un dispositivo específico por su número de serie junto con su DeviceType y Distributor.
        /// </summary>
        /// <param name="serialNumber">Número de serie del Device</param>
        /// <returns>Objeto DeviceDetailDTO</returns>
        [HttpGet("Details/{serialNumber}")]
        public async Task<ActionResult<DeviceDetailDTO>> GetDeviceDetails(int serialNumber)
        {
            var device = await _context.Device
                .Include(d => d.DeviceType)
                .Include(d => d.Distributor)
                .FirstOrDefaultAsync(d => d.SerialNumber == serialNumber);

            if (device == null)
            {
                return NotFound();
            }

            var deviceDetailDTO = _mapper.Map<DeviceDetailDTO>(device);
            return deviceDetailDTO;
        }

        /// <summary>
        /// Verifica si un Device existe por su número de serie.
        /// </summary>
        /// <param name="serialNumber">Número de serie del Device</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool DeviceExists(int serialNumber)
        {
            return _context.Device.Any(e => e.SerialNumber == serialNumber);
        }

        // DELETE: api/Device/{serialNumber}
        /// <summary>
        /// Elimina un dispositivo específico por su número de serie.
        /// </summary>
        /// <param name="serialNumber">Número de serie del dispositivo a eliminar</param>
        /// <returns>Estado de la operación</returns>
        [HttpDelete("{serialNumber}")]
        public async Task<IActionResult> DeleteDevice(int serialNumber)
        {
            var device = await _context.Device.FindAsync(serialNumber);
            if (device == null)
            {
                return NotFound("El dispositivo no existe.");
            }

            _context.Device.Remove(device);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}