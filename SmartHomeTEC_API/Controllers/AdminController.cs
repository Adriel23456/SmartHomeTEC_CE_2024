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
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public AdminController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // GET: api/Admin
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Admin>>> GetAdmins()
        {
            return await _context.Admin.ToListAsync();
        }

        // GET: api/Admin/{email}
        [HttpGet("{email}")]
        public async Task<ActionResult<Admin>> GetAdmin(string email)
        {
            var admin = await _context.Admin.FindAsync(email);

            if (admin == null)
            {
                return NotFound();
            }

            return admin;
        }

        // POST: api/Admin
        [HttpPost]
        public async Task<ActionResult<Admin>> PostAdmin(Admin admin)
        {
            _context.Admin.Add(admin);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (AdminExists(admin.Email))
                {
                    return Conflict("El email ya existe.");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction(nameof(GetAdmin), new { email = admin.Email }, admin);
        }

        // PUT: api/Admin/{email}
        [HttpPut("{email}")]
        public async Task<IActionResult> PutAdmin(string email, Admin admin)
        {
            if (email != admin.Email)
            {
                return BadRequest("El email no coincide.");
            }

            _context.Entry(admin).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AdminExists(email))
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

        private bool AdminExists(string email)
        {
            return _context.Admin.Any(e => e.Email == email);
        }

        // POST: api/Admin/Login
        [HttpPost("Login")]
        public async Task<ActionResult<Admin>> Login(AuthRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var admin = await _context.Admin
                .FirstOrDefaultAsync(a => a.Email == request.Email && a.Password == request.Password);

            if (admin == null)
            {
                return Unauthorized("Credenciales inválidas.");
            }

            var AdminAuthDTO = _mapper.Map<AdminAuthDTO>(admin);
            return Ok(admin);
        }
    }
}