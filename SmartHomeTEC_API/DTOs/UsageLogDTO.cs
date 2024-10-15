using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class UsageLogDTO
    {
        public int LogID { get; set; }

        [Required]
        public required string StartDate { get; set; }

        [Required]
        public required string StartTime { get; set; }

        public string? EndDate { get; set; }

        public string? EndTime { get; set; }

        public string? TotalHours { get; set; }

        [Required]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        [Required]
        public required int AssignedID { get; set; }
    }
}