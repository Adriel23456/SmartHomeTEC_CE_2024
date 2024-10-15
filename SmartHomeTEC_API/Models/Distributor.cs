using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Distributor")]
    public class Distributor
    {
        [Key]
        [Required]
        public required string LegalNum { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Region { get; set; }

        [Required]
        public required string Continent { get; set; }

        [Required]
        public required string Country { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public ICollection<Device> Devices { get; set; } = new List<Device>();
    }
}