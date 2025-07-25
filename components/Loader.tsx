"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"

interface LoadingOverlayProps {
  isVisible: boolean
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            className="bg-white rounded-2xl p-8 flex flex-col items-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <div className="relative w-20 h-20">
              <motion.div
                className="absolute inset-0 border-4 border-[#146394] rounded-full"
                animate={{
                  rotate: 360,
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </div>
            <p className="mt-4 text-[#146394] font-bold text-lg">جاري معالجة طلبك...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay

