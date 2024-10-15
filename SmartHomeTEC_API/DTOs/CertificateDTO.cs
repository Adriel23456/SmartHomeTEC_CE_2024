using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CertificateDTO
    {
        [Required]
        public required string SerialNumberDevice { get; set; }

        public string? Brand { get; set; }

        [Required]
        public required string DeviceTypeName { get; set; }

        public string? ClientFullName { get; set; }

        [Required]
        public required string WarrantyStartDate { get; set; } // Formato: "yyyy-MM-dd"

        public string? WarrantyEndDate { get; set; } // Formato: "yyyy-MM-dd"

        [Required]
        public required int BillNum { get; set; }

        [Required]
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}