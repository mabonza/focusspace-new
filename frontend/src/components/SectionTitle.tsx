interface SectionTitleProps {
  subtitle?: string
  title: string
  description?: string
  centered?: boolean
  light?: boolean
}

export default function SectionTitle({ subtitle, title, description, centered = false, light = false }: SectionTitleProps) {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''}`}>
      {subtitle && (
        <p className={`text-sm font-semibold uppercase tracking-widest mb-3 ${light ? 'text-gold' : 'text-gold'}`}>
          {subtitle}
        </p>
      )}
      <h2 className={`text-3xl lg:text-4xl font-serif font-bold leading-tight ${light ? 'text-white' : 'text-charcoal'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg max-w-2xl ${centered ? 'mx-auto' : ''} ${light ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}
      <div className={`mt-4 h-1 w-16 bg-gold ${centered ? 'mx-auto' : ''}`} />
    </div>
  )
}
