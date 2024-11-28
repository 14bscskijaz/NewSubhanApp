namespace BusServiceAPI.Models.DTOs
{
    public class FixedTripExpenseDTO
    {
        public int Id { get; set; } // Serial
        public int RouteId { get; set; } // FK to Route
        public int RouteCommission { get; set; } // Int
        public int RewardCommission { get; set; } // Int
        public int Steward { get; set; } // Int
        public int Counter { get; set; } // Int
        public int DcParchi { get; set; } // Int
        public int Refreshment { get; set; } // Int
    }

}
