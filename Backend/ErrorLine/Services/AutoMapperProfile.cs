using AutoMapper;
using ErrorLine.Dtos;
using ErrorLine.Entities;
using System.Data;
using System.Net;

namespace ErrorLine.Services
{
    public class AutoMapperProfile:Profile
    {
        public AutoMapperProfile()
        {
            // User Mappings
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<StudentUserRegisterDto, User>();
            CreateMap<AdminUserRegisterDto, User>();
            CreateMap<MaintenanceStaffUserRegisterDto, User>();
            CreateMap<SystemAdminUserRegisterDto, User>();

            // Eqiupment Mappings
            CreateMap<Equipment, EquipmentDto>().ReverseMap();
            CreateMap<EquipmentCreateDto, Equipment>();
            CreateMap<EquipmentUpdateDto, Equipment>();


            //Issue Mappings
            CreateMap<IssueReport, IssueReportDto>();
            CreateMap<CreateIssueReportDto, IssueReport>();
            CreateMap<IssueUpdateDto, IssueReport>();
            CreateMap<IssueType, IssueTypeDto>();
            CreateMap<UpdateIssueTypeDto, IssueType>();

            // Order Mappings
            CreateMap<Order, OrderDto>().ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.OrderDate)); ;
            CreateMap<OrderCreateDto, Order>();
            CreateMap<OrderItem, OrderItemDto>();
               
            CreateMap<OrderItemCreateDto, OrderItem>();


            // Dormitary Mappings
            CreateMap<Dormitory, DormitoryDto>().ReverseMap();
            CreateMap<UpdateDormitoryDto, DormitoryDto>().ReverseMap();
            CreateMap<UpdateDormitoryDto, Dormitory>();



            //Location Mappings
            CreateMap<Location, LocationDto>();
            CreateMap<UpdateLocationDto, Location>();

            //Note Mappings
            CreateMap<NoteDto, Note>().ReverseMap();
            CreateMap<NoteCreateDto, Note>();
            CreateMap<NoteUpdateDto, Note>();
        }
    }
}
