using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.Models
{
    public class Admin
    {
        [Key]
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }
    }
}