
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role: "super_admin" | "admin" | "viewer" | "instructor" | "student" | "coordinator" | "professor";
}

const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const styles = {
    super_admin: "bg-pink-100 text-pink-800",
    admin: "bg-purple-100 text-purple-800",
    coordinator: "bg-indigo-100 text-indigo-800",
    professor: "bg-blue-100 text-blue-800",
    instructor: "bg-blue-100 text-blue-800", // Mantendo para compatibilidade
    viewer: "bg-gray-100 text-gray-800",
    student: "bg-green-100 text-green-800"
  };

  const labels = {
    super_admin: "Super Admin",
    admin: "Administrador",
    coordinator: "Coordenador",
    professor: "Professor", 
    instructor: "Instrutor", // Mantendo para compatibilidade
    viewer: "Visualizador",
    student: "Estudante"
  };

  // Converter "professor" para "instructor" para compatibilidade com o backend
  const displayRole = role as keyof typeof styles;

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs",
        styles[displayRole]
      )}
    >
      {labels[displayRole]}
    </span>
  );
};

export default UserRoleBadge;
