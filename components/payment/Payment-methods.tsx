export const PaymentMethods = () => {
    const paymentCards = ["visa", "mastercard", "mada"]
  
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 backdrop-blur-lg bg-opacity-95 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold text-right mb-6 text-[#146394]">طرق الدفع المتاحة</h2>
        <div className="flex justify-center items-center gap-6 md:gap-8">
          {paymentCards.map((card) => (
            <img
              key={card}
              src={`/icons/${card}.png`}
              alt={card}
              className="h-10 md:h-12 object-contain transition-transform duration-300 hover:scale-110"
            />
          ))}
        </div>
      </div>
    )
  }
  
  