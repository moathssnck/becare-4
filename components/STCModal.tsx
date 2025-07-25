"use client"

import { PhoneIcon } from "lucide-react"


interface STCModalProps {
  isOpen: boolean
  onClose: () => void
}

export const STCModal = ({ isOpen, onClose }: STCModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center transition-all duration-300">
      <div className="bg-white rounded-3xl p-8 text-center space-y-6 max-w-lg w-full mx-4 shadow-2xl transform transition-all relative border border-gray-100">
        <div className="flex flex-col items-center">
          {/* Header with close button */}
          <div className="w-full flex justify-end mb-4"></div>

          {/* Icon or Logo could be added here */}
          <div className="bg-[#146394] rounded-full p-4 mb-6">
            <PhoneIcon className="w-12 h-12 text-[#eee]" />
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-slate-600 text-xl font-medium leading-relaxed">
              سيتم الاتصال بك من قبل 900 يرجى الرد علي الاتصال والضغط علي الرقم 5 للاستمرار
            </p>
          </div>
          <button onClick={onClose} className="text-[white] bg-[#146394] px-4 py-3 mt-6 rounded-lg ml-auto">
            تأكيد
          </button>
        </div>
      </div>
    </div>
  )
}

