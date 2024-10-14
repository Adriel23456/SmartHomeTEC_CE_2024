namespace SmartHomeTEC_API.DTOs
{
    public class DeviceTypeDTO
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public required int WarrantyDays { get; set; }
    }
}