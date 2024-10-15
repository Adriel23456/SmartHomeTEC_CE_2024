using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Device")] // Especifica el nombre exacto de la tabla en la base de datos
    public class Device
    {
        [Key]
        [Required]
        public required string SerialNumber { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "El precio debe ser un número no negativo.")]
        public required decimal Price { get; set; }

        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public required DeviceState State { get; set; }

        [Required]
        public required string Brand { get; set; }

        public int? AmountAvailable { get; set; } // Campo opcional

        [Range(0, double.MaxValue, ErrorMessage = "El consumo eléctrico debe ser un valor positivo.")]
        public double? ElectricalConsumption { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        // Foreign Key a DeviceType
        [Required]
        [ForeignKey("DeviceType")]
        public required string DeviceTypeName { get; set; }

        [JsonIgnore]
        public DeviceType? DeviceType { get; set; } // Navegación

        // Foreign Key a Distributor
        [ForeignKey("Distributor")]
        public string? LegalNum { get; set; }

        [JsonIgnore]
        public Distributor? Distributor { get; set; } // Navegación

        // Propiedad de Navegación hacia Order
        [JsonIgnore]
        public Order? Order { get; set; }

    }

    public enum DeviceState
    {
        AdminRegistered,
        StoreAvailable,
        Local
    }
}