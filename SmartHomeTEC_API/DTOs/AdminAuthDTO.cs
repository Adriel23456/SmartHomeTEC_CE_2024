using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartHomeTEC_API.DTOs
{
    public class AdminAuthDTO
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
