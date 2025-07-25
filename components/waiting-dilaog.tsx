"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"

interface WaitingDialogProps {
  isOpen: boolean
  paymentStatus?: "idle" | "pending" | "processing" | "success" | "error"
  onRefresh?: () => void
}

export default function WaitingDialog({ isOpen, paymentStatus, onRefresh }: WaitingDialogProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    if (paymentStatus === "pending" || paymentStatus === "processing") {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
      }, 500)
      return () => clearInterval(interval)
    }
  }, [paymentStatus])

  if (!isOpen) return null

  const getStatusContent = () => {
    switch (paymentStatus) {
      case "pending":
      case "processing":
        return {
          icon: <Clock className="w-12 h-12 text-blue-500 animate-pulse" />,
          title: "جاري معالجة الدفع",
          message: `يرجى الانتظار بينما نقوم بمعالجة دفعتك${dots}`,
          showRefresh: false,
        }
      case "success":
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: "تم الدفع بنجاح",
          message: "تمت معالجة دفعتك بنجاح",
          showRefresh: false,
        }
      case "error":
        return {
          icon: <XCircle className="w-12 h-12 text-red-500" />,
          title: "فشل في الدفع",
          message: "حدث خطأ أثناء معالجة الدفع",
          showRefresh: true,
        }
      default:
        return {
          icon: <Clock className="w-12 h-12 text-gray-500" />,
          title: "جاري المعالجة",
          message: "يرجى الانتظار...",
          showRefresh: false,
        }
    }
  }

  const { icon, title, message, showRefresh } = getStatusContent()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-right">{title}</h3>
        <p className="text-gray-600 mb-6 text-right">{message}</p>
        {showRefresh && (
          <button
            onClick={onRefresh}
            className="flex items-center justify-center gap-2 bg-[#146394] text-white px-4 py-2 rounded-lg hover:bg-[#0d4e77] transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </button>
        )}
      </div>
    </div>
  )
}
