using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Order")] // Especifica el nombre exacto de la tabla en la base de datos
    public class Order
    {
        [Key]
        [Required]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public required int OrderID { get; set; }

        [Required]
        [EnumDataType(typeof(OrderState))]
        public required OrderState State { get; set; }

        [Required]
        public required string OrderTime { get; set; }

        [Required]
        public required string OrderDate { get; set; }

        public int? OrderClientNum { get; set; }

        public string? Brand { get; set; }

        [Required]
        [ForeignKey("Device")]
        public required string SerialNumberDevice { get; set; }

        [Required]
        [ForeignKey("DeviceType")]
        public required string DeviceTypeName { get; set; }

        public decimal? TotalPrice { get; set; }

        [Required]
        [ForeignKey("Client")]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        // Propiedades de Navegación
        [JsonIgnore]
        public Device? Device { get; set; }

        [JsonIgnore]
        public DeviceType? DeviceType { get; set; }

        [JsonIgnore]
        public Client? Client { get; set; }

        [JsonIgnore]
        public required Bill Bill { get; set; } // Ahora es no nullable
    }

    public enum OrderState
    {
        Ordered,
        Paid,
        Received
    }
}