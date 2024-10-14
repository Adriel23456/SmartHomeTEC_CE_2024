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
        }
    }
}