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
    public class ClientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ClientController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Client
        /// <summary>
        /// Obtiene todos los clientes.
        /// </summary>
        /// <returns>Lista de ClientDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClientDTO>>> GetClients()
        {
            var clients = await _context.Client.ToListAsync();
            return _mapper.Map<List<ClientDTO>>(clients);
        }

        // GET: api/Client/{email}
        /// <summary>
        /// Obtiene un cliente específico por su correo electrónico.
        /// </summary>
        /// <param name="email">Correo electrónico del Cliente</param>
        /// <returns>Objeto ClientDTO</returns>
        [HttpGet("{email}")]
        public async Task<ActionResult<ClientDTO>> GetClient(string email)
        {
            var client = await _context.Client.FindAsync(email);

            if (client == null)
            {
                return NotFound();
            }

            return _mapper.Map<ClientDTO>(client);
        }

        // POST: api/Client
        /// <summary>
        /// Crea un nuevo cliente.
        /// </summary>
        /// <param name="clientDTO">Objeto ClientDTO</param>
        /// <returns>Objeto ClientDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<ClientDTO>> PostClient(ClientDTO clientDTO)
        {
            // Verificar si el Cliente ya existe
            if (ClientExists(clientDTO.Email))
            {
                return Conflict("El cliente con este correo electrónico ya existe.");
            }

            // Mapear DTO a Entidad
            var client = _mapper.Map<Client>(clientDTO);

            // Iniciar una transacción para asegurar que el cliente y las cámaras se creen juntos
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _context.Client.Add(client);
                await _context.SaveChangesAsync();

                // Nombres predefinidos para las cámaras
                var chamberNames = new List<string> { "dormitorio", "cocina", "sala", "comedor" };

                // Crear y añadir las cámaras
                foreach (var name in chamberNames)
                {
                    var chamber = new Chamber
                    {
                        Name = name,
                        ClientEmail = client.Email
                    };
                    _context.Chamber.Add(chamber);
                }

                await _context.SaveChangesAsync();

                // Confirmar la transacción
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                // En caso de error, revertir la transacción
                await transaction.RollbackAsync();
                return StatusCode(500, $"Ocurrió un error al crear el cliente: {ex.Message}");
            }

            var createdClientDTO = _mapper.Map<ClientDTO>(client);
            return CreatedAtAction(nameof(GetClient), new { email = client.Email }, createdClientDTO);
        }

        // PUT: api/Client/{email}
        /// <summary>
        /// Actualiza un cliente existente.
        /// </summary>
        /// <param name="email">Correo electrónico del Cliente a actualizar</param>
        /// <param name="clientDTO">Objeto ClientDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{email}")]
        public async Task<IActionResult> PutClient(string email, ClientDTO clientDTO)
        {
            if (email != clientDTO.Email)
            {
                return BadRequest("El correo electrónico del cliente no coincide.");
            }

            // Verificar si el Cliente existe
            if (!ClientExists(email))
            {
                return NotFound("El cliente especificado no existe.");
            }

            // Mapear DTO a Entidad
            var client = _mapper.Map<Client>(clientDTO);

            _context.Entry(client).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(email))
                {
                    return NotFound("El cliente especificado no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si un Cliente existe por su correo electrónico.
        /// </summary>
        /// <param name="email">Correo electrónico del Cliente</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool ClientExists(string email)
        {
            return _context.Client.Any(e => e.Email == email);
        }

        // POST: api/Client/Login
        /// <summary>
        /// Autentica a un cliente utilizando su correo electrónico y contraseña.
        /// </summary>
        /// <param name="authRequest">Objeto AuthRequest con correo electrónico y contraseña</param>
        /// <returns>Objeto ClientAuthDTO si las credenciales son válidas</returns>
        [HttpPost("Login")]
        public async Task<ActionResult<ClientAuthDTO>> Login([FromBody] AuthRequest authRequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var client = await _context.Client
                .FirstOrDefaultAsync(c => c.Email == authRequest.Email && c.Password == authRequest.Password);

            if (client == null)
            {
                return Unauthorized("Credenciales inválidas.");
            }

            var clientAuthDTO = _mapper.Map<ClientAuthDTO>(client);
            return Ok(clientAuthDTO);
        }
    }
}