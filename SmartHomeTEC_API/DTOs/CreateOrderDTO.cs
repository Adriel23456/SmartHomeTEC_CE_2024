// ----------------------------DTOs/CreateOrderDTO.cs---------------------------------
using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class CreateOrderDTO
    {
        public required string State { get; set; }
        public required string OrderTime { get; set; }
        public required string OrderDate { get; set; }
        public required string SerialNumberDevice { get; set; }
        public required string DeviceTypeName { get; set; }
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}
// ----------------------------DTOs/CreateOrderDTO.cs---------------------------------
