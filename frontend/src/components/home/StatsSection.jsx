import { BookOpen, Briefcase, GraduationCap, Users } from 'lucide-react'
import { STATS } from '../../data/demoData'
import { useInView } from '../../hooks/useInView'
import { useCountUp } from '../../hooks/useCountUp'

const ICONS = {
  users: Users,
  'graduation-cap': GraduationCap,
  briefcase: Briefcase,
  'book-open': BookOpen,
}

function StatCard({ stat, active }) {
  const Icon = ICONS[stat.icon]
  const count = useCountUp(stat.value, active)

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <p className="font-display text-3xl font-bold text-navy-900">
        {count}
        {stat.suffix}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-600">{stat.label}</p>
      <p className="mt-2 text-xs text-slate-400">Demo statistic — replace with live data later</p>
    </div>
  )
}

export default function StatsSection() {
  const [ref, inView] = useInView()

  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-14">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <StatCard key={stat.id} stat={stat} active={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}
