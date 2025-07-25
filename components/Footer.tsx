const Footer = () => {
  const footerLinks = {
    aboutBCare: {
      title: "عن بي كير",
      links: [
        { name: "خصومات وريف", href: "#" },
        { name: "سياسة الخصوصية", href: "#" },
        { name: "الشروط والأحكام", href: "#" },
        { name: "وظائف", href: "#" },
      ],
    },
    products: {
      title: "منتجاتنا",
      links: [
        { name: "تأمين المركبات", href: "#" },
        { name: "التأمين الطبي", href: "#" },
        { name: "تأمين السفر", href: "#" },
        { name: "تأمين الأخطاء الطبية", href: "#" },
      ],
    },
    support: {
      title: "الدعم الفني",
      links: [
        { name: "المدونة", href: "#" },
        { name: "إلغاء وثيقتك", href: "#" },
        { name: "رفع تذكرة", href: "#" },
        { name: "اطبع وثيقتك", href: "#" },
      ],
    },
    important: {
      title: "روابط مهمة",
      links: [
        { name: "هيئة التأمين", href: "#" },
        { name: "طريقة رفع شكوى لهيئة التأمين", href: "#" },
        { name: "قواعد ولوائح هيئة التأمين", href: "#" },
        { name: "شهادة ضريبة القيمة المضافة", href: "#" },
      ],
    },
  }

  return (
    <footer className="bg-[#136494] text-slate-200 shadow-lg py-12 px-4 rtl">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row justify-between gap-12">
          <div className="flex flex-col items-end lg:w-1/4">
            <img src="/white-logo.svg" alt="B-Care Logo" className="h-16 w-auto mb-6" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:w-3/4">
            {Object.values(footerLinks).map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="font-bold text-lg mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-sm hover:text-primary transition-colors duration-300">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-300 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              <p className="text-sm">© {new Date().getFullYear()} بي كير. جميع الحقوق محفوظة</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

