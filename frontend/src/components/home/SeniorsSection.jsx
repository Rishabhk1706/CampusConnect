import { useMemo, useState } from 'react'
import { Check, Search, X } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import MentorCard from './MentorCard'
import { MENTORS } from '../../data/demoData'
import { useAuth } from '../../context/AuthContext'
import { scrollToSection } from '../../utils/navigation'

const DOMAINS = ['All', ...new Set(MENTORS.map((m) => m.domain))]
const SKILLS = ['All', ...new Set(MENTORS.flatMap((m) => m.skills))]
const COMPANIES = ['All', ...new Set(MENTORS.map((m) => m.company))]

export default function SeniorsSection() {
  const { isAuthenticated } = useAuth()
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('All')
  const [skill, setSkill] = useState('All')
  const [company, setCompany] = useState('All')
  const [internOnly, setInternOnly] = useState(false)
  const [mentorship, setMentorship] = useState('All')
  const [notice, setNotice] = useState('')
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [requested, setRequested] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peerconnect-requests')) || [] } catch { return [] }
  })

  const mentorshipOptions = useMemo(
    () => ['All', ...new Set(MENTORS.flatMap((m) => m.mentorship))],
    [],
  )

  const filtered = useMemo(() => {
    return MENTORS.filter((m) => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        !q ||
        [m.name, m.role, m.company, m.domain, ...m.skills, ...m.mentorship].join(' ').toLowerCase().includes(q)
      const matchesDomain = domain === 'All' || m.domain === domain
      const matchesSkill = skill === 'All' || m.skills.includes(skill)
      const matchesCompany = company === 'All' || m.company === company
      const matchesIntern = !internOnly || m.hasInternship
      const matchesMentorship = mentorship === 'All' || m.mentorship.includes(mentorship)
      return matchesQuery && matchesDomain && matchesSkill && matchesCompany && matchesIntern && matchesMentorship
    })
  }, [query, domain, skill, company, internOnly, mentorship])

  const handleConnect = (mentor) => {
    if (!isAuthenticated) {
      setNotice(`Sign in to send a connection request to ${mentor.name}.`)
      scrollToSection('cta')
      return
    }
    setRequested((prev) => {
      if (prev.includes(mentor.id)) { setNotice(`You already sent a demo connection request to ${mentor.name}.`); return prev }
      const next = [...prev, mentor.id]
      localStorage.setItem('peerconnect-requests', JSON.stringify(next))
      setNotice(`Connection request sent to ${mentor.name}. This demo saves requests in your browser.`)
      return next
    })
  }

  const handleView = (mentor) => {
    setSelectedMentor(mentor)
  }

  return (
    <section id="seniors" className="scroll-mt-24 bg-slate-50/80 py-20 sm:py-24">
      <div id="mentor" className="sr-only" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Meet Seniors Who Can Help You Move Forward"
          subtitle="Discover experienced students who are ready to share their knowledge, explain their preparation strategies, and help you make informed career decisions."
        />

        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <label className="relative block">
            <span className="sr-only">Search seniors</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search seniors by skills, company, role, or domain..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-12 pr-4 text-sm outline-none ring-indigo-500/0 transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
            />
          </label>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterSelect label="Career Domain" value={domain} onChange={setDomain} options={DOMAINS} />
            <FilterSelect label="Technical Skills" value={skill} onChange={setSkill} options={SKILLS} />
            <FilterSelect label="Company" value={company} onChange={setCompany} options={COMPANIES} />
            <FilterSelect label="Mentorship Interests" value={mentorship} onChange={setMentorship} options={mentorshipOptions} />
            <label className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={internOnly}
                onChange={(e) => setInternOnly(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              Internship experience
            </label>
          </div>
        </div>

        {notice && (
          <p role="status" className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            {notice}
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-medium text-slate-800">No seniors match your filters</p>
            <p className="mt-2 text-sm text-slate-500">Try adjusting search terms or clearing filters.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} onViewProfile={handleView} onConnect={handleConnect} requested={requested.includes(mentor.id)} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => scrollToSection('seniors')}
            className="rounded-xl bg-navy-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            View All Seniors
          </button>
          <p className="mt-2 text-xs text-slate-500">Fictional demonstration profiles — ready for MongoDB integration</p>
        </div>
      </div>
      {selectedMentor && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/50 p-4" onClick={() => setSelectedMentor(null)}>
        <section role="dialog" aria-modal="true" aria-labelledby="mentor-dialog-title" onClick={(e) => e.stopPropagation()} className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl">
          <button type="button" aria-label="Close profile" onClick={() => setSelectedMentor(null)} className="absolute right-4 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
          <h2 id="mentor-dialog-title" className="font-display text-2xl font-bold text-navy-900">{selectedMentor.name}</h2>
          <p className="mt-1 font-medium text-indigo-600">{selectedMentor.role}</p>
          <p className="mt-4 text-sm text-slate-600">{selectedMentor.college} · {selectedMentor.department}</p>
          <p className="mt-1 text-sm text-slate-600">Experience: {selectedMentor.company}</p>
          <p className="mt-5 leading-relaxed text-slate-700">{selectedMentor.intro}</p>
          <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">Skills and interests</p>
          <div className="mt-2 flex flex-wrap gap-2">{[...selectedMentor.skills, ...selectedMentor.mentorship].map((item) => <span key={item} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">{item}</span>)}</div>
          <button type="button" onClick={() => { handleConnect(selectedMentor); setSelectedMentor(null) }} className="mt-7 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700">{requested.includes(selectedMentor.id) ? <><Check className="mr-2 inline h-4 w-4" />Request sent</> : 'Send connection request'}</button>
          <p className="mt-3 text-center text-xs text-slate-500">Fictional demonstration profile</p>
        </section>
      </div>}
    </section>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <label className="block text-xs font-semibold text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}
