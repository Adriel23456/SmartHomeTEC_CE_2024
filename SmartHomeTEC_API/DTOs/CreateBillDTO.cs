using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CreateBillDTO
    {
        public required string BillDate { get; set; }
        public required string BillTime { get; set; }
        public required string DeviceTypeName { get; set; }
        public required int OrderID { get; set; }
    }
}