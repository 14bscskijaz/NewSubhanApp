import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

type Employee = {
  id: string
  cnic: string
  first_name: string
  last_name: string
  employee_type: string
  address: string
  mobile_number: string
  hire_date: Date | null
  employee_status: string
  dob: Date | null
  notes: string
}



export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    items: []
  },
  {
    title: 'Employee',
    url: '/dashboard/employee',
    icon: 'dashboard',
    isActive: false,
    items: []
  },
  {
    title: 'Bus',
    url: '/dashboard/bus',
    icon: 'bus',
    isActive: false,
    items: []
  },
  {
    title: 'Route',
    url: '/dashboard/route',
    icon: 'route',
    isActive: false,
    items: []
  },
  {
    title: 'Ticket Pricing',
    url: '/dashboard/pricing',
    icon: 'price',
    isActive: false,
    items: []
  },
  // {
  //   title: 'Bus Closing',
  //   url: '/dashboard/bus-closing',
  //   icon: 'bus',
  //   isActive: false,
  //   items: [] 
  // },
  // {
  //   title: 'Daily Closing',
  //   url: '/dashboard/Expenses',
  //   icon: 'bus',
  //   isActive: false,
  //   items: [] 
  // },
  // {
  //   title: 'View Closing Vouchers',
  //   url: '/dashboard/view-closing-voucher',
  //   icon: 'bus',
  //   isActive: false,
  //   items: [] 
  // },
  // {
  //   title: 'View Daily Closing',
  //   url: '/dashboard/view-daily-expense',
  //   icon: 'bus',
  //   isActive: false,
  //   items: [] 
  // },
  {
    title: 'Bus Closing',
    url: '#',
    icon: 'bus',
    isActive: true,

    items: [
      {
        title: 'Add Closing Vouchers',
        url: '/dashboard/bus-closing',
        icon: 'bus'
      },
      {
        title: 'View Closing Vouchers',
        url: '/dashboard/view-closing-voucher',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Daily Closing',
    url: '#',
    icon: 'routeOff',
    isActive: true,

    items: [
      {
        title: 'Add Daily Closing',
        url: '/dashboard/daily-closing',
        icon: 'bus'
      },
      {
        title: 'View Daily Closing',
        url: '/dashboard/view-daily-expense',
        icon: 'login'
      },

    ]
  },
  {
    title: 'Expense Rates',
    url: '#',
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Trip Expense Rate',
        url: '/dashboard/trip-expense',
        icon: 'userPen'
      },
      {
        title: 'Closing Expense Rate',
        url: '/dashboard/route-closing-expense',
        icon: 'login'
      }
    ]
  },
  {
    title: 'Reports',
    url: '#',
    icon: 'billing',
    isActive: true,

    items: [
      {
        title: 'Route Report',
        url: '/dashboard/route-report',
        icon: 'login'
      },
      {
        title: 'Bus Report',
        url: '/dashboard/bus-report',
        icon: 'userPen'
      },
      {
        title: 'Bus Report Revenue',
        url: '/dashboard/bus-report-revenue',
        icon: 'userPen'
      },
      {
        title: 'Monthly Closing Report',
        url: '/dashboard/monthly-closing-report',
        icon: 'login'
      },
      {
        title: 'Driver Report',
        url: '/dashboard/driver-report',
        icon: 'login'
      },
      {
        title: 'Expense Report',
        url: '/dashboard/expense-report',
      }
    ]
  },

  // {
  //   title: 'Kanban',
  //   url: '/dashboard/kanban',
  //   icon: 'kanban',
  //   isActive: false,
  //   items: [] // No child items
  // }
];

export type dashboardCardsT = {
  id: number;
  title: string;
  value: number;
  backgroundColor?:string;
}

export const dashboardCards: dashboardCardsT[] = [
  {
    id: 1,
    title: "Bus Earning",
    value: 0
  },
  {
    id: 2,
    title: "Expense",
    value: 0
  },
  {
    id: 3,
    title: "Profit",
    value: 0
  },
]
