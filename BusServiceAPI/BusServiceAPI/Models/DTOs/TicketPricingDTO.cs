namespace BusServiceAPI.Models.DTOs
{
    public class TicketPricingDTO
    {
        public int Id { get; set; }
        public int RouteId { get; set; } // FK to Route
        public String BusType { get; set; } // Enum (Standard, Business)
        public int TicketPrice { get; set; } // Int
    }

}
