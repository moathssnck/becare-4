"use client"

import type React from "react"
import { motion } from "framer-motion"
import { InsuranceFormData } from "@/lib/types/insurance"
import { onlyNumbers } from "@/lib/utils"


interface Props {
  formData: InsuranceFormData
  setFormData: React.Dispatch<React.SetStateAction<InsuranceFormData>>
  errors: Partial<Record<keyof InsuranceFormData, string>>
  disabled?: boolean
}

const VehicleRegistration: React.FC<Props> = ({ formData, setFormData, errors, disabled }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    >
      <h3 className="text-2xl font-bold text-[#146394] mb-6 pb-3 border-b-2 border-[#146394]">نوع تسجيل المركبة</h3>

      <div className="space-y-6">
        <div className="flex gap-4 mb-4">
          {[
            { value: "registration", label: "استمارة" },
            { value: "customs", label: "بطاقة جمركية" },
          ].map((option) => (
            <label key={option.value} className="flex-1">
              <input
                type="radio"
                name="vehicle_type"
                value={option.value}
                checked={formData.vehicle_type === option.value}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    vehicle_type: e.target.value as "registration" | "customs",
                  }))
                }}
                disabled={disabled && option.value === "customs"}
                className="hidden"
              />
              <span
                className={`block text-center py-3 rounded-lg transition-all duration-200 cursor-pointer
                  ${
                    formData.vehicle_type === option.value
                      ? "bg-[#146394] text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-[#146394] hover:bg-gray-200"
                  }
                  ${disabled && option.value === "customs" ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {/* Dynamic Fields Based on Vehicle Type */}
        <div className="space-y-4">
          {formData.vehicle_type === "registration" ? (
            <>
              <div>
                <label className="block text-[#146394] font-bold mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  maxLength={10}
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: onlyNumbers(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم الهاتف"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-[#146394] font-bold mb-2">الرقم التسلسلي للمركبة</label>
                <input
                  type="tel"
                  value={formData.serial_number || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      serial_number: onlyNumbers(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.serial_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل الرقم التسلسلي للمركبة"
                />
                {errors.serial_number && <p className="text-red-500 text-xs mt-1">{errors.serial_number}</p>}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[#146394] font-bold mb-2">رقم صنع المركبة</label>
                <input
                  type="text"
                  value={formData.vehicle_manufacture_number || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      vehicle_manufacture_number: onlyNumbers(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.vehicle_manufacture_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم صنع المركبة"
                />
                {errors.vehicle_manufacture_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.vehicle_manufacture_number}</p>
                )}
              </div>
              <div>
                <label className="block text-[#146394] font-bold mb-2">رقم البطاقة الجمركية</label>
                <input
                  type="text"
                  value={formData.customs_code || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customs_code: onlyNumbers(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.customs_code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم البطاقة الجمركية"
                />
                {errors.customs_code && <p className="text-red-500 text-xs mt-1">{errors.customs_code}</p>}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default VehicleRegistration

