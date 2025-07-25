"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import EnhancedOfferCard from "@/components/enhanced/OfferCard"
import Header from "@/components/enhanced/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Filter, Search, SortAsc } from "lucide-react"
import { offerData } from "@/lib/data"

type FilterType = "against-others" | "special" | "comprehensive"

interface InsuranceTypeOption {
  id: FilterType
  label: string
  ariaLabel: string
  color: string
}

export default function EnhancedOffers() {
  const [offers] = useState(offerData)
  const [filteredOffers, setFilteredOffers] = useState(offerData)
  const [visitorId, setVisitorId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<"price" | "name" | "company">("price")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("visitor")
      setVisitorId(id)
    }
  }, [])

  const [filters, setFilters] = useState({
    type: "" as FilterType | "",
    company: "",
    priceRange: { min: 0, max: 2000 }
  })

  const insuranceTypes: InsuranceTypeOption[] = useMemo(
    () => [
      { id: "against-others", label: "ضد الغير", ariaLabel: "تأمين ضد الغير", color: "bg-blue-500" },
      { id: "comprehensive", label: "شامل", ariaLabel: "تأمين شامل", color: "bg-green-500" },
      { id: "special", label: "مميز", ariaLabel: "تأمين مميز", color: "bg-purple-500" },
    ],
    [],
  )

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...offers]

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter((offer) => offer.type === filters.type)
    }

    // Filter by company
    if (filters.company) {
      filtered = filtered.filter((offer) => offer.company.name === filters.company)
    }

    // Filter by price range
    filtered = filtered.filter((offer) => {
      const price = parseFloat(offer.main_price)
      return price >= filters.priceRange.min && price <= filters.priceRange.max
    })

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((offer) =>
        offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort offers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parseFloat(a.main_price) - parseFloat(b.main_price)
        case "name":
          return a.name.localeCompare(b.name, "ar")
        case "company":
          return a.company.name.localeCompare(b.company.name, "ar")
        default:
          return 0
      }
    })

    setFilteredOffers(filtered)
  }, [filters, offers, sortBy, searchTerm])

  const handleTypeChange = useCallback((typeId: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type === typeId ? "" : typeId,
    }))
  }, [])

  const clearAllFilters = () => {
    setFilters({
      type: "",
      company: "",
      priceRange: { min: 0, max: 2000 }
    })
    setSearchTerm("")
    setSortBy("price")
  }

  const uniqueCompanies = useMemo(() => {
    return Array.from(new Set(offers.map(offer => offer.company.name)))
  }, [offers])

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-[#146394] to-[#1e7bb8] text-white py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-3xl md:text-5xl font-bold mb-4">عروض التأمين المتاحة</h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                اختر من بين أفضل عروض التأمين المصممة خصيصاً لاحتياجاتك
              </p>
              <div className="mt-6 flex justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  {filteredOffers.length} عرض متاح
                </Badge>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Filters and Search Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <Filter className="w-5 h-5" />
                  فلترة وترتيب العروض
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="ابحث عن شركة أو نوع التأمين..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#146394] focus:border-transparent text-right"
                  />
                </div>

                {/* Insurance Type Filters */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#146394] text-right">نوع التأمين</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {insuranceTypes.map((type) => (
                      <Button
                        key={type.id}
                        onClick={() => handleTypeChange(type.id)}
                        variant={filters.type === type.id ? "default" : "outline"}
                        className="justify-center"
                      >
                        <div className={`w-3 h-3 rounded-full ${type.color} mr-2`} />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Company Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-[#146394] text-right">شركة التأمين</h3>
                  <select
                    value={filters.company}
                    onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#146394] focus:border-transparent text-right"
                  >
                    <option value="">جميع الشركات</option>
                    {uniqueCompanies.map((company) => (
                      <option key={company} value={company}>
                        {company}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort and Clear */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="flex items-center gap-2">
                    <SortAsc className="w-5 h-5 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as "price" | "name" | "company")}
                      className="p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#146394] focus:border-transparent"
                    >
                      <option value="price">ترتيب حسب السعر</option>
                      <option value="name">ترتيب حسب الاسم</option>
                      <option value="company">ترتيب حسب الشركة</option>
                    </select>
                  </div>
                  
                  <Button
                    onClick={clearAllFilters}
                    variant="outline"
                    className="text-gray-600"
                  >
                    مسح جميع الفلاتر
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Offers Section */}
          <section className="space-y-8" aria-label="قائمة العروض">
            {filteredOffers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-8"
              >
                {filteredOffers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <EnhancedOfferCard offer={offer} />
                    {index < filteredOffers.length - 1 && (
                      <hr className="mt-8 border-2 border-[#146394]/20" />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-16"
              >
                <Card className="max-w-md mx-auto border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      لا توجد عروض متاحة
                    </h3>
                    <p className="text-gray-600 mb-4">
                      جرب تعديل معايير البحث أو الفلاتر للعثور على عروض مناسبة
                    </p>
                    <Button onClick={clearAllFilters} variant="default">
                      مسح الفلاتر
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}