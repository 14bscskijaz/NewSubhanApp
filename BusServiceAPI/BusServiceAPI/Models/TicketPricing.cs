namespace BusServiceAPI.Models
{
    public class TicketPricing
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public string BusType { get; set; } // ENUM or VARCHAR(15)
        public int TicketPrice { get; set; }

        // Navigation properties
        public Route Route { get; set; }
        public int RouteId { get; set; }
    }

}
