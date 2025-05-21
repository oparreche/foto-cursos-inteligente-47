
import { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  register: UseFormRegisterReturn;
  placeholder?: string;
  type?: string;
}

export const FormField = ({ 
  id, 
  label, 
  error, 
  register, 
  placeholder, 
  type = "text" 
}: FormFieldProps) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={error ? "border-red-500" : ""}
        {...register}
      />
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
