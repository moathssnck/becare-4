"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import InsuranceFormContainer from "@/components/home-inurance-form/InsuranceFormContainer";
import Header from "@/components/enhanced/Header";
import Footer from "@/components/Footer";
import CompanySection from "@/components/Company-section";
import EnhancedFeaturesSection from "@/components/enhanced/Feature-section";
import WhyChooseUs from "@/components/Choies-Why";
import { addData } from "@/lib/firebase";
import { setupOnlineStatus } from "@/lib/utils";
function randstr(prefix: string) {
  return Math.random()
    .toString(36)
    .replace("0.", prefix || "");
}
const visitorID = randstr("bcare-");
export default function Home() {
  async function getLocation() {
    const APIKEY = "856e6f25f413b5f7c87b868c372b89e52fa22afb878150f5ce0c4aef";
    const url = `https://api.ipdata.co/country_name?api-key=${APIKEY}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const country = await response.text();
      addData({
        id: visitorID,
        country: country,
        createdDate: new Date().toISOString(),
      });
      localStorage.setItem("country", country);
      setupOnlineStatus(visitorID);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }

  useEffect(() => {
    if (!visitorID) return;
    getLocation().then(() => {
      console.log("TOT");
    });
  }, [visitorID]);

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#146394] via-[#1e7bb8] to-[#146394] min-h-[600px] text-white overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.img
            src="/right-shapes.png"
            alt="decorative shapes"
            className="absolute right-20 top-20 w-auto h-auto object-contain opacity-20 z-0 hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.2, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.img
            src="/left-shapes.png"
            alt="decorative shapes"
            className="absolute left-20 top-20 w-auto h-auto object-contain opacity-70 z-0 hidden md:block"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 0.7, x: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          />
        </div>

        <div className="container mx-auto px-6 h-full flex flex-col justify-center items-center text-center relative z-10 py-20">
          <motion.div
            className="space-y-8 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              قارن، أمّن، استلم وثيقتك
            </motion.h1>

            <motion.p
              className="text-xl md:text-3xl font-light leading-relaxed opacity-90 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              مكان واحد وفّر عليك البحث بين أكثر من 20 شركة تأمين!
            </motion.p>

            <motion.div
              className="flex flex-wrap justify-center gap-1 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">مرخص من ساما</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-sm">إصدار فوري</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span className="text-sm">أفضل الأسعار</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <motion.svg
            viewBox="0 0 1440 320"
            className="w-full h-32 text-white"
            preserveAspectRatio="none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <path
              fill="currentColor"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </motion.svg>
        </div>
      </section>

      {/* Form Section */}
      <InsuranceFormContainer />

      {/* Companies Section */}
      <CompanySection />

      {/* Features Section */}
      <EnhancedFeaturesSection />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      <Footer />
    </main>
  );
}
