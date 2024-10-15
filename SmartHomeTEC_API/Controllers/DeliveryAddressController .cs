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
    public class DeliveryAddressController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DeliveryAddressController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/DeliveryAddress
        /// <summary>
        /// Obtiene todas las direcciones de entrega.
        /// </summary>
        /// <returns>Lista de DeliveryAddressDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DeliveryAddressDTO>>> GetDeliveryAddresses()
        {
            var deliveryAddresses = await _context.DeliveryAddress
                .AsNoTracking()
                .ToListAsync();
            return Ok(_mapper.Map<List<DeliveryAddressDTO>>(deliveryAddresses));
        }

        // GET: api/DeliveryAddress/{addressID}
        /// <summary>
        /// Obtiene una dirección de entrega específica por su ID.
        /// </summary>
        /// <param name="addressID">ID de la Dirección de Entrega</param>
        /// <returns>Objeto DeliveryAddressDTO</returns>
        [HttpGet("{addressID}")]
        public async Task<ActionResult<DeliveryAddressDTO>> GetDeliveryAddress(int addressID)
        {
            var deliveryAddress = await _context.DeliveryAddress.FindAsync(addressID);

            if (deliveryAddress == null)
            {
                return NotFound("La dirección de entrega especificada no existe.");
            }

            return Ok(_mapper.Map<DeliveryAddressDTO>(deliveryAddress));
        }

        // POST: api/DeliveryAddress
        /// <summary>
        /// Crea una nueva dirección de entrega.
        /// </summary>
        /// <param name="createDeliveryAddressDTO">Objeto CreateDeliveryAddressDTO</param>
        /// <returns>Objeto DeliveryAddressDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<DeliveryAddressDTO>> PostDeliveryAddress([FromBody] CreateDeliveryAddressDTO createDeliveryAddressDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(createDeliveryAddressDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Mapear DTO a Entidad
            var deliveryAddress = _mapper.Map<DeliveryAddress>(createDeliveryAddressDTO);

            // Asignar la propiedad de navegación
            deliveryAddress.Client = client;

            _context.DeliveryAddress.Add(deliveryAddress);
            await _context.SaveChangesAsync();

            var createdDeliveryAddressDTO = _mapper.Map<DeliveryAddressDTO>(deliveryAddress);

            return CreatedAtAction(nameof(GetDeliveryAddress), new { addressID = deliveryAddress.AddressID }, createdDeliveryAddressDTO);
        }

        // PUT: api/DeliveryAddress/{addressID}
        /// <summary>
        /// Actualiza una dirección de entrega existente.
        /// </summary>
        /// <param name="addressID">ID de la Dirección de Entrega a actualizar</param>
        /// <param name="deliveryAddressDTO">Objeto DeliveryAddressDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{addressID}")]
        public async Task<IActionResult> PutDeliveryAddress(int addressID, [FromBody] DeliveryAddressDTO deliveryAddressDTO)
        {
            if (addressID != deliveryAddressDTO.AddressID)
            {
                return BadRequest("El ID de la dirección de entrega no coincide con el ID de la URL.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingDeliveryAddress = await _context.DeliveryAddress.FindAsync(addressID);
            if (existingDeliveryAddress == null)
            {
                return NotFound("La dirección de entrega especificada no existe.");
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(deliveryAddressDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Actualizar los campos de la dirección de entrega
            existingDeliveryAddress.Province = deliveryAddressDTO.Province;
            existingDeliveryAddress.District = deliveryAddressDTO.District;
            existingDeliveryAddress.Canton = deliveryAddressDTO.Canton;
            existingDeliveryAddress.ApartmentOrHouse = deliveryAddressDTO.ApartmentOrHouse;
            existingDeliveryAddress.ClientEmail = deliveryAddressDTO.ClientEmail;

            // Actualizar la propiedad de navegación
            existingDeliveryAddress.Client = client;

            _context.Entry(existingDeliveryAddress).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DeliveryAddressExists(addressID))
                {
                    return NotFound("La dirección de entrega especificada no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si una Dirección de Entrega existe por su ID.
        /// </summary>
        /// <param name="addressID">ID de la Dirección de Entrega</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool DeliveryAddressExists(int addressID)
        {
            return _context.DeliveryAddress.Any(e => e.AddressID == addressID);
        }
    }
}