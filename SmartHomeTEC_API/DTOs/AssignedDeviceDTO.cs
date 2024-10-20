using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class AssignedDeviceDTO
    {
        public int AssignedID { get; set; }

        [Required]
        public required int SerialNumberDevice { get; set; }

        [Required]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        [Required]
        [RegularExpression("Present|Past", ErrorMessage = "State debe ser 'Present' o 'Past'.")]
        public required string State { get; set; }
    }
}