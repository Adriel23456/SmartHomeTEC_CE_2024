using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CreateCertificateDTO
    {
        public required int SerialNumberDevice { get; set; }
        public required string DeviceTypeName { get; set; }
        public required string WarrantyStartDate { get; set; }
        public required int BillNum { get; set; }
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}