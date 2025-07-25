"use client"

import { forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  required?: boolean
  description?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, icon, iconPosition, required, description, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-right font-medium text-gray-700 text-sm">
          {label}
          {required && <span className="text-red-500 mr-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gray-500 text-right">{description}</p>
        )}
        <Input
          ref={ref}
          className={cn("text-right", className)}
          {...props}
        />
        {error && (
          <p className="text-red-500 text-xs text-right animate-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = "FormField"