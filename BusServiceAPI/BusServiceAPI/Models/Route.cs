namespace BusServiceAPI.Models
{
    public class Route
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public string SourceCity { get; set; } // VARCHAR(32)
        public string SourceAdda { get; set; } // VARCHAR(32)
        public string DestinationCity { get; set; } // VARCHAR(32)
        public string DestinationAdda { get; set; } // VARCHAR(32)

        // Navigation properties
        public ICollection<Trip> Trips { get; set; }
        public ICollection<FixedTripExpense> FixedTripExpenses { get; set; }
        public ICollection<FixedBusClosingExpense> FixedBusClosingExpenses { get; set; }
        public ICollection<TicketPricing> TicketPricings { get; set; }
        public ICollection<BusClosingVoucher> BusClosingVouchers { get; set; }

    }

}
