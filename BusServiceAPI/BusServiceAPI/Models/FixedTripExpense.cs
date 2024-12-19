namespace BusServiceAPI.Models
{
    public class FixedTripExpense
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public double? RouteCommission { get; set; }
        public int? RewardCommission { get; set; }
        public int? Steward { get; set; }
        public int? Counter { get; set; } // Route-wise salary for counter employee
        public int? DcParchi { get; set; } // Route-wise only from Fsd as source
        public int? Refreshment { get; set; }

        // Navigation properties
        public Route? Route { get; set; }
        public int? RouteId { get; set; }
    }

}
