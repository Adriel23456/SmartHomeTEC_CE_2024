using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class ClientDTO
    {
        [EmailAddress]
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Region { get; set; }
        public required string Continent { get; set; }
        public required string Country { get; set; }
        public required string FullName { get; set; }
        public required string FirstName { get; set; }
        public string? MiddleName { get; set; }
        public required string LastName { get; set; }
    }
}