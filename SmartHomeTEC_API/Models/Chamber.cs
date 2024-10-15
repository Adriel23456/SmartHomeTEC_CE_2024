using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace SmartHomeTEC_API.Models
{
    [Table("Chamber")]
    public class Chamber
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ChamberID { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public required string Name { get; set; }

        [Required]
        [EmailAddress]
        [ForeignKey("Client")]
        public required string ClientEmail { get; set; }

        // Propiedades de Navegación:
        [JsonIgnore]
        public Client? Client { get; set; }
        [JsonIgnore]
        public ICollection<ChamberAssociation> ChamberAssociations { get; set; } = new List<ChamberAssociation>();
    }
}