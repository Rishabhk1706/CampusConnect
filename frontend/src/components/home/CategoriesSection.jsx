import {
  BarChart3,
  Brain,
  Building2,
  Code2,
  FileText,
  Globe,
  Map,
  Rocket,
  Shield,
  Zap,
} from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { CAREER_CATEGORIES } from '../../data/demoData'
import { scrollToSection } from '../../utils/navigation'

const ICON_MAP = {
  'code-2': Code2,
  'bar-chart-3': BarChart3,
  globe: Globe,
  brain: Brain,
  shield: Shield,
  zap: Zap,
  'building-2': Building2,
  rocket: Rocket,
  'file-text': FileText,
  map: Map,
}

export default function CategoriesSection() {
  return (
    <section className="bg-gradient-to-b from-sky-muted to-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading title="Find Guidance for Every Stage of Your Career" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CAREER_CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.icon] || Code2
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => scrollToSection('seniors')}
                className="group flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-base font-bold text-navy-900">{cat.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{cat.description}</p>
                <span className="mt-4 text-sm font-semibold text-indigo-600 group-hover:underline">Explore Mentors →</span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
