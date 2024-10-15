using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartHomeTEC_API.Data;
using SmartHomeTEC_API.DTOs;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BillController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public BillController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Bill
        /// <summary>
        /// Obtiene todas las facturas.
        /// </summary>
        /// <returns>Lista de BillDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BillDTO>>> GetBills()
        {
            var bills = await _context.Bill
                .AsNoTracking()
                .ToListAsync();
            return _mapper.Map<List<BillDTO>>(bills);
        }

        // GET: api/Bill/{billNum}
        /// <summary>
        /// Obtiene una factura específica por su número.
        /// </summary>
        /// <param name="billNum">Número de la Factura</param>
        /// <returns>Objeto BillDTO</returns>
        [HttpGet("{billNum}")]
        public async Task<ActionResult<BillDTO>> GetBill(int billNum)
        {
            var bill = await _context.Bill.FindAsync(billNum);

            if (bill == null)
            {
                return NotFound();
            }

            return _mapper.Map<BillDTO>(bill);
        }

        // POST: api/Bill
        /// <summary>
        /// Crea una nueva factura.
        /// </summary>
        /// <param name="createBillDTO">Objeto CreateBillDTO</param>
        /// <returns>Objeto BillDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<BillDTO>> PostBill([FromBody] CreateBillDTO createBillDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si la Order existe
            var order = await _context.Order.Include(o => o.Bill).FirstOrDefaultAsync(o => o.OrderID == createBillDTO.OrderID);
            if (order == null)
            {
                return BadRequest("La orden especificada no existe.");
            }

            // Verificar si la Order ya tiene una Bill
            if (order.Bill != null)
            {
                return Conflict("Esta orden ya está asociada a una factura.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(createBillDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El tipo de dispositivo especificado no existe.");
            }

            // Verificar que DeviceTypeName de la Bill coincida con el de la Order
            if (!string.Equals(createBillDTO.DeviceTypeName, order.DeviceTypeName, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("El tipo de dispositivo de la factura debe coincidir con el tipo de dispositivo de la orden.");
            }

            // Calcular Price copiando de Order.TotalPrice
            decimal price = order.TotalPrice ?? 0;

            // Mapear DTO a Entidad
            var bill = _mapper.Map<Bill>(createBillDTO);
            bill.Price = price;

            _context.Bill.Add(bill);
            await _context.SaveChangesAsync();

            var createdBillDTO = _mapper.Map<BillDTO>(bill);

            return CreatedAtAction(nameof(GetBill), new { billNum = bill.BillNum }, createdBillDTO);
        }

        // PUT: api/Bill/{billNum}
        /// <summary>
        /// Actualiza una factura existente.
        /// </summary>
        /// <param name="billNum">Número de la Factura a actualizar</param>
        /// <param name="billDTO">Objeto BillDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{billNum}")]
        public async Task<IActionResult> PutBill(int billNum, BillDTO billDTO)
        {
            if (billNum != billDTO.BillNum)
            {
                return BadRequest("El número de la factura no coincide.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingBill = await _context.Bill.FindAsync(billNum);
            if (existingBill == null)
            {
                return NotFound("La factura especificada no existe.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(billDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El tipo de dispositivo especificado no existe.");
            }

            // Verificar si la Order existe
            var order = await _context.Order.Include(o => o.Bill).FirstOrDefaultAsync(o => o.OrderID == billDTO.OrderID);
            if (order == null)
            {
                return BadRequest("La orden especificada no existe.");
            }

            // Verificar si la Order ya tiene otra Bill
            if (order.Bill != null && order.Bill.BillNum != billNum)
            {
                return Conflict("Esta orden ya está asociada a otra factura.");
            }

            // Verificar que DeviceTypeName de la Bill coincida con el de la Order
            if (!string.Equals(billDTO.DeviceTypeName, order.DeviceTypeName, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("El tipo de dispositivo de la factura debe coincidir con el tipo de dispositivo de la orden.");
            }

            // Calcular Price copiando de Order.TotalPrice
            decimal price = order.TotalPrice ?? 0;

            // Actualizar los campos de la factura existente
            existingBill.BillDate = billDTO.BillDate;
            existingBill.BillTime = billDTO.BillTime;
            existingBill.DeviceTypeName = billDTO.DeviceTypeName;
            existingBill.OrderID = billDTO.OrderID;
            existingBill.Price = price;

            _context.Entry(existingBill).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BillExists(billNum))
                {
                    return NotFound("La factura especificada no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si una Factura existe por su número.
        /// </summary>
        /// <param name="billNum">Número de la Factura</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool BillExists(int billNum)
        {
            return _context.Bill.Any(e => e.BillNum == billNum);
        }
    }
}