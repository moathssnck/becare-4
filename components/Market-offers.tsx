"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import OfferCard from "../components/OfferCard";
import { offerData } from "@/lib/data";

type FilterType = "against-others" | "special" | "comprehensive";

interface InsuranceTypeOption {
  id: FilterType;
  label: string;
  ariaLabel: string;
}

// Mock data to replace API fetch

export default function Offers() {
  const [offers] = useState(offerData);
  const [filteredOffers, setFilteredOffers] = useState(offerData);
  const _id = localStorage.getItem("visitor");

  const [filters, setFilters] = useState({
    type: "" as FilterType | "",
    company: "",
  });

  const insuranceTypes: InsuranceTypeOption[] = useMemo(
    () => [
      { id: "against-others", label: "ضد الغير", ariaLabel: "تأمين ضد الغير" },
      { id: "comprehensive", label: "شامل", ariaLabel: "تأمين شامل" },
      { id: "special", label: "مميز", ariaLabel: "تأمين مميز" },
    ],
    []
  );

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...offers];

    if (filters.type) {
      filtered = filtered.filter((offer) => offer.type === filters.type);
    }

    if (filters.company) {
      filtered = filtered.filter(
        (offer) => offer.company.name === filters.company
      );
    }

    setFilteredOffers(filtered);
  }, [filters, offers]);

  const handleTypeChange = useCallback((typeId: FilterType) => {
    setFilters((prev) => ({
      ...prev,
      type: prev.type === typeId ? "" : typeId, // Toggle filter if clicked again
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 md:py-12">
      <div className="px-4 sm:px-6 lg:px-8 container mx-auto">
        <section
          className="rounded-2xl p-6 mb-8"
          role="region"
          aria-label="فلترة العروض"
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-4 w-full sm:items-center">
            <h2 className="text-xl text-[#146394] font-semibold">
              نوع التأمين
            </h2>
            <div
              className="grid grid-cols-3 gap-3 md:w-1/3 w-fit"
              role="radiogroup"
              aria-label="اختيار نوع التأمين"
            >
              {insuranceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  aria-pressed={filters.type === type.id}
                  aria-label={type.ariaLabel}
                  className={`px-3 py-2 rounded-lg transition-all duration-300 text-base whitespace-nowrap
                    ${
                      filters.type === type.id
                        ? "bg-[#146394] text-white shadow-lg transform scale-105"
                        : "bg-white text-gray-700 border-2 border-gray-200 hover:border-[#146394] hover:text-[#146394]"
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="space-y-6" aria-label="قائمة العروض">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer: { id: any; name?: string; type?: string; main_price?: string; company?: { name: string; image_url: string; }; extra_features?: { id: string; content: string; price: number; }[]; extra_expenses?: { reason: string; price: number; }[]; }) => (
              <div key={offer.id}>
                <OfferCard offer={offer as any} />
                <hr className="mt-8 container mx-auto border-4 border-[#146394]" />
              </div>
            ))
          ) : (
            <div className="text-center py-12" role="status" aria-live="polite">
              <div className="text-gray-500 text-xl">
                لا توجد عروض متاحه الان
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
