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
    public class ChamberController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ChamberController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Chamber
        /// <summary>
        /// Obtiene todas las cámaras.
        /// </summary>
        /// <returns>Lista de ChamberDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChamberDTO>>> GetChambers()
        {
            var chambers = await _context.Chamber
                .AsNoTracking()
                .ToListAsync();
            return Ok(_mapper.Map<List<ChamberDTO>>(chambers));
        }

        // GET: api/Chamber/{chamberID}
        /// <summary>
        /// Obtiene una cámara específica por su ID.
        /// </summary>
        /// <param name="chamberID">ID de la Cámara</param>
        /// <returns>Objeto ChamberDTO</returns>
        [HttpGet("{chamberID}")]
        public async Task<ActionResult<ChamberDTO>> GetChamber(int chamberID)
        {
            var chamber = await _context.Chamber.FindAsync(chamberID);

            if (chamber == null)
            {
                return NotFound("La cámara especificada no existe.");
            }

            return Ok(_mapper.Map<ChamberDTO>(chamber));
        }

        // POST: api/Chamber
        /// <summary>
        /// Crea una nueva cámara.
        /// </summary>
        /// <param name="createChamberDTO">Objeto CreateChamberDTO</param>
        /// <returns>Objeto ChamberDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<ChamberDTO>> PostChamber([FromBody] CreateChamberDTO createChamberDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(createChamberDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Verificar si ya existe una Cámara con el mismo nombre para el mismo Cliente
            var existingChamber = await _context.Chamber
                .FirstOrDefaultAsync(c => c.ClientEmail == createChamberDTO.ClientEmail && c.Name == createChamberDTO.Name);
            
            if (existingChamber != null)
            {
                return BadRequest("Ya existe una cámara con este nombre para el cliente especificado.");
            }

            // Crear la Cámara
            var chamber = _mapper.Map<Chamber>(createChamberDTO);

            _context.Chamber.Add(chamber);
            await _context.SaveChangesAsync();

            var chamberDTO = _mapper.Map<ChamberDTO>(chamber);

            return CreatedAtAction(nameof(GetChamber), new { chamberID = chamber.ChamberID }, chamberDTO);
        }

        // PUT: api/Chamber/{chamberID}
        /// <summary>
        /// Actualiza una cámara existente.
        /// </summary>
        /// <param name="chamberID">ID de la Cámara a actualizar</param>
        /// <param name="updateChamberDTO">Objeto UpdateChamberDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{chamberID}")]
        public async Task<IActionResult> PutChamber(int chamberID, [FromBody] CreateChamberDTO updateChamberDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chamber = await _context.Chamber.FindAsync(chamberID);
            if (chamber == null)
            {
                return NotFound("La cámara especificada no existe.");
            }

            // Verificar si el nuevo Client existe
            var newClient = await _context.Client.FindAsync(updateChamberDTO.ClientEmail);
            if (newClient == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Actualizar los campos permitidos
            chamber.Name = updateChamberDTO.Name;
            chamber.ClientEmail = updateChamberDTO.ClientEmail;

            // Asignar la propiedad de navegación
            chamber.Client = newClient;

            _context.Entry(chamber).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChamberExists(chamberID))
                {
                    return NotFound("La cámara especificada no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si una Cámara existe por su ID.
        /// </summary>
        /// <param name="chamberID">ID de la Cámara</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool ChamberExists(int chamberID)
        {
            return _context.Chamber.Any(e => e.ChamberID == chamberID);
        }
    }
}