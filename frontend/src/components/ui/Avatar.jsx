export default function Avatar({ name, size = 'md', className = '' }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const sizes = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-16 w-16 text-lg',
  }

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 font-semibold text-white shadow-md ${sizes[size]} ${className}`}
      aria-hidden
    >
      {initials}
    </div>
  )
}
