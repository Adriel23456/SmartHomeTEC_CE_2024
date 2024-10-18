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
        public required int SerialNumberDevice { get; set; }

        public string? Brand { get; set; }

        [Required]
        [ForeignKey("DeviceType")]
        public required string DeviceTypeName { get; set; }

        public string? ClientFullName { get; set; }

        [Required]
        public required string WarrantyStartDate { get; set; }

        public string? WarrantyEndDate { get; set; }

        [Required]
        [ForeignKey("Bill")]
        public required int BillNum { get; set; }

        [Required]
        [ForeignKey("Client")]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public Bill? Bill { get; set; }

        [JsonIgnore]
        public Client? Client { get; set; }

        [JsonIgnore]
        public DeviceType? DeviceType { get; set; }

        [JsonIgnore]
        public Device? Device { get; set; }
    }
}