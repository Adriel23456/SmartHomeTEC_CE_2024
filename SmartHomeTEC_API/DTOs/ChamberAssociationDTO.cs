using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class ChamberAssociationDTO
    {
        public int AssociationID { get; set; }

        [Required]
        public required string AssociationStartDate { get; set; }

        public string? WarrantyEndDate { get; set; }

        [Required]
        public required int ChamberID { get; set; }

        [Required]
        public required int AssignedID { get; set; }
    }
}