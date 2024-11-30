namespace BusServiceAPI.Models
{
    public class Employee
    {
        public int Id { get; set; } // Primary key, auto-incremented
        public string CNIC { get; set; } // VARCHAR(16), must be unique
        public string FirstName { get; set; } // VARCHAR(128)
        public string LastName { get; set; } // VARCHAR(128)
        public string Address { get; set; } // VARCHAR(255)
        public string MobileNumber { get; set; } // VARCHAR(20)
        public DateTime HireDate { get; set; }
        public string EmployeeStatus { get; set; } // VARCHAR(20)
        public DateTime DOB { get; set; }
        public string Notes { get; set; } // VARCHAR(255)
        public EmployeeTypeEnum EmployeeType { get; set; } // VARCHAR(32)

        // Navigation properties
        public ICollection<BusClosingVoucher> BusClosingVouchersAsDriver { get; set; }
        public ICollection<BusClosingVoucher> BusClosingVouchersAsConductor { get; set; }
    }


    public enum EmployeeTypeEnum
    {
        Driver,
        Conductor
    }
}
