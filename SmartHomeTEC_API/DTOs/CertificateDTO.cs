using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CertificateDTO
    {
        public required string SerialNumberDevice { get; set; }
        public string? Brand { get; set; }
        public required string DeviceTypeName { get; set; }
        public string? ClientFullName { get; set; }
        public required string WarrantyStartDate { get; set; }
        public string? WarrantyEndDate { get; set; }
        public required int BillNum { get; set; }
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}