using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class UpdateUsageLogDTO
    {
        [EmailAddress]
        [Required]
        public required string ClientEmail { get; set; }

        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "EndDate debe tener el formato 'YYYY-MM-DD'.")]
        public string? EndDate { get; set; }

        [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "EndTime debe tener el formato 'HH:mm'.")]
        public string? EndTime { get; set; }
    }
}