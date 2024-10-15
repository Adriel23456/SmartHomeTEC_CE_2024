using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;
using SmartHomeTEC_API.DTOs;
using SmartHomeTEC_API.Models;
using System.Globalization;

namespace SmartHomeTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsageLogController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public UsageLogController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/UsageLog
        /// <summary>
        /// Obtiene todos los registros de uso.
        /// </summary>
        /// <returns>Lista de UsageLogDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UsageLogDTO>>> GetUsageLogs()
        {
            var usageLogs = await _context.UsageLog
                .AsNoTracking()
                .ToListAsync();
            return Ok(_mapper.Map<List<UsageLogDTO>>(usageLogs));
        }

        // GET: api/UsageLog/{logID}
        /// <summary>
        /// Obtiene un registro de uso específico por su ID.
        /// </summary>
        /// <param name="logID">ID del Registro de Uso</param>
        /// <returns>Objeto UsageLogDTO</returns>
        [HttpGet("{logID}")]
        public async Task<ActionResult<UsageLogDTO>> GetUsageLog(int logID)
        {
            var usageLog = await _context.UsageLog.FindAsync(logID);

            if (usageLog == null)
            {
                return NotFound("El registro de uso especificado no existe.");
            }

            return Ok(_mapper.Map<UsageLogDTO>(usageLog));
        }

        // POST: api/UsageLog
        /// <summary>
        /// Crea un nuevo registro de uso.
        /// </summary>
        /// <param name="createUsageLogDTO">Objeto CreateUsageLogDTO</param>
        /// <returns>Objeto UsageLogDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<UsageLogDTO>> PostUsageLog([FromBody] CreateUsageLogDTO createUsageLogDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el AssignedDevice existe
            var assignedDevice = await _context.AssignedDevice
                .Include(ad => ad.Client)
                .FirstOrDefaultAsync(ad => ad.AssignedID == createUsageLogDTO.AssignedID && ad.State == "Present");
            if (assignedDevice == null)
            {
                return BadRequest("La asignación de dispositivo especificada no existe o no está en estado 'Present'.");
            }

            // Verificar si el ClientEmail corresponde al AssignedDevice
            if (assignedDevice.ClientEmail != createUsageLogDTO.ClientEmail)
            {
                return BadRequest("El ClientEmail proporcionado no coincide con el AssignedDevice.");
            }

            // Si endDate y endTime están proporcionados, calcular totalHours
            string? totalHours = null;
            if (!string.IsNullOrEmpty(createUsageLogDTO.EndDate) && !string.IsNullOrEmpty(createUsageLogDTO.EndTime))
            {
                if (!DateTime.TryParseExact($"{createUsageLogDTO.StartDate} {createUsageLogDTO.StartTime}", "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDateTime))
                {
                    return BadRequest("El formato de StartDate o StartTime es inválido.");
                }

                if (!DateTime.TryParseExact($"{createUsageLogDTO.EndDate} {createUsageLogDTO.EndTime}", "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDateTime))
                {
                    return BadRequest("El formato de EndDate o EndTime es inválido.");
                }

                if (endDateTime < startDateTime)
                {
                    return BadRequest("EndDate y EndTime no pueden ser anteriores a StartDate y StartTime.");
                }

                TimeSpan duration = endDateTime - startDateTime;
                totalHours = duration.TotalHours.ToString("F2"); // Formato con dos decimales
            }

            // Crear el UsageLog
            var usageLog = _mapper.Map<UsageLog>(createUsageLogDTO);
            usageLog.TotalHours = totalHours;

            _context.UsageLog.Add(usageLog);
            await _context.SaveChangesAsync();

            var usageLogDTO = _mapper.Map<UsageLogDTO>(usageLog);

            return CreatedAtAction(nameof(GetUsageLog), new { logID = usageLog.LogID }, usageLogDTO);
        }

        // PUT: api/UsageLog/{logID}
        /// <summary>
        /// Actualiza un registro de uso existente.
        /// </summary>
        /// <param name="logID">ID del Registro de Uso a actualizar</param>
        /// <param name="updateUsageLogDTO">Objeto UpdateUsageLogDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{logID}")]
        public async Task<IActionResult> PutUsageLog(int logID, [FromBody] UpdateUsageLogDTO updateUsageLogDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var usageLog = await _context.UsageLog
                .Include(ul => ul.Client)
                .Include(ul => ul.AssignedDevice)
                .FirstOrDefaultAsync(ul => ul.LogID == logID);
            if (usageLog == null)
            {
                return NotFound("El registro de uso especificado no existe.");
            }

            // Verificar si el nuevo ClientEmail existe
            var newClient = await _context.Client.FindAsync(updateUsageLogDTO.ClientEmail);
            if (newClient == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Verificar si el AssignedDevice corresponde al nuevo ClientEmail
            if (usageLog.AssignedDevice?.ClientEmail != updateUsageLogDTO.ClientEmail)
            {
                return BadRequest("El ClientEmail proporcionado no coincide con el AssignedDevice.");
            }

            // Si endDate y endTime están proporcionados, calcular totalHours
            string? totalHours = usageLog.TotalHours; // Mantener el valor actual si no se actualiza
            if (!string.IsNullOrEmpty(updateUsageLogDTO.EndDate) && !string.IsNullOrEmpty(updateUsageLogDTO.EndTime))
            {
                if (!DateTime.TryParseExact($"{usageLog.StartDate} {usageLog.StartTime}", "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime startDateTime))
                {
                    return BadRequest("El formato de StartDate o StartTime es inválido.");
                }

                if (!DateTime.TryParseExact($"{updateUsageLogDTO.EndDate} {updateUsageLogDTO.EndTime}", "yyyy-MM-dd HH:mm", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime endDateTime))
                {
                    return BadRequest("El formato de EndDate o EndTime es inválido.");
                }

                if (endDateTime < startDateTime)
                {
                    return BadRequest("EndDate y EndTime no pueden ser anteriores a StartDate y StartTime.");
                }

                TimeSpan duration = endDateTime - startDateTime;
                totalHours = duration.TotalHours.ToString("F2"); // Formato con dos decimales
            }

            // Actualizar los campos permitidos
            usageLog.ClientEmail = updateUsageLogDTO.ClientEmail;
            usageLog.EndDate = updateUsageLogDTO.EndDate;
            usageLog.EndTime = updateUsageLogDTO.EndTime;
            usageLog.TotalHours = totalHours;

            // Asignar la propiedad de navegación
            usageLog.Client = newClient;

            _context.Entry(usageLog).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsageLogExists(logID))
                {
                    return NotFound("El registro de uso especificado no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si un Registro de Uso existe por su ID.
        /// </summary>
        /// <param name="logID">ID del Registro de Uso</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool UsageLogExists(int logID)
        {
            return _context.UsageLog.Any(e => e.LogID == logID);
        }
    }
}