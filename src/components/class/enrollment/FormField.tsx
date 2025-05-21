
import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  children?: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  required = false,
  children,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        {children || (
          <input
            type={type}
            name={name}
            id={name}
            placeholder={placeholder}
            required={required}
            className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-gray-300 rounded-md"
          />
        )}
      </div>
    </div>
  );
};

export default FormField;
