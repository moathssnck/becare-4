"use client"

import { motion } from "framer-motion"
import FeatureCard from "./FeatureCard"
import { Card } from "@/components/ui/card"

export default function EnhancedFeaturesSection() {
  const features = [
    {
      icon: "icon-1",
      title: "تأمينك في دقيقة",
      description: "نقارن لك كل عروض الأسعار بشكل فوري من كل شركات التأمين",
    },
    {
      icon: "icon-2",
      title: "فصّل تأمينك",
      description: "أنواع تأمين متعددة: تأمين ضد الغير، تأمين مميز، تأمين شامل وقيمة تحمل متنوعة",
    },
    {
      icon: "icon-3",
      title: "أسعار أقل",
      description: "عندنا فريق يراقب كل صغيرة و كبيرة في السوق و يضمن أن سعرك الأقل و المناسب لك وفق احتياجك",
    },
    {
      icon: "icon-4",
      title: "جدول تأمينك",
      description: "نرسل لك إشعارات تذكيرية لتجديد تأمينك وتقدر تجدول تاريخ بدايته",
    },
    {
      icon: "icon-5",
      title: "هب ريح",
      description: "نربط وثيقتك في أسرع وقت مع نظام المرور ونجم",
    },
    {
      icon: "icon-6",
      title: "خصومات تضبطك",
      description: "خصومات لبعض القطاعات الحكومية وشبه الحكومية والخاصة",
    },
    {
      icon: "icon-7",
      title: "منافع تحميك",
      description: "خطط تأمين متنوعة مع المرونة في تحديد المنافع الإضافية اللي تناسبك",
    },
    {
      icon: "icon-8",
      title: "مكان واحد",
      description: "تدير كل وثائقك إدارة إلكترونية كاملة من مكان واحد وتجددها في أي وقت",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-40 w-80 h-80 bg-gradient-to-br from-[#146394]/10 to-[#1e7bb8]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-[#146394]/10 to-[#1e7bb8]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-[#146394] mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            طريقك آمــن مع بي كير
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            نقدم لك مجموعة متكاملة من الميزات التي تلبي جميع احتياجاتك
          </motion.p>
          
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-[#146394] to-[#1e7bb8] mx-auto mt-8 rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="inline-block p-8 bg-gradient-to-r from-[#146394] to-[#1e7bb8] text-white border-0">
            <h3 className="text-2xl font-bold mb-4">جاهز لحماية مركبتك؟</h3>
            <p className="text-blue-100 mb-6">احصل على أفضل عروض التأمين في دقائق معدودة</p>
            <motion.button
              className="bg-white text-[#146394] px-8 py-1 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ابدأ الآن
            </motion.button>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}