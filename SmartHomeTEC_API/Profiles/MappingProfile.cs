using AutoMapper;
using SmartHomeTEC_API.DTOs;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Individual Mappings
            CreateMap<DeviceType, DeviceTypeDTO>().ReverseMap();
            CreateMap<Distributor, DistributorDTO>().ReverseMap();
            CreateMap<Client, ClientDTO>().ReverseMap();
            CreateMap<Client, ClientAuthDTO>().ReverseMap();
            CreateMap<Admin, AdminAuthDTO>().ReverseMap();
            CreateMap<Bill, BillDTO>().ReverseMap();
            CreateMap<DeliveryAddress, DeliveryAddressDTO>().ReverseMap();
            CreateMap<AssignedDevice, AssignedDeviceDTO>().ReverseMap();
            CreateMap<UsageLog, UsageLogDTO>().ReverseMap();
            CreateMap<Chamber, ChamberDTO>().ReverseMap();
            CreateMap<ChamberAssociation, ChamberAssociationDTO>().ReverseMap();

            // Device Mappings
            CreateMap<Device, DeviceDTO>()
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => Enum.Parse<DeviceState>(src.State)));
            
            // DeviceDetailDTO Mappings
            CreateMap<Device, DeviceDetailDTO>()
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State.ToString()))
                .ForMember(dest => dest.DeviceType, opt => opt.MapFrom(src => src.DeviceType))
                .ForMember(dest => dest.Distributor, opt => opt.MapFrom(src => src.Distributor));

            CreateMap<DeviceDetailDTO, Device>()
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => Enum.Parse<DeviceState>(src.State)))
                .ForMember(dest => dest.DeviceType, opt => opt.Ignore()) // Evita sobreescribir la navegación
                .ForMember(dest => dest.Distributor, opt => opt.Ignore()); // Evita sobreescribir la navegación
            
            // Mapeo para OrderDTO y Order
            CreateMap<Order, OrderDTO>()
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State.ToString()))
                .ReverseMap()
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => Enum.Parse<OrderState>(src.State)))
                .ForMember(dest => dest.Device, opt => opt.Ignore())
                .ForMember(dest => dest.DeviceType, opt => opt.Ignore())
                .ForMember(dest => dest.Bill, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore());

            // Mapeo para CreateOrderDTO a Order
            CreateMap<CreateOrderDTO, Order>()
                .ForMember(dest => dest.State, opt => opt.MapFrom(src => Enum.Parse<OrderState>(src.State)))
                .ForMember(dest => dest.OrderID, opt => opt.Ignore())
                .ForMember(dest => dest.OrderClientNum, opt => opt.Ignore())
                .ForMember(dest => dest.Brand, opt => opt.Ignore())
                .ForMember(dest => dest.TotalPrice, opt => opt.Ignore())
                .ForMember(dest => dest.Device, opt => opt.Ignore())
                .ForMember(dest => dest.DeviceType, opt => opt.Ignore())
                .ForMember(dest => dest.Bill, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore());

            // Mapeo para CreateBillDTO a Bill
            CreateMap<CreateBillDTO, Bill>()
                .ForMember(dest => dest.BillNum, opt => opt.Ignore())
                .ForMember(dest => dest.Price, opt => opt.Ignore())
                .ForMember(dest => dest.DeviceType, opt => opt.Ignore())
                .ForMember(dest => dest.Order, opt => opt.Ignore());
            
            // Mapeo para CertificateDTO y Certificate
            CreateMap<Certificate, CertificateDTO>().ReverseMap();

            // Mapeo para CreateCertificateDTO a Certificate
            CreateMap<CreateCertificateDTO, Certificate>()
                .ForMember(dest => dest.Brand, opt => opt.Ignore()) // Se asigna en el controlador
                .ForMember(dest => dest.ClientFullName, opt => opt.Ignore()) // Se asigna en el controlador
                .ForMember(dest => dest.WarrantyEndDate, opt => opt.Ignore()) // Se calcula en el controlador
                .ForMember(dest => dest.Bill, opt => opt.Ignore()) // Relación manejada por EF
                .ForMember(dest => dest.Client, opt => opt.Ignore()) // Relación manejada por EF
                .ForMember(dest => dest.DeviceType, opt => opt.Ignore()) // Relación manejada por EF
                .ForMember(dest => dest.Device, opt => opt.Ignore()); // Relación manejada por EF
            
            // Mapeo para BillWithCertificateDTO
            CreateMap<Bill, BillWithCertificateDTO>()
                .ForMember(dest => dest.Bill, opt => opt.MapFrom(src => src))
                .ForMember(dest => dest.Certificate, opt => opt.MapFrom(src => src.Certificate));

            // DeliveryAddress Mappings
            CreateMap<CreateDeliveryAddressDTO, DeliveryAddress>()
                .ForMember(dest => dest.AddressID, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore());
            
            // AssignedDevice Mappings
            CreateMap<CreateAssignedDeviceDTO, AssignedDevice>()
                .ForMember(dest => dest.AssignedID, opt => opt.Ignore())
                .ForMember(dest => dest.Device, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore());

            CreateMap<UpdateAssignedDeviceDTO, AssignedDevice>()
                .ForMember(dest => dest.AssignedID, opt => opt.Ignore())
                .ForMember(dest => dest.SerialNumberDevice, opt => opt.Ignore())
                .ForMember(dest => dest.Device, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore());
            
            // UsageLog Mappings
            CreateMap<CreateUsageLogDTO, UsageLog>()
                .ForMember(dest => dest.LogID, opt => opt.Ignore())
                .ForMember(dest => dest.TotalHours, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore())
                .ForMember(dest => dest.AssignedDevice, opt => opt.Ignore());

            CreateMap<UpdateUsageLogDTO, UsageLog>()
                .ForMember(dest => dest.LogID, opt => opt.Ignore())
                .ForMember(dest => dest.StartDate, opt => opt.Ignore())
                .ForMember(dest => dest.StartTime, opt => opt.Ignore())
                .ForMember(dest => dest.TotalHours, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore())
                .ForMember(dest => dest.AssignedDevice, opt => opt.Ignore());
            
            // Chamber Mappings
            CreateMap<CreateChamberDTO, Chamber>()
                .ForMember(dest => dest.ChamberID, opt => opt.Ignore())
                .ForMember(dest => dest.Client, opt => opt.Ignore());
            
            // ChamberAssociation Mappings
            CreateMap<CreateChamberAssociationDTO, ChamberAssociation>()
                .ForMember(dest => dest.AssociationID, opt => opt.Ignore())
                .ForMember(dest => dest.WarrantyEndDate, opt => opt.Ignore())
                .ForMember(dest => dest.Chamber, opt => opt.Ignore())
                .ForMember(dest => dest.AssignedDevice, opt => opt.Ignore());

            CreateMap<UpdateChamberAssociationDTO, ChamberAssociation>()
                .ForMember(dest => dest.AssociationID, opt => opt.Ignore())
                .ForMember(dest => dest.Chamber, opt => opt.Ignore())
                .ForMember(dest => dest.AssignedDevice, opt => opt.Ignore());
        }
    }
}