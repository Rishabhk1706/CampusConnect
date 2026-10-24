import { Building2 } from 'lucide-react'

const DIFFICULTY_STYLE = {
  Easy: 'bg-emerald-100 text-emerald-800',
  Medium: 'bg-amber-100 text-amber-800',
  Hard: 'bg-red-100 text-red-800',
}

export default function InterviewExperienceCard({ item, onRead }) {
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 font-display text-sm font-bold text-white">
            {item.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Building2 className="h-3.5 w-3.5" /> {item.company}
            </p>
            <h3 className="font-display text-lg font-bold text-navy-900">{item.role}</h3>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_STYLE[item.difficulty]}`}>
          {item.difficulty}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500">
        <span>Year: {item.year}</span>
        <span>·</span>
        <span>{item.rounds} rounds</span>
        {item.demo && (
          <>
            <span>·</span>
            <span className="font-medium text-indigo-600">Sample experience</span>
          </>
        )}
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{item.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {item.skills.map((s) => (
          <span key={s} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
            {s}
          </span>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onRead(item)}
        className="mt-6 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Read Full Experience
      </button>
    </article>
  )
}
