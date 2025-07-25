"use client"

import { motion, AnimatePresence } from "framer-motion"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  progress?: number
}

const LoadingOverlay = ({ isVisible, message = "جاري معالجة طلبك...", progress }: LoadingOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            className="bg-white rounded-2xl p-8 flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="relative mb-6">
              <LoadingSpinner size="lg" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#146394]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
            
            <p className="text-[#146394] font-semibold text-lg text-center mb-4">
              {message}
            </p>
            
            {progress !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <motion.div
                  className="bg-[#146394] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            )}
            
            <div className="flex space-x-1 rtl:space-x-reverse">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-[#146394] rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay