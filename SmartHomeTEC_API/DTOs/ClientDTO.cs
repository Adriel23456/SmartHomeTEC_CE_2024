using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class ClientDTO
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public required string Region { get; set; }

        [Required]
        public required string Continent { get; set; }

        [Required]
        public required string Country { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        public required string FirstName { get; set; }

        public string? MiddleName { get; set; } // Campo opcional

        [Required]
        public required string LastName { get; set; }
    }
}