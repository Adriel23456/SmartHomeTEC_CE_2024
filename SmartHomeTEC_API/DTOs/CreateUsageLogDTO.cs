using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CreateUsageLogDTO
    {
        [Required]
        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "StartDate debe tener el formato 'YYYY-MM-DD'.")]
        public required string StartDate { get; set; }

        [Required]
        [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "StartTime debe tener el formato 'HH:mm'.")]
        public required string StartTime { get; set; }

        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "EndDate debe tener el formato 'YYYY-MM-DD'.")]
        public string? EndDate { get; set; }

        [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "EndTime debe tener el formato 'HH:mm'.")]
        public string? EndTime { get; set; }

        [EmailAddress]
        [Required]
        public required string ClientEmail { get; set; }

        [Required]
        public required int AssignedID { get; set; }
    }
}