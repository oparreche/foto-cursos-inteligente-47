
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
