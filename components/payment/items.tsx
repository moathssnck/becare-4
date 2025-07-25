export const SummaryItem = ({
    label,
    value,
  }: {
    label: string
    value: number
  }) => (
    <div className="flex justify-between items-center pb-4 border-b">
      <span className="font-semibold">{value.toFixed(2)} ريال</span>
      <span className="text-gray-600">{label}</span>
    </div>
  )
  
  // export const VatItem = ({
  //   value,
  //   percentage,
  // }: {
  //   value: number;
  //   percentage: number;
  // }) => (
  //   <div className="flex justify-between items-center pb-4 border-b">
  //     <div className="text-left">
  //       <span className="font-semibold">SAR {value.toFixed(2)}</span>
  //       <p className="text-sm text-gray-500">({percentage}%)</p>
  //     </div>
  //     <span className="text-gray-600">ضريبة القيمة المضافة</span>
  //   </div>
  // );
  
  export const TotalItem = ({ value }: { value: number }) => (
    <div className="flex justify-between items-center pt-2">
      <span className="text-xl font-bold text-[#146394]">{value.toFixed(2)} ريال</span>
      <span className="font-bold">المبلغ الإجمالي</span>
    </div>
  )
  
  export const VatNotice = () => (
    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 transition-all duration-300 hover:bg-blue-100">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#146394] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-sm text-[#146394] text-right">جميع الأسعار شاملة ضريبة القيمة المضافة</p>
      </div>
    </div>
  )
  
  