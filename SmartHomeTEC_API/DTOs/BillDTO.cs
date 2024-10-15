using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class BillDTO
    {
        public int BillNum { get; set; }

        [Required]
        public required string BillDate { get; set; }

        [Required]
        public required string BillTime { get; set; }

        public decimal Price { get; set; }

        [Required]
        public required string DeviceTypeName { get; set; }

        [Required]
        public required int OrderID { get; set; }
    }
}