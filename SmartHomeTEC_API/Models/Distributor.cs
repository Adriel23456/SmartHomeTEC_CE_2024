using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartHomeTEC_API.Models
{
    [Table("Distributor")] // Especifica el nombre exacto de la tabla en la base de datos
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
    }
}