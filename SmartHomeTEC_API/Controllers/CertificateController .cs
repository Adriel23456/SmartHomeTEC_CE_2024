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
    public class CertificateController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public CertificateController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Certificate
        /// <summary>
        /// Obtiene todos los certificados.
        /// </summary>
        /// <returns>Lista de CertificateDTO</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CertificateDTO>>> GetCertificates()
        {
            var certificates = await _context.Certificate
                .Include(c => c.Bill)
                .Include(c => c.Client)
                .Include(c => c.DeviceType)
                .Include(c => c.Device)
                .AsNoTracking()
                .ToListAsync();

            return Ok(_mapper.Map<List<CertificateDTO>>(certificates));
        }

        // GET: api/Certificate/{serialNumberDevice}
        /// <summary>
        /// Obtiene un certificado específico por su SerialNumberDevice.
        /// </summary>
        /// <param name="serialNumberDevice">Serial Number del Dispositivo</param>
        /// <returns>Objeto CertificateDTO</returns>
        [HttpGet("{serialNumberDevice}")]
        public async Task<ActionResult<CertificateDTO>> GetCertificate(int serialNumberDevice)
        {
            var certificate = await _context.Certificate
                .Include(c => c.Bill)
                .Include(c => c.Client)
                .Include(c => c.DeviceType)
                .Include(c => c.Device)
                .FirstOrDefaultAsync(c => c.SerialNumberDevice == serialNumberDevice);

            if (certificate == null)
            {
                return NotFound("El certificado especificado no existe.");
            }

            return Ok(_mapper.Map<CertificateDTO>(certificate));
        }

        // POST: api/Certificate
        /// <summary>
        /// Crea un nuevo certificado.
        /// </summary>
        /// <param name="createCertificateDTO">Objeto CreateCertificateDTO</param>
        /// <returns>Objeto CertificateDTO creado</returns>
        [HttpPost]
        public async Task<ActionResult<CertificateDTO>> PostCertificate([FromBody] CreateCertificateDTO createCertificateDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el Device existe
            var device = await _context.Device.FindAsync(createCertificateDTO.SerialNumberDevice);
            if (device == null)
            {
                return BadRequest("El dispositivo especificado no existe.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(createCertificateDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El tipo de dispositivo especificado no existe.");
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(createCertificateDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Verificar si el Bill existe
            var bill = await _context.Bill.FindAsync(createCertificateDTO.BillNum);
            if (bill == null)
            {
                return BadRequest("La factura especificada no existe.");
            }

            // Verificar si el Bill ya está asociado a otro Certificate
            var existingCertificateForBill = await _context.Certificate
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.BillNum == createCertificateDTO.BillNum);
            if (existingCertificateForBill != null)
            {
                return Conflict("Esta factura ya está asociada a otro certificado.");
            }

            // Verificar si el Device ya tiene un Certificate
            var existingCertificateForDevice = await _context.Certificate
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.SerialNumberDevice == createCertificateDTO.SerialNumberDevice);
            if (existingCertificateForDevice != null)
            {
                return Conflict("Este dispositivo ya tiene un certificado asociado.");
            }

            // Calcular WarrantyEndDate
            if (!DateTime.TryParseExact(createCertificateDTO.WarrantyStartDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime warrantyStartDate))
            {
                return BadRequest("El formato de WarrantyStartDate es inválido. Debe ser 'yyyy-MM-dd'.");
            }

            DateTime warrantyEndDate = warrantyStartDate.AddDays(deviceType.WarrantyDays);

            // Mapear DTO a Entidad Certificate
            var certificate = _mapper.Map<Certificate>(createCertificateDTO);
            certificate.Brand = device.Brand;
            certificate.ClientFullName = client.FullName;
            certificate.WarrantyEndDate = warrantyEndDate.ToString("yyyy-MM-dd");

            _context.Certificate.Add(certificate);
            await _context.SaveChangesAsync();

            var createdCertificateDTO = _mapper.Map<CertificateDTO>(certificate);

            return CreatedAtAction(nameof(GetCertificate), new { serialNumberDevice = certificate.SerialNumberDevice }, createdCertificateDTO);
        }

        // PUT: api/Certificate/{serialNumberDevice}
        /// <summary>
        /// Actualiza un certificado existente.
        /// </summary>
        /// <param name="serialNumberDevice">Serial Number del Dispositivo</param>
        /// <param name="createCertificateDTO">Objeto CreateCertificateDTO con datos actualizados</param>
        /// <returns>Estado de la operación</returns>
        [HttpPut("{serialNumberDevice}")]
        public async Task<IActionResult> PutCertificate(int serialNumberDevice, [FromBody] CreateCertificateDTO createCertificateDTO)
        {
            if (serialNumberDevice != createCertificateDTO.SerialNumberDevice)
            {
                return BadRequest("El SerialNumberDevice no coincide con el certificado a actualizar.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el Certificate existe
            var certificate = await _context.Certificate.FindAsync(serialNumberDevice);
            if (certificate == null)
            {
                return NotFound("El certificado especificado no existe.");
            }

            // Verificar si el DeviceType existe
            var deviceType = await _context.DeviceType.FindAsync(createCertificateDTO.DeviceTypeName);
            if (deviceType == null)
            {
                return BadRequest("El tipo de dispositivo especificado no existe.");
            }

            // Verificar si el Client existe
            var client = await _context.Client.FindAsync(createCertificateDTO.ClientEmail);
            if (client == null)
            {
                return BadRequest("El cliente especificado no existe.");
            }

            // Verificar si el Bill existe
            var bill = await _context.Bill.FindAsync(createCertificateDTO.BillNum);
            if (bill == null)
            {
                return BadRequest("La factura especificada no existe.");
            }

            // Verificar si el Bill ya está asociado a otro Certificate
            var existingCertificateForBill = await _context.Certificate
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.BillNum == createCertificateDTO.BillNum && c.SerialNumberDevice != serialNumberDevice);
            if (existingCertificateForBill != null)
            {
                return Conflict("Esta factura ya está asociada a otro certificado.");
            }

            // Calcular WarrantyEndDate
            if (!DateTime.TryParseExact(createCertificateDTO.WarrantyStartDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime warrantyStartDate))
            {
                return BadRequest("El formato de WarrantyStartDate es inválido. Debe ser 'yyyy-MM-dd'.");
            }

            DateTime warrantyEndDate = warrantyStartDate.AddDays(deviceType.WarrantyDays);

            // Actualizar los campos del certificado
            certificate.DeviceTypeName = createCertificateDTO.DeviceTypeName;
            certificate.WarrantyStartDate = createCertificateDTO.WarrantyStartDate;
            certificate.WarrantyEndDate = warrantyEndDate.ToString("yyyy-MM-dd");
            certificate.BillNum = createCertificateDTO.BillNum;
            certificate.ClientEmail = createCertificateDTO.ClientEmail;
            certificate.Brand = _context.Device.Find(serialNumberDevice)?.Brand ?? certificate.Brand;
            certificate.ClientFullName = client.FullName;

            // Validar que DeviceTypeName de la Certificate coincida con el de la Order asociada a la Bill
            var order = await _context.Bill
                .Include(b => b.Order)
                .FirstOrDefaultAsync(b => b.BillNum == certificate.BillNum);

            if (order == null)
            {
                return BadRequest("La orden asociada a la factura no existe.");
            }

            if (!string.Equals(certificate.DeviceTypeName, order.DeviceTypeName, StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("El tipo de dispositivo del certificado debe coincidir con el tipo de dispositivo de la orden asociada a la factura.");
            }

            // Marcar la entidad como modificada
            _context.Entry(certificate).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CertificateExists(serialNumberDevice))
                {
                    return NotFound("El certificado especificado no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si un Certificado existe por su SerialNumberDevice.
        /// </summary>
        /// <param name="serialNumberDevice">Serial Number del Dispositivo</param>
        /// <returns>Booleano indicando si existe</returns>
        private bool CertificateExists(int serialNumberDevice)
        {
            return _context.Certificate.Any(e => e.SerialNumberDevice == serialNumberDevice);
        }
    }
}
