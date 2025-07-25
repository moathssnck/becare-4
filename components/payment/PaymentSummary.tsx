import { SummaryItem, TotalItem, VatNotice } from "./items"

interface SummaryDetails {
  subtotal: number
  vat: number
  total: number
}

export const PaymentSummary = ({
  summaryDetails,
}: {
  summaryDetails: SummaryDetails
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold text-right mb-6 text-[#146394]">ملخص الدفع</h2>
      <div className="space-y-4">
        <SummaryItem label="المجموع الجزئي" value={summaryDetails.subtotal} />
        <TotalItem value={summaryDetails.subtotal} />
      </div>
      <VatNotice />
    </div>
  )
}

