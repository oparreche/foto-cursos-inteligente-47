
export interface ClassItem {
  id: number;
  courseName: string;
  courseSlug: string;
  image: string;
  month: string;
  year: string;
  period: string;
  startDate: Date;
  endDate: Date;
  days: string;
  time: string;
  location: string;
  spotsAvailable: number;
  totalSpots: number;
  price: string;
  instructor: string;
  description: string;
}

export interface FormValues {
  courseName: string;
  courseSlug: string;
  image: string;
  month: string;
  year: string;
  period: string;
  startDate: Date;
  endDate: Date;
  days: string;
  time: string;
  location: string;
  spotsAvailable: number;
  totalSpots: number;
  price: string;
  instructor: string;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  createdAt: Date;
  lastLogin: Date;
}

export interface Permission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

export interface AccessLevel {
  role: string;
  classes: Permission;
  courses: Permission;
  blog: Permission;
  users: Permission;
  payments: Permission;
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  userName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  method: string;
  description: string;
}

export interface DashboardStats {
  totalStudents: number;
  activeClasses: number;
  totalRevenue: number;
  newEnrollments: number;
}
