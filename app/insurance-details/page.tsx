"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { addData } from "@/lib/firebase"

type InsuranceType = "against-others" | "special" | "comprehensive"
type RepairLocation = "workshop" | "agency"

interface InsuranceDetailsForm {
  insurance_type: InsuranceType
  start_date: string
  vehicle_use_purpose: string
  estimated_worth: string
  year: string
  repair_place: RepairLocation
  agreeToTerms: boolean
}

interface InsuranceDetailsErrors {
  insurance_type?: string
  start_date?: string
  vehicle_use_purpose?: string
  estimated_worth?: string
  year?: string
  repair_place?: string
}

const insuranceTypes = [
  { id: "against-others", label: "ضد الغير" },
  { id: "special", label: "مميز" },
  { id: "comprehensive", label: "شامل" },
]

const vehicleUseOptions = [
  { value: "personal", label: "شخصي" },
  { value: "commercial", label: "تجاري" },
  { value: "rental", label: "تأجير" },
  { value: "people-transportation", label: "نقل الاركاب أو كريم-أوبر" },
  { value: "goods-transportation", label: "نقل بضائع" },
  { value: "petrol-derivatives-transportation", label: "نقل مشتقات نفطية" },
]

// Validation function
const validateInsuranceDetails = (data: InsuranceDetailsForm): InsuranceDetailsErrors => {
  const errors: InsuranceDetailsErrors = {}

  if (!data.insurance_type) {
    errors.insurance_type = "يرجى اختيار نوع التأمين"
  }

  if (!data.start_date) {
    errors.start_date = "يرجى تحديد تاريخ بدء الوثيقة"
  }

  if (!data.vehicle_use_purpose) {
    errors.vehicle_use_purpose = "يرجى اختيار الغرض من استخدام المركبة"
  }

  if (!data.estimated_worth) {
    errors.estimated_worth = "يرجى إدخال القيمة التقديرية للمركبة"
  } else if (Number.parseFloat(data.estimated_worth) <= 0) {
    errors.estimated_worth = "يجب أن تكون القيمة التقديرية أكبر من صفر"
  }

  if (!data.year) {
    errors.year = "يرجى اختيار سنة الصنع"
  }

  if (!data.repair_place) {
    errors.repair_place = "يرجى اختيار مكان الإصلاح"
  }

  return errors
}

// Helper function to allow only numbers
const onlyNumbers = (value: string): string => {
  return value.replace(/[^0-9]/g, "")
}

