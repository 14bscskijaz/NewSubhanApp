import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  url: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  isActive?: boolean;
  items?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type ActionResponse<T> = {
  columnTotals: Record<string, any>,
  totalItems: number,
  pageNumber: number,
  pageSize: number,
  items: T[]
  error?: any;
}

export interface QueryParams {
  page: number;
  pageSize: number;
  startDate?: Date ;
  endDate?: Date ;
  q?: string;
  busId?: string[];
  aggregate?: string ;
  filters?: Record<string, string>;
  // This is important as Typescript doesn't deal well with a variable that can be a list or a string
  filtersListValues?: Record<string, string[]>;
}
