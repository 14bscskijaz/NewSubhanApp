namespace BusServiceAPI.Models.DTOs
{
    public class RouteDTO
    {
        public int Id { get; set; } // Serial
        public string SourceCity { get; set; } // varchar(32)
        public string SourceAdda { get; set; } // varchar(32)
        public string DestinationCity { get; set; } // varchar(32)
        public string DestinationAdda { get; set; } // varchar(32)
    }

}
