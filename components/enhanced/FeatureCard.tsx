"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  index?: number
}

const FeatureCard = ({ icon, title, description, index = 0 }: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50/30">
        <CardContent className="p-6 flex flex-col items-center text-center space-y-4 h-full">
          <motion.div 
            className="relative w-16 h-16 mb-2"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#146394]/10 to-[#146394]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
            <img 
              src={`/icons/${icon}.svg`} 
              alt={title} 
              className="relative z-10 w-full h-full object-contain"
            />
          </motion.div>
          
          <h3 className="text-xl font-bold text-[#146394] group-hover:text-[#0f4c70] transition-colors duration-300">
            {title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed flex-1 group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
          
          <motion.div 
            className="w-12 h-1 bg-gradient-to-r from-[#146394] to-[#1e7bb8] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ width: 0 }}
            whileInView={{ width: 48 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FeatureCard