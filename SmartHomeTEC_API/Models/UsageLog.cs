using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("UsageLog")]
    public class UsageLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? LogID { get; set; }

        [Required]
        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "StartDate debe tener el formato 'YYYY-MM-DD'.")]
        public required string StartDate { get; set; } // Formato: YYYY-MM-DD

        [Required]
        [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "StartTime debe tener el formato 'HH:mm'.")]
        public required string StartTime { get; set; } // Formato: HH:mm

        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "EndDate debe tener el formato 'YYYY-MM-DD'.")]
        public string? EndDate { get; set; } // Formato: YYYY-MM-DD

        [RegularExpression(@"^\d{2}:\d{2}$", ErrorMessage = "EndTime debe tener el formato 'HH:mm'.")]
        public string? EndTime { get; set; } // Formato: HH:mm

        public string? TotalHours { get; set; } // Calculado en base a StartDate/StartTime y EndDate/EndTime

        [Required]
        [EmailAddress]
        [ForeignKey("Client")]
        public required string ClientEmail { get; set; }

        [Required]
        [ForeignKey("AssignedDevice")]
        public required int AssignedID { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public Client? Client { get; set; }

        [JsonIgnore]
        public AssignedDevice? AssignedDevice { get; set; }
    }
}