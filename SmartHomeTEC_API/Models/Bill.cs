using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Bill")]
    public class Bill
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] // Generado por la base de datos
        public int BillNum { get; set; }

        [Required]
        public required string BillDate { get; set; }

        [Required]
        public required string BillTime { get; set; }

        public decimal Price { get; set; } // Copiado de Order.TotalPrice

        [Required]
        [ForeignKey("DeviceType")]
        public required string DeviceTypeName { get; set; }

        [Required]
        [ForeignKey("Order")]
        public required int OrderID { get; set; }

        // Propiedades de Navegación
        [JsonIgnore]
        public required DeviceType DeviceType { get; set; }

        [JsonIgnore]
        public required Order Order { get; set; }

        [JsonIgnore]
        public Certificate? Certificate { get; set; }
    }
}
