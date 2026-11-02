import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-500/25 transition group-hover:scale-105 sm:h-10 sm:w-10">
        <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="whitespace-nowrap font-display text-base font-bold tracking-tight text-navy-900 sm:text-lg">
          Campus<span className="text-indigo-600">Connect</span>
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-slate-500 max-[360px]:hidden">Student Community</span>
      </span>
    </Link>
  )
}
