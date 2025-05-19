
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

export interface Permission {
  role: string;
  module: string;
  can_view: boolean;
  can_create: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface UserFilterState {
  searchTerm: string;
}
