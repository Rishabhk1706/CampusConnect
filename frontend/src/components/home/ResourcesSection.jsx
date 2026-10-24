import {
  Binary,
  Calculator,
  Cpu,
  FolderKanban,
  Layers,
  Mic,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { RESOURCES } from '../../data/demoData'

const ICONS = {
  binary: Binary,
  cpu: Cpu,
  layers: Layers,
  'folder-kanban': FolderKanban,
  calculator: Calculator,
  mic: Mic,
}

export default function ResourcesSection() {
  return (
    <section id="resources" className="bg-slate-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Everything You Need to Prepare with Confidence"
          subtitle="Discover useful resources curated to help students strengthen technical fundamentals, improve problem-solving skills, and prepare for professional opportunities."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {RESOURCES.map((r) => {
            const Icon = ICONS[r.icon] || Layers
            return (
              <article
                key={r.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold text-navy-900">{r.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{r.description}</p>
                <p className="mt-3 text-xs font-semibold text-indigo-600">Est. time: {r.duration}</p>
                <button
                  type="button"
                  onClick={() => document.getElementById('resources')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-5 rounded-xl border border-indigo-200 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                >
                  Explore Resources
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
