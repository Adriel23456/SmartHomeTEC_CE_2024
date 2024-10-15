using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Device")]
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

        public int? AmountAvailable { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "El consumo eléctrico debe ser un valor positivo.")]
        public double? ElectricalConsumption { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        [ForeignKey("DeviceType")]
        public required string DeviceTypeName { get; set; }

        // Foreign Key a Distributor
        [ForeignKey("Distributor")]
        public string? LegalNum { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public Order? Order { get; set; }

        [JsonIgnore]
        public DeviceType? DeviceType { get; set; }

        [JsonIgnore]
        public Distributor? Distributor { get; set; }

        [JsonIgnore]
        public Certificate? Certificate { get; set; }
    }

    public enum DeviceState
    {
        AdminRegistered,
        StoreAvailable,
        Local
    }
}