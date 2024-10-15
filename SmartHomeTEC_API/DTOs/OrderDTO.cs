using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class OrderDTO
    {
        public required int OrderID { get; set; }

        [Required]
        public required string State { get; set; } // Representado como cadena (Ordered/Paid/Received)

        [Required]
        public required string OrderTime { get; set; }

        [Required]
        public required string OrderDate { get; set; }

        public int? OrderClientNum { get; set; }

        public string? Brand { get; set; }

        [Required]
        public required string SerialNumberDevice { get; set; }

        [Required]
        public required string DeviceTypeName { get; set; }

        public decimal? TotalPrice { get; set; }

        [Required]
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}