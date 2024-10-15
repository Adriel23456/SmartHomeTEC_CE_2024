using AutoMapper;
using SmartHomeTEC_API.DTOs;
using SmartHomeTEC_API.Models;

namespace SmartHomeTEC_API.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // DeviceType Mappings
            CreateMap<DeviceType, DeviceTypeDTO>().ReverseMap();

            // Distributor Mappings
            CreateMap<Distributor, DistributorDTO>().ReverseMap();

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

            // Client Mappings
            CreateMap<Client, ClientDTO>().ReverseMap();

            // ClientAuthDTO Mappings
            CreateMap<Client, ClientAuthDTO>().ReverseMap();

            // AdminAuthDTO Mappings
            CreateMap<Admin, AdminAuthDTO>().ReverseMap();
            
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
            
            // Mapeo para BillDTO y Bill
            CreateMap<Bill, BillDTO>().ReverseMap();

            // Mapeo para CreateBillDTO a Bill
            CreateMap<CreateBillDTO, Bill>()
                .ForMember(dest => dest.BillNum, opt => opt.Ignore())
                .ForMember(dest => dest.Price, opt => opt.Ignore())
                .ForMember(dest => dest.DeviceType, opt => opt.Ignore())
                .ForMember(dest => dest.Order, opt => opt.Ignore());
        }
    }
}