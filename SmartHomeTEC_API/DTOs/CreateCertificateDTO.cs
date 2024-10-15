using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CreateCertificateDTO
    {
        [Required]
        public required string SerialNumberDevice { get; set; }

        [Required]
        public required string DeviceTypeName { get; set; }

        [Required]
        public required string WarrantyStartDate { get; set; } // Formato: "yyyy-MM-dd"

        [Required]
        public required int BillNum { get; set; }

        [Required]
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}