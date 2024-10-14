using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DistributorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DistributorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Distributor
        /// <summary>
        /// Obtiene todos los distribuidores.
        /// </summary>
        /// <returns>Lista de Distributor</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Distributor>>> GetDistributors()
        {
            return await _context.Distributor.ToListAsync();
        }

        // GET: api/Distributor/{legalNum}
        /// <summary>
        /// Obtiene un distribuidor específico por su número legal.
        /// </summary>
        /// <param name="legalNum">Número legal del Distributor</param>
        /// <returns>Objeto Distributor</returns>
        [HttpGet("{legalNum}")]
        public async Task<ActionResult<Distributor>> GetDistributor(string legalNum)
        {
            var distributor = await _context.Distributor.FindAsync(legalNum);

            if (distributor == null)
            {
                return NotFound();
            }

            return distributor;
        }

        // POST: api/Distributor
        /// <summary>
        /// Crea un nuevo distribuidor.
        /// </summary>
        /// <param name="distributor">Objeto Distributor</param>
        /// <returns>Objeto Distributor creado</returns>
        [HttpPost]
        public async Task<ActionResult<Distributor>> PostDistributor(Distributor distributor)
        {
            // Verificar si el Distributor ya existe
            if (DistributorExists(distributor.LegalNum))
            {
                return Conflict("El distribuidor con este número legal ya existe.");
            }

            _context.Distributor.Add(distributor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDistributor), new { legalNum = distributor.LegalNum }, distributor);
        }

        // PUT: api/Distributor/{legalNum}
        /// <summary>
        /// Actualiza un distribuidor existente.
        /// </summary>
        /// <param name="legalNum">Número legal del Distributor a actualizar</param>
        /// <param name="distributor">Objeto Distributor con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{legalNum}")]
        public async Task<IActionResult> PutDistributor(string legalNum, Distributor distributor)
        {
            if (legalNum != distributor.LegalNum)
            {
                return BadRequest("El número legal del distribuidor no coincide.");
            }

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