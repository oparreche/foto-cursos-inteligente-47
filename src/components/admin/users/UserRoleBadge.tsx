
import { cn } from "@/lib/utils";

interface UserRoleBadgeProps {
  role: "admin" | "editor" | "viewer";
}

const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const styles = {
    admin: "bg-purple-100 text-purple-800",
    editor: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
  };

  const labels = {
    admin: "Administrador",
    editor: "Editor",
    viewer: "Visualizador",
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs",
        styles[role]
      )}
    >
      {labels[role]}
    </span>
  );
};

export default UserRoleBadge;
