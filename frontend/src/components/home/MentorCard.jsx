import { Building2, GraduationCap } from 'lucide-react'
import Avatar from '../ui/Avatar'

export default function MentorCard({ mentor, onViewProfile, onConnect, requested = false }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl">
      <div className="flex items-start gap-4">
        <Avatar name={mentor.name} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold text-navy-900">{mentor.name}</h3>
          <p className="mt-0.5 text-sm font-medium text-indigo-600">{mentor.role}</p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <Building2 className="h-3.5 w-3.5" /> {mentor.company}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <GraduationCap className="h-3.5 w-3.5" /> {mentor.college} · {mentor.department}
          </p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{mentor.intro}</p>
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Skills</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {mentor.skills.map((s) => (
            <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Helps with</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {mentor.mentorship.map((m) => (
            <span key={m} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
              {m}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-auto flex gap-3 pt-6">
        <button
          type="button"
          onClick={() => onViewProfile(mentor)}
          className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
        >
          View Profile
        </button>
        <button
          type="button"
          onClick={() => onConnect(mentor)}
          className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {requested ? 'Request sent' : 'Connect'}
        </button>
      </div>
    </article>
  )
}
