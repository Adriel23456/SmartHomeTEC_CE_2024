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
    public class DistributorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DistributorController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Distributor
        /// <summary>
        /// Obtiene todos los distribuidores.
        /// </summary>
        /// <returns>Lista de DistributorDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DistributorDTO>>> GetDistributors()
        {
            var distributors = await _context.Distributor.ToListAsync();
            return _mapper.Map<List<DistributorDTO>>(distributors);
        }

        // GET: api/Distributor/{legalNum}
        /// <summary>
        /// Obtiene un distribuidor específico por su número legal.
        /// </summary>
        /// <param name="legalNum">Número legal del Distributor</param>
        /// <returns>Objeto DistributorDTO</returns>
        [HttpGet("{legalNum}")]
        public async Task<ActionResult<DistributorDTO>> GetDistributor(string legalNum)
        {
            var distributor = await _context.Distributor.FindAsync(legalNum);

            if (distributor == null)
            {
                return NotFound();
            }

            return _mapper.Map<DistributorDTO>(distributor);
        }

        // POST: api/Distributor
        /// <summary>
        /// Crea un nuevo distribuidor.
        /// </summary>
        /// <param name="distributorDTO">Objeto DistributorDTO</param>
        /// <returns>Objeto DistributorDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<DistributorDTO>> PostDistributor(DistributorDTO distributorDTO)
        {
            // Verificar si el Distributor ya existe
            if (DistributorExists(distributorDTO.LegalNum))
            {
                return Conflict("El distribuidor con este número legal ya existe.");
            }

            // Mapear DTO a Entidad
            var distributor = _mapper.Map<Distributor>(distributorDTO);

            _context.Distributor.Add(distributor);
            await _context.SaveChangesAsync();

            var createdDistributorDTO = _mapper.Map<DistributorDTO>(distributor);

            return CreatedAtAction(nameof(GetDistributor), new { legalNum = distributor.LegalNum }, createdDistributorDTO);
        }

        // PUT: api/Distributor/{legalNum}
        /// <summary>
        /// Actualiza un distribuidor existente.
        /// </summary>
        /// <param name="legalNum">Número legal del Distributor a actualizar</param>
        /// <param name="distributorDTO">Objeto DistributorDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{legalNum}")]
        public async Task<IActionResult> PutDistributor(string legalNum, DistributorDTO distributorDTO)
        {
            if (legalNum != distributorDTO.LegalNum)
            {
                return BadRequest("El número legal del distribuidor no coincide.");
            }

            // Mapear DTO a Entidad
            var distributor = _mapper.Map<Distributor>(distributorDTO);

            _context.Entry(distributor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DistributorExists(legalNum))
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
        /// Verifica si un Distributor existe por su número legal.
        /// </summary>
        /// <param name="legalNum">Número legal del Distributor</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool DistributorExists(string legalNum)
        {
            return _context.Distributor.Any(e => e.LegalNum == legalNum);
        }
    }
}