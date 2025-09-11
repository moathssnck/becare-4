"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Phone, Mail, MapPin } from "lucide-react"

const Header = () => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      {/* Top bar with contact info */}
      <div className="bg-[#146394] text-white py-2 px-4">
        <div className="container mx-auto flex justify-around items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span>0556668899</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>info@bcare.com</span>
            </div>
          </div>
         
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="B-Care Logo" 
                className="h-12 md:h-14 w-auto object-contain hover:scale-105 transition-transform duration-300" 
              />
            </Link>
          </motion.div>

          {/* Navigation could be added here */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center gap-1"
          >
            <div className="text-sm text-gray-600">
              خدمة عملاء 24/7
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}

export default Header