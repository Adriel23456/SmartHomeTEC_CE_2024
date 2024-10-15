using System.ComponentModel.DataAnnotations;

namespace SmartHomeTEC_API.DTOs
{
    public class DeliveryAddressDTO
    {
        public int? AddressID { get; set; }
        public required string Province { get; set; }
        public required string District { get; set; }
        public required string Canton { get; set; }
        public required string ApartmentOrHouse { get; set; }
        [EmailAddress]
        public required string ClientEmail { get; set; }
    }
}