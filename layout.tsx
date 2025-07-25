import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_Arabic } from "next/font/google"
import "./globals.css"

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-noto-sans-arabic",
})

export const metadata: Metadata = {
  title: "بي كير للتأمين | تأمينك",
  description:
    "موقع التأمين الرائد يوفر حلول تأمينية شاملة ومتنوعة تتناسب مع احتياجات الأفراد والشركات. احصل على عروض تأمين فورية ومخصصة مع خدمة عملاء متميزة على مدار الساعة.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={notoSansArabic.className}>
      <PageListiner/>

      {children}</body>
    </html>
  )
}



import './globals.css'
import { PageListiner } from "@/components/page-listner"
