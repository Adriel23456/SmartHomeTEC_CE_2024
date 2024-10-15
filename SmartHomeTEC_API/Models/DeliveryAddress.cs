using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("DeliveryAddress")]
    public class DeliveryAddress
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int? AddressID { get; set; }

        [Required]
        public required string Province { get; set; }

        [Required]
        public required string District { get; set; }

        [Required]
        public required string Canton { get; set; }

        [Required]
        public required string ApartmentOrHouse { get; set; }

        [Required]
        [ForeignKey("Client")]
        [EmailAddress]
        public required string ClientEmail { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public Client? Client { get; set; }
    }
}