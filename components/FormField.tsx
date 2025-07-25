"use client"

import { type Control, Controller, type FieldErrors } from "react-hook-form"
import { PaymentFormData } from "./payment/schema"

interface FormFieldProps {
  name: keyof PaymentFormData
  label: string
  control: Control<PaymentFormData>
  errors: FieldErrors<PaymentFormData>
  formatter?: (value: string) => string
  placeholder?: string
  type?: string
}

export const FormField = ({ name, label, control, errors, formatter, placeholder, type = "text" }: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-right text-[#146394]">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ...field } }) => (
          <input
            {...field}
            type={type}
            value={formatter ? formatter(value || "") : value}
            onChange={(e) => onChange(formatter ? e.target.value.replace(/\s/g, "") : e.target.value)}
            placeholder={placeholder}
            className={`w-full p-3 border-2 rounded-lg transition-all duration-300 ${
              errors[name]
                ? "border-red-500 bg-red-50"
                : "focus:ring-2 focus:ring-blue-200 focus:border-[#146394] border-gray-200"
            }`}
            dir={name === "card_holder_name" ? "rtl" : "ltr"}
          />
        )}
      />
      {errors[name] && <p className="text-red-500 text-sm text-right">{errors[name]?.message}</p>}
    </div>
  )
}

