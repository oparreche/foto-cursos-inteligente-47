
import { z } from "zod";
import { formSchema } from "./classFormSchema";

// Tipo básico para uma turma (classe)
export type ClassItem = {
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
};

// Tipo para valores do formulário
export type FormValues = z.infer<typeof formSchema>;

// Tipo para dados enviados ao Supabase
export type ClassForSupabase = {
  id?: string;
  course_id?: string;
  instructor_id?: string;
  course_name: string;
  course_slug: string;
  image: string;
  month: string;
  year: string;
  period: string;
  start_date: Date;
  end_date: Date;
  days: string;
  time: string;
  location: string;
  spots_available: number;
  total_spots: number;
  price: string;
  description: string;
};

// Funções de conversão entre formatos
export const convertFormToSupabase = (values: FormValues): ClassForSupabase => {
  return {
    course_name: values.courseName,
    course_slug: values.courseSlug,
    image: values.image,
    month: values.month,
    year: values.year,
    period: values.period,
    start_date: values.startDate,
    end_date: values.endDate,
    days: values.days,
    time: values.time,
    location: values.location,
    spots_available: values.spotsAvailable,
    total_spots: values.totalSpots,
    price: values.price,
    description: values.description,
  };
};

export const convertSupabaseToClassItem = (
  dbClass: any
): ClassItem => {
  return {
    id: dbClass.id ? parseInt(dbClass.id.toString().replace(/-/g, "").substring(0, 9), 16) : 0,
    courseName: dbClass.course_name,
    courseSlug: dbClass.course_slug,
    image: dbClass.image || "",
    month: dbClass.month,
    year: dbClass.year,
    period: dbClass.period,
    startDate: dbClass.start_date ? new Date(dbClass.start_date) : new Date(),
    endDate: dbClass.end_date ? new Date(dbClass.end_date) : new Date(),
    days: dbClass.days,
    time: dbClass.time,
    location: dbClass.location,
    spotsAvailable: dbClass.spots_available,
    totalSpots: dbClass.total_spots,
    price: dbClass.price,
    instructor: dbClass.instructor_id || "Sem instrutor",
    description: dbClass.description || "",
  };
};
