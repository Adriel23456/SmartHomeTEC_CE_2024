using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CreateBillDTO
    {
        [Required]
        public required string BillDate { get; set; }

        [Required]
        public required string BillTime { get; set; }

        [Required]
        public required string DeviceTypeName { get; set; }

        [Required]
        public required int OrderID { get; set; }
    }
}