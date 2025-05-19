
import { User } from "../types";

export interface UserFormValues {
  name: string;
  email: string;
  role: "admin" | "viewer" | "instructor" | "student";
}

export interface UserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: UserFormValues) => void;
  currentUser: User | null;
  isEditing: boolean;
}
