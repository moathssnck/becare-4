"use client"

import { format, isValid, parse } from "date-fns"
import { ar } from "date-fns/locale"

export interface PolicyDetailsProps {
  policyDetails: {
    insurance_type: string
    company: string
    start_date: string
    referenceNumber: string
    endDate: string
  }
}

// Safely format a date string, with fallback for invalid dates
const formatSafeDate = (dateString: string) => {
  try {
    // First try to parse as ISO format
    let date = new Date(dateString)

    // If that fails, try common formats
    if (!isValid(date)) {
      // Try DD/MM/YYYY format
      date = parse(dateString, "dd/MM/yyyy", new Date())

      // Try YYYY-MM-DD format
      if (!isValid(date)) {
        date = parse(dateString, "yyyy-MM-dd", new Date())
      }

      // Try DD-MM-YYYY format
      if (!isValid(date)) {
        date = parse(dateString, "dd-MM-yyyy", new Date())
      }
    }

    // Check if the date is valid after all parsing attempts
    if (!isValid(date)) {
      return "تاريخ غير صالح"
    }

    return format(date, "dd MMMM yyyy", { locale: ar })
  } catch (error) {
    console.error("Error formatting date:", error)
    return "تاريخ غير صالح"
  }
}

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="text-right">
    <p className="text-gray-600 mb-1">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
)

export const PolicyDetails = ({ policyDetails }: PolicyDetailsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold text-right mb-6 text-[#146394]">تفاصيل الوثيقة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <DetailItem label="نوع التأمين" value={policyDetails.insurance_type} />
          <DetailItem label="شركة التأمين" value={policyDetails.company} />
          <DetailItem label="تاريخ بدء الوثيقة" value={formatSafeDate(policyDetails.start_date)} />
        </div>
        <div className="space-y-4">
          <DetailItem label="الرقم المرجعي للتسعيرة" value={policyDetails.referenceNumber} />
          <DetailItem label="تاريخ انتهاء الوثيقة" value={formatSafeDate(policyDetails.endDate)} />
        </div>
      </div>
    </div>
  )
}

