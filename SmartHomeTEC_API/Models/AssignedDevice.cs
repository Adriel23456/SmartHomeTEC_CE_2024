using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("AssignedDevice")]
    public class AssignedDevice
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AssignedID { get; set; }

        [Required]
        [ForeignKey("Device")]
        public required string SerialNumberDevice { get; set; }

        [Required]
        [ForeignKey("Client")]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        [Required]
        [RegularExpression("Present|Past", ErrorMessage = "State debe ser 'Present' o 'Past'.")]
        public required string State { get; set; } // "Present" o "Past"

        // Propiedades de Navegación:
        [JsonIgnore]
        public Device? Device { get; set; }

        [JsonIgnore]
        public Client? Client { get; set; }
        [JsonIgnore]
        public ICollection<UsageLog> UsageLogs { get; set; } = new List<UsageLog>();
        [JsonIgnore]
        public ChamberAssociation? ChamberAssociation { get; set; }
    }
}