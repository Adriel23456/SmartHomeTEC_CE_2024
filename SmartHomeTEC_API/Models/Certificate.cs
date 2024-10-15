using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Certificate")]
    public class Certificate
    {
        [Key]
        [ForeignKey("Device")]
        [Required]
        public required string SerialNumberDevice { get; set; }

        public string? Brand { get; set; }

        [Required]
        [ForeignKey("DeviceType")]
        public required string DeviceTypeName { get; set; }

        public string? ClientFullName { get; set; }

        [Required]
        public required string WarrantyStartDate { get; set; } // Formato: "yyyy-MM-dd"

        public string? WarrantyEndDate { get; set; } // Formato: "yyyy-MM-dd"

        [Required]
        [ForeignKey("Bill")]
        public required int BillNum { get; set; }

        [Required]
        [ForeignKey("Client")]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        // Propiedades de Navegación
        [JsonIgnore]
        [Required]
        public required Bill Bill { get; set; }

        [JsonIgnore]
        [Required]
        public required Client Client { get; set; }

        [JsonIgnore]
        [Required]
        public required DeviceType DeviceType { get; set; }

        [JsonIgnore]
        [Required]
        public required Device Device { get; set; }
    }
}