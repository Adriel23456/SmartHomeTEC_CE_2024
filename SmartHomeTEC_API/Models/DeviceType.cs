using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
    }
}