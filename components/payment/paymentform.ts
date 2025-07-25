"use client"

import { useState } from "react"
import { PaymentFormData } from "./schema"

export const usePaymentForm = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    card_holder_name: "",
    card_number: "",
    expiration_date: "",
    cvv: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateFormField = (updates: Partial<PaymentFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setFormData({
      card_holder_name: "",
      card_number: "",
      expiration_date: "",
      cvv: "",
    })
  }

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    updateFormField,
    resetForm,
  }
}