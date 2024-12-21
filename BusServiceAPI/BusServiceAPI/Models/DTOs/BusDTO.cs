namespace BusServiceAPI.Models.DTOs
{
    public class BusDTO
    {
        public int Id { get; set; } // Serial (integer and autoincrementing)
        public string? BusNumber { get; set; } // varchar(9)
        public string? BusType { get; set; } // Enum (Standard, Business)
        public string? BusOwner { get; set; } // varchar(55)
        public string? Description { get; set; } // varchar(255)
        public string? BusStatus { get; set; } // varchar(20)
        public string? BusBrand { get; set; }
    }

}
