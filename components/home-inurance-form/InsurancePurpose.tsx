"use client"

import type React from "react"

import { motion } from "framer-motion"
import { onlyNumbers } from "@/lib/utils"
import { InsuranceFormData } from "@/lib/types/insurance"

interface Props {
  formData: InsuranceFormData
  setFormData: React.Dispatch<React.SetStateAction<InsuranceFormData>>
  errors: Partial<Record<keyof InsuranceFormData, string>>
}

const InsurancePurpose: React.FC<Props> = ({ formData, setFormData, errors }) => {
  // When purpose changes, reset related fields
  const handlePurposeChange = (newPurpose: "renewal" | "property-transfer") => {
    setFormData((prev: any) => ({
      ...prev,
      insurance_purpose: newPurpose,
      // Reset fields when switching purpose
      owner_identity_number: "",
      buyer_identity_number: "",
      seller_identity_number: "",
      // Force registration type when transfer is selected
      vehicle_type: newPurpose === "property-transfer" ? "registration" : prev.vehicle_type,
    }))
  }

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-2xl font-bold text-[#146394] mb-6 pb-3 border-b-2">الغرض من التأمين</h3>

      <div className="space-y-6">
        <div className="flex gap-4">
          {[
            { value: "renewal", label: "تأمين جديد" },
            { value: "property-transfer", label: "نقل ملكية" },
          ].map((option) => (
            <label key={option.value} className="flex-1">
              <input
                type="radio"
                name="insurance_purpose"
                value={option.value}
                checked={formData.insurance_purpose === option.value}
                onChange={() => handlePurposeChange(option.value as "renewal" | "property-transfer")}
                className="hidden"
              />
              <span
                className={`block text-center py-3 rounded-lg transition-all duration-200 cursor-pointer
                ${
                  formData.insurance_purpose === option.value
                    ? "bg-[#146394] text-white shadow-lg transform scale-105"
                    : "bg-gray-100 text-[#146394] hover:bg-gray-200"
                }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>

        {/* Dynamic Fields Based on Purpose */}
        <div className="space-y-4">
          <div>
            <label className="block text-[#146394] font-bold mb-2">اسم مالك الوثيقة بالكامل</label>
            <input
              type="text"
              value={formData.documment_owner_full_name}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  documment_owner_full_name: e.target.value,
                }))
              }
              className={`w-full px-4 py-3 border-2 rounded-lg ${
                errors.documment_owner_full_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="أدخل اسم مالك الوثيقة بالكامل"
            />
            {errors.documment_owner_full_name && (
              <p className="text-red-500 text-xs mt-1">{errors.documment_owner_full_name}</p>
            )}
          </div>

          {formData.insurance_purpose === "renewal" ? (
            <div>
              <label className="block text-[#146394] font-bold mb-2">رقم الهوية الوطنية</label>
              <input
                type="tel"
                maxLength={10}
                value={formData.owner_identity_number || ""}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    owner_identity_number: onlyNumbers(e.target.value),
                  }))
                }
                className={`w-full px-4 py-3 border-2 rounded-lg ${
                  errors.owner_identity_number ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="أدخل رقم الهوية"
              />
              {errors.owner_identity_number && (
                <p className="text-red-500 text-xs mt-1">{errors.owner_identity_number}</p>
              )}
            </div>
          ) : (
            <>
              <div>
                <label className="block text-[#146394] font-bold mb-2">رقم هوية المشتري</label>
                <input
                    type="tel"
                    maxLength={10}
                  value={formData.buyer_identity_number || ""}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      buyer_identity_number: onlyNumbers(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.buyer_identity_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم هوية المشتري"
                />
                {errors.buyer_identity_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.buyer_identity_number}</p>
                )}
              </div>
              <div>
                <label className="block text-[#146394] font-bold mb-2">رقم هوية البائع</label>
                <input
   type="tel"
   maxLength={10}                  value={formData.seller_identity_number || ""}
                  onChange={(e) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      seller_identity_number: onlyNumbers(e.target.value),
                    }))
                  }
                  className={`w-full px-4 py-3 border-2 rounded-lg ${
                    errors.seller_identity_number ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="أدخل رقم هوية البائع"
                />
                {errors.seller_identity_number && (
                  <p className="text-red-500 text-xs mt-1">{errors.seller_identity_number}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default InsurancePurpose

