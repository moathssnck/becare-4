const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="relative w-auto h-auto">
        <img src={`/icons/${icon}.svg`} alt={title} />
      </div>
      <h3 className="text-xl font-bold text-[#136494]">{title}</h3>
      <p className="text-[#136494]">{description}</p>
    </div>
  )
}

export default FeatureCard

