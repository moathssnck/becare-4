import FeatureCard from "./FeatureCard"
import Heading from "./Heading"



export default function FeaturesSection() {
  const features = [
    {
      icon: "icon-1",
      title: "تأمينك في دقيقة",
      description: "نقارن لك كل عروض الأسعار بشكل فوري من كل شركات التأمين",
    },
    {
      icon: "icon-2",
      title: "فصّل تأمينك",
      description: "أنواع تأمين متعددة: تأمين ضد الغير، تأمين مميز، تأمين شامل وقيمة تحمل متنوعة",
    },
    {
      icon: "icon-3",
      title: "أسعار أقل",
      description: "عندنا فريق يراقب كل صغيرة و كبيرة في السوق و يضمن أن سعرك الأقل و المناسب لك وفق احتياجك",
    },
    {
      icon: "icon-4",
      title: "جدول تأمينك",
      description: "نرسل لك إشعارات تذكيرية لتجديد تأمينك وتقدر تجدول تاريخ بدايته",
    },
    {
      icon: "icon-5",
      title: "هب ريح",
      description: "نربط وثيقتك في أسرع وقت مع نظام المرور ونجم",
    },
    {
      icon: "icon-6",
      title: "خصومات تضبطك",
      description: "خصومات لبعض القطاعات الحكومية وشبه الحكومية والخاصة",
    },
    {
      icon: "icon-7",
      title: "منافع تحميك",
      description: "خطط تأمين متنوعة مع المرونة في تحديد المنافع الإضافية اللي تناسبك",
    },
    {
      icon: "icon-8",
      title: "مكان واحد",
      description: "تدير كل وثائقك إدارة إلكترونية كاملة من مكان واحد وتجددها في أي وقت",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Heading
            title="طريقك آمــن مع بي كير"
            description="نقدم لك مجموعة متكاملة من الميزات التي تلبي جميع احتياجاتك"
          />
        </div>
        <div className="grid grid-cols-auto-fit-350 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

