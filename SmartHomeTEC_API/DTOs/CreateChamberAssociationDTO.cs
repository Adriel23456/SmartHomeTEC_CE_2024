using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CreateChamberAssociationDTO
    {
        [Required]
        [RegularExpression(@"^\d{4}-\d{2}-\d{2}$", ErrorMessage = "AssociationStartDate debe tener el formato 'YYYY-MM-DD'.")]
        public required string AssociationStartDate { get; set; }

        [Required]
        public required int ChamberID { get; set; }

        [Required]
        public required int AssignedID { get; set; }
    }
}