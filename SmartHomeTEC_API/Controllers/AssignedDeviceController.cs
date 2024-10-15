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
    public class AssignedDeviceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AssignedDeviceController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/AssignedDevice
        /// <summary>
        /// Obtiene todas las asignaciones de dispositivos.
        /// </summary>
        /// <returns>Lista de AssignedDeviceDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignedDeviceDTO>>> GetAssignedDevices()
        {
            var assignedDevices = await _context.AssignedDevice
                .AsNoTracking()
                .ToListAsync();
            return Ok(_mapper.Map<List<AssignedDeviceDTO>>(assignedDevices));
        }

        // GET: api/AssignedDevice/{assignedID}
        /// <summary>
        /// Obtiene una asignación de dispositivo específica por su ID.
        /// </summary>
        /// <param name="assignedID">ID de la Asignación de Dispositivo</param>
        /// <returns>Objeto AssignedDeviceDTO</returns>
        [HttpGet("{assignedID}")]
        public async Task<ActionResult<AssignedDeviceDTO>> GetAssignedDevice(int assignedID)
        {
            var assignedDevice = await _context.AssignedDevice.FindAsync(assignedID);

            if (assignedDevice == null)
            {
                return NotFound("La asignación de dispositivo especificada no existe.");
            }

            return Ok(_mapper.Map<AssignedDeviceDTO>(assignedDevice));
        }

        // POST: api/AssignedDevice
        /// <summary>
        /// Crea una nueva asignación de dispositivo.
        /// </summary>
        /// <param name="createAssignedDeviceDTO">Objeto CreateAssignedDeviceDTO</param>
        /// <returns>Objeto AssignedDeviceDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<AssignedDeviceDTO>> PostAssignedDevice([FromBody] CreateAssignedDeviceDTO createAssignedDeviceDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el Device existe
            var device = await _context.Device.FindAsync(createAssignedDeviceDTO.SerialNumberDevice);
            if (device == null)
            {
                return BadRequest("El dispositivo especificado no existe.");
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(createAssignedDeviceDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Si el estado es Present, verificar que el dispositivo no tenga otra asignación Present
            if (createAssignedDeviceDTO.State == "Present")
            {
                var existingPresentAssignment = await _context.AssignedDevice
                    .FirstOrDefaultAsync(ad => ad.SerialNumberDevice == createAssignedDeviceDTO.SerialNumberDevice && ad.State == "Present");

                if (existingPresentAssignment != null)
                {
                    return Conflict("Este dispositivo ya está asignado a otro cliente en estado 'Present'.");
                }
            }

            // Crear el AssignedDevice
            var assignedDevice = _mapper.Map<AssignedDevice>(createAssignedDeviceDTO);

            _context.AssignedDevice.Add(assignedDevice);
            await _context.SaveChangesAsync();

            var assignedDeviceDTO = _mapper.Map<AssignedDeviceDTO>(assignedDevice);

            return CreatedAtAction(nameof(GetAssignedDevice), new { assignedID = assignedDevice.AssignedID }, assignedDeviceDTO);
        }

        // PUT: api/AssignedDevice/{assignedID}
        /// <summary>
        /// Actualiza una asignación de dispositivo existente.
        /// </summary>
        /// <param name="assignedID">ID de la Asignación de Dispositivo a actualizar</param>
        /// <param name="updateAssignedDeviceDTO">Objeto UpdateAssignedDeviceDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{assignedID}")]
        public async Task<IActionResult> PutAssignedDevice(int assignedID, [FromBody] UpdateAssignedDeviceDTO updateAssignedDeviceDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var assignedDevice = await _context.AssignedDevice.FindAsync(assignedID);
            if (assignedDevice == null)
            {
                return NotFound("La asignación de dispositivo especificada no existe.");
            }

            // Verificar si el nuevo Client existe
            var newClient = await _context.Client.FindAsync(updateAssignedDeviceDTO.ClientEmail);
            if (newClient == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Si el estado es Present, verificar que el dispositivo no tenga otra asignación Present
            if (updateAssignedDeviceDTO.State == "Present")
            {
                var existingPresentAssignment = await _context.AssignedDevice
                    .FirstOrDefaultAsync(ad => ad.SerialNumberDevice == assignedDevice.SerialNumberDevice && ad.State == "Present" && ad.AssignedID != assignedID);

                if (existingPresentAssignment != null)
                {
                    return Conflict("Este dispositivo ya está asignado a otro cliente en estado 'Present'.");
                }
            }

            // Actualizar los campos permitidos
            assignedDevice.ClientEmail = updateAssignedDeviceDTO.ClientEmail;
            assignedDevice.State = updateAssignedDeviceDTO.State;

            // Asignar la propiedad de navegación
            assignedDevice.Client = newClient;

            _context.Entry(assignedDevice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AssignedDeviceExists(assignedID))
                {
                    return NotFound("La asignación de dispositivo especificada no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si una Asignación de Dispositivo existe por su ID.
        /// </summary>
        /// <param name="assignedID">ID de la Asignación de Dispositivo</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool AssignedDeviceExists(int assignedID)
        {
            return _context.AssignedDevice.Any(e => e.AssignedID == assignedID);
        }
    }
}