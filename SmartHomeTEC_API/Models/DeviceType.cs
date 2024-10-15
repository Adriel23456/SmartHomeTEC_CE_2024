using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("DeviceType")]
    public class DeviceType
    {
        [Key]
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [Required]
        [Range(0, int.MaxValue, ErrorMessage = "Los días de garantía deben ser un número no negativo.")]
        public required int WarrantyDays { get; set; }

        // Propiedad de Navegación hacia Device
        [JsonIgnore]
        public ICollection<Device> Devices { get; set; } = new List<Device>(); // Inicializada

        // Propiedad de Navegación hacia Order
        [JsonIgnore]
        public ICollection<Order> Orders { get; set; } = new List<Order>();

        // Propiedad de Navegación hacia Bill
        [JsonIgnore]
        public ICollection<Bill> Bills { get; set; } = new List<Bill>();

        // Propiedad de Navegación hacia Certificate
        [JsonIgnore]
        public ICollection<Certificate> Certificates { get; set; } = new List<Certificate>();
    }
}