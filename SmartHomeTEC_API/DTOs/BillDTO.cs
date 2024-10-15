using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class BillDTO
    {
        public int? BillNum { get; set; }
        public required string BillDate { get; set; }
        public required string BillTime { get; set; }
        public decimal? Price { get; set; }
        public required string DeviceTypeName { get; set; }
        public required int OrderID { get; set; }
    }
}