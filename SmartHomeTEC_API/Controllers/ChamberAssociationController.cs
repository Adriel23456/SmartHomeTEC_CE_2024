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
    public class ChamberAssociationController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ChamberAssociationController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/ChamberAssociation
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChamberAssociationDTO>>> GetChamberAssociations()
        {
            var chamberAssociations = await _context.ChamberAssociation
                .AsNoTracking()
                .ToListAsync();
            return Ok(_mapper.Map<List<ChamberAssociationDTO>>(chamberAssociations));
        }

        // GET: api/ChamberAssociation/{associationID}
        [HttpGet("{associationID}")]
        public async Task<ActionResult<ChamberAssociationDTO>> GetChamberAssociation(int associationID)
        {
            var chamberAssociation = await _context.ChamberAssociation.FindAsync(associationID);

            if (chamberAssociation == null)
            {
                return NotFound("La asociación especificada no existe.");
            }

            return Ok(_mapper.Map<ChamberAssociationDTO>(chamberAssociation));
        }

        // POST: api/ChamberAssociation
        [HttpPost]
        public async Task<ActionResult<ChamberAssociationDTO>> PostChamberAssociation([FromBody] CreateChamberAssociationDTO createChamberAssociationDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Verificar si el Chamber existe
            var chamber = await _context.Chamber.FindAsync(createChamberAssociationDTO.ChamberID);
            if (chamber == null)
            {
                return BadRequest("La cámara especificada no existe.");
            }

            // Verificar si el AssignedDevice existe
            var assignedDevice = await _context.AssignedDevice
                .Include(ad => ad.Device)
                .FirstOrDefaultAsync(ad => ad.AssignedID == createChamberAssociationDTO.AssignedID);
            if (assignedDevice == null)
            {
                return BadRequest("El AssignedDevice especificado no existe.");
            }

            // Verificar si el AssignedDevice ya tiene una ChamberAssociation
            if (assignedDevice.ChamberAssociation != null)
            {
                return Conflict("Este AssignedDevice ya está asociado a una ChamberAssociation.");
            }

            // Calcular WarrantyEndDate
            string? warrantyEndDate = null;
            var deviceSerialNumber = assignedDevice.SerialNumberDevice;

            // Verificar si existe un Certificate para el Device
            var certificate = await _context.Certificate
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.SerialNumberDevice == deviceSerialNumber);

            if (certificate != null && DateTime.TryParseExact(certificate.WarrantyEndDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime certWarrantyEnd))
            {
                warrantyEndDate = certWarrantyEnd.ToString("yyyy-MM-dd");
            }
            else
            {
                // Calcular manualmente WarrantyEndDate basado en AssociationStartDate (ejemplo: 1 año después)
                if (DateTime.TryParseExact(createChamberAssociationDTO.AssociationStartDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime associationStartDate))
                {
                    var calculatedWarrantyEndDate = associationStartDate.AddYears(1);
                    warrantyEndDate = calculatedWarrantyEndDate.ToString("yyyy-MM-dd");
                }
                else
                {
                    return BadRequest("El formato de AssociationStartDate es inválido. Debe ser 'YYYY-MM-DD'.");
                }
            }

            // Crear la ChamberAssociation
            var chamberAssociation = _mapper.Map<ChamberAssociation>(createChamberAssociationDTO);
            chamberAssociation.WarrantyEndDate = warrantyEndDate;

            _context.ChamberAssociation.Add(chamberAssociation);

            // Asignar la ChamberAssociation al AssignedDevice
            assignedDevice.ChamberAssociation = chamberAssociation;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocurrió un error al crear la ChamberAssociation: {ex.Message}");
            }

            var chamberAssociationDTO = _mapper.Map<ChamberAssociationDTO>(chamberAssociation);

            return CreatedAtAction(nameof(GetChamberAssociation), new { associationID = chamberAssociation.AssociationID }, chamberAssociationDTO);
        }

        // PUT: api/ChamberAssociation/{associationID}
        [HttpPut("{associationID}")]
        public async Task<IActionResult> PutChamberAssociation(int associationID, [FromBody] UpdateChamberAssociationDTO updateChamberAssociationDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var chamberAssociation = await _context.ChamberAssociation
                .Include(ca => ca.AssignedDevice)
                    .ThenInclude(ad => ad!.Device)
                .FirstOrDefaultAsync(ca => ca.AssociationID == associationID);

            if (chamberAssociation == null)
            {
                return NotFound("La ChamberAssociation especificada no existe.");
            }

            // Verificar si el Chamber existe
            var chamber = await _context.Chamber.FindAsync(updateChamberAssociationDTO.ChamberID);
            if (chamber == null)
            {
                return BadRequest("La cámara especificada no existe.");
            }

            // Verificar si el AssignedDevice existe
            var assignedDevice = await _context.AssignedDevice
                .Include(ad => ad.Device)
                .FirstOrDefaultAsync(ad => ad.AssignedID == updateChamberAssociationDTO.AssignedID);
            if (assignedDevice == null)
            {
                return BadRequest("El AssignedDevice especificado no existe.");
            }

            // Verificar si el AssignedDevice ya tiene una ChamberAssociation diferente
            if (assignedDevice.ChamberAssociation != null && assignedDevice.ChamberAssociation.AssociationID != associationID)
            {
                return Conflict("Este AssignedDevice ya está asociado a otra ChamberAssociation.");
            }

            // Calcular WarrantyEndDate
            string? warrantyEndDate = null;
            var deviceSerialNumber = assignedDevice.SerialNumberDevice;

            // Verificar si existe un Certificate para el Device
            var certificate = await _context.Certificate
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.SerialNumberDevice == deviceSerialNumber);

            if (certificate != null && DateTime.TryParseExact(certificate.WarrantyEndDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime certWarrantyEnd))
            {
                warrantyEndDate = certWarrantyEnd.ToString("yyyy-MM-dd");
            }
            else
            {
                // Calcular manualmente WarrantyEndDate basado en AssociationStartDate (ejemplo: 1 año después)
                if (DateTime.TryParseExact(updateChamberAssociationDTO.AssociationStartDate, "yyyy-MM-dd", null, System.Globalization.DateTimeStyles.None, out DateTime associationStartDate))
                {
                    var calculatedWarrantyEndDate = associationStartDate.AddYears(1);
                    warrantyEndDate = calculatedWarrantyEndDate.ToString("yyyy-MM-dd");
                }
                else
                {
                    return BadRequest("El formato de AssociationStartDate es inválido. Debe ser 'YYYY-MM-DD'.");
                }
            }

            // Actualizar los campos
            chamberAssociation.AssociationStartDate = updateChamberAssociationDTO.AssociationStartDate;
            chamberAssociation.ChamberID = updateChamberAssociationDTO.ChamberID;
            chamberAssociation.AssignedID = updateChamberAssociationDTO.AssignedID;
            chamberAssociation.WarrantyEndDate = warrantyEndDate;

            // Asignar la ChamberAssociation al AssignedDevice
            assignedDevice.ChamberAssociation = chamberAssociation;

            _context.Entry(chamberAssociation).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ChamberAssociationExists(associationID))
                {
                    return NotFound("La ChamberAssociation especificada no existe.");
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Verifica si una ChamberAssociation existe por su ID.
        /// </summary>
        private bool ChamberAssociationExists(int associationID)
        {
            return _context.ChamberAssociation.Any(e => e.AssociationID == associationID);
        }
    }
}