export default function InsuranceDetails() {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<InsuranceDetailsErrors>({})

  const [formData, setFormData] = useState<InsuranceDetailsForm>({
    insurance_type: "against-others",
    start_date: "",
    vehicle_use_purpose: "",
    estimated_worth: "",
    year: "",
    repair_place: "workshop",
    agreeToTerms: false,
  })

  const updateField = (field: Partial<InsuranceDetailsForm>) => {
    setFormData((prev) => ({ ...prev, ...field }))
  }

  const generateYearOptions = () => {
    return Array.from({ length: currentYear - 1929 }, (_, i) => currentYear - i)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const validationErrors = validateInsuranceDetails(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (formData.agreeToTerms) {
      try {
        setIsSubmitting(true)
        setErrors({})

        const visitorId = localStorage.getItem("visitor")
        if (visitorId) {
          await addData({
            id: visitorId,
            createdDate: new Date().toISOString(),
            paymentStatus: "idel",
          })
        }

        // Store in localStorage
        localStorage.setItem("insuranceDetails", JSON.stringify(formData))

        // Navigate to offers page
        router.push("/offers")
      } catch (error) {
        console.error("Error submitting insurance details:", error)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 md:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-right mb-6 md:mb-8 text-[#146394]">بيانات التأمين</h1>
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg bg-opacity-95">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Insurance Type */}
              <div className="space-y-3">
                <label className="block text-right font-medium text-[#146394]">نوع التأمين</label>
                <div className="grid grid-cols-3 gap-3 md:w-full w-fit">
                  {insuranceTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => updateField({ insurance_type: type.id as InsuranceType })}
                      className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                        formData.insurance_type === type.id
                          ? "bg-[#146394] text-white border-[#146394]"
                          : "border-gray-200 hover:border-[#146394] text-[#146394]"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                {errors.insurance_type && <p className="text-red-500 text-sm text-right">{errors.insurance_type}</p>}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label className="block text-right font-medium text-[#146394]">تاريخ بدء الوثيقة</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => updateField({ start_date: e.target.value })}
                  className="w-full p-3 md:p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-[#146394] transition-all outline-none"
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.start_date && <p className="text-red-500 text-sm text-right">{errors.start_date}</p>}
              </div>

              {/* Vehicle Use */}
              <div className="space-y-2">
                <label className="block text-right font-medium text-[#146394]">الغرض من إستخدام المركبة</label>
                <select
                  value={formData.vehicle_use_purpose}
                  onChange={(e) => updateField({ vehicle_use_purpose: e.target.value })}
                  className="w-full p-3 md:p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-[#146394] transition-all outline-none appearance-none bg-white rtl"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23146394'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: "left 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5rem",
                  }}
                >
                  <option value="">إختر</option>
                  {vehicleUseOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.vehicle_use_purpose && (
                  <p className="text-red-500 text-sm text-right">{errors.vehicle_use_purpose}</p>
                )}
              </div>

              {/* Estimated Value */}
              <div className="space-y-2">
                <label className="block text-right font-medium text-[#146394]">القيمة التقديرية للمركبة</label>
                <input
                  type="tel"
                  value={formData.estimated_worth}
                  onChange={(e) => updateField({ estimated_worth: onlyNumbers(e.target.value) })}
                  className="w-full p-3 md:p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-[#146394] transition-all outline-none"
                  min="0"
                />
                {errors.estimated_worth && <p className="text-red-500 text-sm text-right">{errors.estimated_worth}</p>}
              </div>

              {/* Manufacturing Year */}
              <div className="space-y-2">
                <label className="block text-right font-medium text-[#146394]">سنة الصنع</label>
                <select
                  value={formData.year}
                  onChange={(e) => updateField({ year: e.target.value })}
                  className="w-full p-3 md:p-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-[#146394] transition-all outline-none appearance-none bg-white rtl"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23146394'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundPosition: "left 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5rem",
                  }}
                >
                  <option value="">إختر</option>
                  {generateYearOptions().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && <p className="text-red-500 text-sm text-right">{errors.year}</p>}
              </div>

              {/* Repair Location */}
              <div className="space-y-2">
                <label className="block text-right font-medium text-[#146394]">مكان الإصلاح</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "workshop", label: "الورشة" },
                    { id: "agency", label: "الوكالة" },
                  ].map((location) => (
                    <button
                      key={location.id}
                      type="button"
                      onClick={() =>
                        updateField({
                          repair_place: location.id as RepairLocation,
                        })
                      }
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                        formData.repair_place === location.id
                          ? "bg-[#146394] text-white border-[#146394]"
                          : "border-gray-200 hover:border-[#146394] text-[#146394]"
                      }`}
                    >
                      {location.label}
                    </button>
                  ))}
                </div>
                {errors.repair_place && <p className="text-red-500 text-sm text-right">{errors.repair_place}</p>}
              </div>
              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-xl hover:bg-blue-100 transition-all duration-300">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => updateField({ agreeToTerms: e.target.checked })}
                  className="w-5 h-5 mt-1 rounded border-2 border-[#146394] text-[#146394] focus:ring-[#146394]"
                />
                <label htmlFor="terms" className="text-right text-sm text-[#146394]">
                  أوافق على منح شركة عناية الوسيط الحق في الاستعلام من شركة نجم و/أو مركز المعلومات الوطني عن بياناتي
                </label>
              </div>

              <button
                type="submit"
                disabled={!formData.agreeToTerms || isSubmitting}
                className="w-full bg-[#146394] text-white py-4 rounded-xl font-semibold text-lg hover:bg-[#0f4c70] transition-all transform hover:scale-[0.99] active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "جاري التحميل..." : "اظهار العروض"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

