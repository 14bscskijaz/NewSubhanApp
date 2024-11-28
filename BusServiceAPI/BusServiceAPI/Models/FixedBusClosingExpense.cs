namespace BusServiceAPI.Models
{
    public class FixedBusClosingExpense
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public int DriverCommission { get; set; }
        public int COilExpense { get; set; } // C-Oil
        public int TollTax { get; set; } // Increase 10% annually
        public int HalfSafai { get; set; }
        public int FullSafai { get; set; }
        public int DcPerchi { get; set; } // Other than Fsd source
        public int RefreshmentRate { get; set; } // Fixed for Islamabad
        public int AlliedMorde { get; set; }

        // Navigation properties
        public Route Route { get; set; }
        public int RouteId { get; set; }
    }

}
