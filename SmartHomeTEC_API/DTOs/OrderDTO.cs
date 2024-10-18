using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class OrderDTO
    {
        public required int OrderID { get; set; }
        public required string State { get; set; }
        public required string OrderTime { get; set; }
        public required string OrderDate { get; set; }
        public int? OrderClientNum { get; set; }
        public string? Brand { get; set; }
        public required int SerialNumberDevice { get; set; }
        public required string DeviceTypeName { get; set; }
        public decimal? TotalPrice { get; set; }
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}