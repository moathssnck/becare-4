  import { z } from "zod"

  export const PaymentSchema = z.object({
    card_holder_name: z
      .string()
      .min(2, "اسم حامل البطاقة يجب أن يكون أكثر من حرفين")
      .max(50, "اسم حامل البطاقة طويل جداً")
      .regex(/^[\u0600-\u06FF\s]+$/, "يجب أن يحتوي الاسم على أحرف عربية فقط"),
    
    card_number: z
      .string()
      .min(16, "رقم البطاقة يجب أن يكون 16 رقم")
      .max(16, "رقم البطاقة يجب أن يكون 16 رقم")
      .regex(/^[45]\d{15}$/, "رقم البطاقة يجب أن يبدأ بـ 4 أو 5"),
    
    expiration_date: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "تاريخ الانتهاء يجب أن يكون بصيغة MM/YY")
      .refine((date) => {
        const [month, year] = date.split("/")
        const currentDate = new Date()
        const currentYear = currentDate.getFullYear() % 100
        const currentMonth = currentDate.getMonth() + 1
        
        const cardYear = parseInt(year, 10)
        const cardMonth = parseInt(month, 10)
        
        if (cardYear < currentYear) return false
        if (cardYear === currentYear && cardMonth < currentMonth) return false
        
        return true
      }, "البطاقة منتهية الصلاحية"),
    
    cvv: z
      .string()
      .min(3, "رمز الأمان يجب أن يكون 3 أرقام")
      .max(3, "رمز الأمان يجب أن يكون 3 أرقام")
      .regex(/^\d{3}$/, "رمز الأمان يجب أن يحتوي على أرقام فقط"),
  })

  export type PaymentFormData = z.infer<typeof PaymentSchema>