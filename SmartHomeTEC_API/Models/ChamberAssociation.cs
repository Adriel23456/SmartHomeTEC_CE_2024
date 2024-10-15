using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("ChamberAssociation")]
    public class ChamberAssociation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AssociationID { get; set; }

        [Required]
        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "AssociationStartDate debe tener el formato 'YYYY-MM-DD'.")]
        public required string AssociationStartDate { get; set; } // Formato: YYYY-MM-DD

        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "WarrantyEndDate debe tener el formato 'YYYY-MM-DD'.")]
        public string? WarrantyEndDate { get; set; } // Formato: YYYY-MM-DD

        [Required]
        [ForeignKey("Chamber")]
        public required int ChamberID { get; set; }

        [Required]
        [ForeignKey("AssignedDevice")]
        public required int AssignedID { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public Chamber? Chamber { get; set; }

        [JsonIgnore]
        public AssignedDevice? AssignedDevice { get; set; }
    }
}