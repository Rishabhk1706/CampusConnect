import SectionHeading from '../ui/SectionHeading'
import { INNOVATION_POINTS, TECH_STACK } from '../../data/demoData'

export default function InnovationSection() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="What Makes PeerConnect Different?" align="left" />
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <ul className="space-y-4">
            {INNOVATION_POINTS.map((point) => (
              <li key={point} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                {point}
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-slate-200 bg-navy-900 p-8 text-white shadow-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200">Intended technology stack</p>
            <p className="mt-3 text-sm text-indigo-100">
              Built for a MERN architecture with real-time messaging. Homepage demonstrates UI; backend APIs and Socket.IO
              integrate as the project matures.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TECH_STACK.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-indigo-400/30 bg-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
