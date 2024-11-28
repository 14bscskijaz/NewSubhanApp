namespace BusServiceAPI.Models.DTOs
{
    public class EmployeeDTO
    {

        public int Id { get; set; } // Serial
        public string CNIC { get; set; } // varchar(16)
        public string FirstName { get; set; } // varchar(128)
        public string LastName { get; set; } // varchar(128)
        public string Address { get; set; } // varchar(255)
        public string MobileNumber { get; set; } // varchar(20)
        public DateTime HireDate { get; set; } // Date
        public string EmployeeStatus { get; set; } // varchar(20)
        public DateTime DOB { get; set; } // Date
        public string Notes { get; set; } // varchar(255)
        public EmployeeTypeEnum EmployeeType { get; set; } // varchar(32)


    }
}