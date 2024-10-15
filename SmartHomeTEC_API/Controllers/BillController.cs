using System.Globalization;
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

        // POST: api/Bill/WithCertificate
        /// <summary>
        /// Crea una nueva factura y genera un certificado asociado.
        /// </summary>
        /// <param name="createBillDTO">Objeto CreateBillDTO con los datos de la factura.</param>
        /// <returns>Objeto BillWithCertificateDTO creado junto con el certificado asociado.</returns>
        [HttpPost("WithCertificate")]
        public async Task<ActionResult<BillWithCertificateDTO>> PostBillWithCertificate([FromBody] CreateBillDTO createBillDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si la Order existe
            var order = await _context.Order
                .Include(o => o.Bill)
                .Include(o => o.Device)
                .Include(o => o.Client)
                .FirstOrDefaultAsync(o => o.OrderID == createBillDTO.OrderID);

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
            decimal price = order.TotalPrice ?? 0m; // Asigna 0.0m si order.TotalPrice es null

            // Mapear DTO a Entidad Bill
            var bill = _mapper.Map<Bill>(createBillDTO);
            bill.Price = (decimal)price;

            // Asignar propiedades de navegación
            bill.DeviceType = deviceType;
            bill.Order = order;

            // Añadir y guardar la Bill
            _context.Bill.Add(bill);
            await _context.SaveChangesAsync();

            // Crear el certificado asociado

            // Obtener datos necesarios del Order
            string serialNumberDevice = order.SerialNumberDevice;
            string clientEmail = order.ClientEmail;

            // Verificar que el Device exista
            var device = await _context.Device.FindAsync(serialNumberDevice);
            if (device == null)
            {
                return BadRequest("El dispositivo asociado a la orden no existe.");
            }

            // Verificar que el Client exista
            var client = await _context.Client.FindAsync(clientEmail);
            if (client == null)
            {
                return BadRequest("El cliente asociado a la orden no existe.");
            }

            // Calcular WarrantyStartDate y WarrantyEndDate
            if (!DateTime.TryParseExact(order.OrderDate, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedOrderDate))
            {
                return BadRequest("El formato de OrderDate es inválido. Debe ser 'yyyy-MM-dd'.");
            }

            DateTime warrantyEndDate = parsedOrderDate.AddDays(deviceType.WarrantyDays);

            // Crear el certificado asociado
            var certificate = new Certificate
            {
                SerialNumberDevice = serialNumberDevice,
                DeviceTypeName = order.DeviceTypeName,
                WarrantyStartDate = parsedOrderDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture),
                BillNum = bill.BillNum,
                ClientEmail = clientEmail,
                Brand = device.Brand,
                ClientFullName = client.FullName,
                Bill = bill, // Asignar la propiedad de navegación
                Client = client, // Asignar la propiedad de navegación
                DeviceType = deviceType, // Asignar la propiedad de navegación
                Device = device // Asignar la propiedad de navegación
            };

            // Asignar WarrantyEndDate
            certificate.WarrantyEndDate = warrantyEndDate.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

            // Verificar si el Certificate ya existe para el Device
            var existingCertificateForDevice = await _context.Certificate
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.SerialNumberDevice == serialNumberDevice);

            if (existingCertificateForDevice != null)
            {
                return Conflict("Este dispositivo ya tiene un certificado asociado.");
            }

            // Verificar si el Bill ya tiene un Certificate
            var existingCertificateForBill = await _context.Certificate
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.BillNum == bill.BillNum);

            if (existingCertificateForBill != null)
            {
                return Conflict("Esta factura ya está asociada a otro certificado.");
            }

            // Añadir y guardar el Certificate
            _context.Certificate.Add(certificate);
            await _context.SaveChangesAsync();

            // Asignar el Certificate a la Bill
            bill.Certificate = certificate;
            _context.Bill.Update(bill);
            await _context.SaveChangesAsync();

            // Mapear a DTOs
            var billDTO = _mapper.Map<BillDTO>(bill);
            var certificateDTO = _mapper.Map<CertificateDTO>(certificate);

            var billWithCertificateDTO = new BillWithCertificateDTO
            {
                Bill = billDTO,
                Certificate = certificateDTO
            };

            return CreatedAtAction(nameof(GetBill), new { billNum = bill.BillNum }, billWithCertificateDTO);
        }
    }
}