export default function SectionHeading({ eyebrow, title, subtitle, align = 'center', dark = false }) {
  const alignClass =
    align === 'left' ? 'text-left items-start' : 'text-center items-center mx-auto'

  return (
    <div className={`flex max-w-3xl flex-col gap-3 ${alignClass} mb-12`}>
      {eyebrow && (
        <span
          className={`text-sm font-semibold uppercase tracking-wider ${
            dark ? 'text-indigo-200' : 'text-indigo-600'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`font-display text-3xl font-bold tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-base leading-relaxed sm:text-lg ${dark ? 'text-indigo-100' : 'text-slate-600'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
