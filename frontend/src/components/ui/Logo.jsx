import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export default function Logo({ className = '' }) {
  return (
    <Link to="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-500/25 transition group-hover:scale-105">
        <GraduationCap className="h-5 w-5" aria-hidden />
      </span>
      <span className="font-display text-xl font-bold tracking-tight text-navy-900">
        Peer<span className="text-indigo-600">Connect</span>
      </span>
    </Link>
  )
}
