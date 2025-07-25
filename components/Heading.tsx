import type React from "react"

interface HeadingProps {
  title: string
  description?: string
  className?: string
}

const Heading: React.FC<HeadingProps> = ({ title, description, className = "" }) => {
  return (
    <div className={`mb-6 ${className} text-center space-y-6 max-w-4xl m-auto`}>
      <h2 className="text-2xl md:text-5xl font-bold text-[#136494] mb-2">{title}</h2>

      {description && <p className="text-[#136494] mb-3">{description}</p>}

      <div className="h-0.5 bg-gray-300 w-full"></div>
    </div>
  )
}

export default Heading

