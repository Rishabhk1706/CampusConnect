import { ArrowRight, Award, MessageCircle, Network, Sparkles, TrendingUp } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { scrollToSection } from '../../utils/navigation'

const TRUST = [
  { icon: TrendingUp, text: 'Learn from Experienced Seniors' },
  { icon: Award, text: 'Get Real Placement Insights' },
  { icon: Network, text: 'Build Your Professional Network' },
]

const MINI_MENTORS = [
  { name: 'Aarav Sharma', role: 'SDE Intern · Microsoft', badge: 'Top Mentor' },
  { name: 'Priya Verma', role: 'Data Analyst · Deloitte', badge: 'Resume Expert' },
  { name: 'Ananya Gupta', role: 'CP Enthusiast · NIT', badge: 'DSA Coach' },
]

export default function HeroSection() {
  return (
    <section id="home" className="gradient-hero relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Junior–Senior mentorship community
          </div>
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-navy-900 sm:text-5xl lg:text-[3.25rem]">
            Your Seniors Have Been There. <span className="text-indigo-600">Let Them Guide You.</span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            College life comes with countless questions about internships, placements, interviews, projects, and career
            choices. PeerConnect bridges the gap between juniors and seniors, helping you learn from real experiences,
            discover the right mentors, and take confident steps toward your future.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => scrollToSection('mentor')}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Find Your Mentor
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('stories')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 shadow-sm transition hover:border-indigo-200 hover:text-indigo-700"
            >
              Explore Success Stories
            </button>
          </div>
          <ul className="mt-10 grid gap-3 sm:grid-cols-1">
            {TRUST.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-5 shadow-2xl shadow-indigo-500/10 backdrop-blur sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Select mentors</p>
                <p className="font-display text-lg font-bold text-navy-900">Based on your interests</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Live preview</span>
            </div>
            <div className="space-y-3">
              {MINI_MENTORS.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-indigo-100 hover:bg-white"
                >
                  <Avatar name={m.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-800">{m.name}</p>
                    <p className="truncate text-xs text-slate-500">{m.role}</p>
                  </div>
                  <span className="hidden rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-bold uppercase text-indigo-700 sm:inline">
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-700">Chat preview</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="rounded-xl rounded-tl-sm bg-white px-3 py-2 text-slate-600 shadow-sm">
                  How should I start DSA for placements?
                </div>
                <div className="ml-6 rounded-xl rounded-tr-sm bg-indigo-600 px-3 py-2 text-white shadow-sm">
                  Begin with arrays, strings, and hashing — practice daily!
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['Placement Ready', 'Internship Winner', 'Community Helper'].map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800"
                >
                  <Award className="h-3 w-3" /> {badge}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
