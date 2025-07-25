"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/swiper-bundle.css"

const CompanySection = () => {
  const companies = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    logo: `/companies/company-${i + 1}.png`,
    alt: `Company ${i + 1}`,
  }))

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[#136494] mb-12">مصرح من</h2>

        <div className="max-w-4xl mx-auto">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={4}
            loop={true}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: false,
              stopOnLastSlide: false,
              waitForTransition: true,
            }}
            speed={2000}
          >
            {companies.map((company) => (
              <SwiperSlide key={company.id}>
                <div className="w-32 h-32 flex items-center justify-center">
                  <img src={company.logo} alt={company.alt} className="max-w-full max-h-full object-contain" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}


export default CompanySection 