const WhyChooseUsCard = ({ icon, title }: { icon: string; title: string }) => (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 text-center group">
      <div className="relative w-auto h-auto mb-3 transition-transform duration-300 group-hover:scale-110">
        <img src={`/icons/choose-${icon}.svg`} alt={title} className="object-contain" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
    </div>
  )
  
  export default function WhyChooseUs() {
    const reasons = [
      { icon: "1", title: "منك وفيك" },
      { icon: "2", title: "عروض تفهمك" },
      { icon: "3", title: "سعر يرضيك" },
      { icon: "4", title: "إصدار سريع" },
      { icon: "5", title: "نقّسط تأمينك" },
      { icon: "6", title: "نفزع لك" },
    ]
  
    return (
      <section className="py-16 px-4 md:px-8 lg:px-16">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-12 text-[#136494]">
            لماذا يجب أن يكون بي كير خيارك الأول في التأمين
          </h1>
  
          <div className="grid md:grid-cols-auto-fit-450 grid-cols-auto-fit-250  gap-6 mt-14">
            {reasons.map((reason) => (
              <WhyChooseUsCard key={reason.icon} icon={reason.icon} title={reason.title} />
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  