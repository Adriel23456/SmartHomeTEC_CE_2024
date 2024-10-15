using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class UpdateAssignedDeviceDTO
    {
        [Required]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        [Required]
        [RegularExpression("Present|Past", ErrorMessage = "State debe ser 'Present' o 'Past'.")]
        public required string State { get; set; }
    }
}