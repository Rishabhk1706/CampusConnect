import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import InterviewExperienceCard from './InterviewExperienceCard'
import { INTERVIEW_EXPERIENCES } from '../../data/demoData'
import { useAuth } from '../../context/AuthContext'

export default function InterviewsSection() {
  const { isAuthenticated } = useAuth()
  const [company, setCompany] = useState('All')
  const [role, setRole] = useState('All')
  const [year, setYear] = useState('All')
  const [rounds, setRounds] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [detail, setDetail] = useState('')

  const companies = ['All', ...new Set(INTERVIEW_EXPERIENCES.map((i) => i.company))]
  const roles = ['All', ...new Set(INTERVIEW_EXPERIENCES.map((i) => i.role))]
  const years = ['All', ...new Set(INTERVIEW_EXPERIENCES.map((i) => String(i.year)))]
  const roundOptions = ['All', ...new Set(INTERVIEW_EXPERIENCES.map((i) => String(i.rounds)))]
  const difficulties = ['All', 'Easy', 'Medium', 'Hard']

  const filtered = useMemo(() => {
    return INTERVIEW_EXPERIENCES.filter((i) => {
      return (
        (company === 'All' || i.company === company) &&
        (role === 'All' || i.role === role) &&
        (year === 'All' || String(i.year) === year) &&
        (rounds === 'All' || String(i.rounds) === rounds) &&
        (difficulty === 'All' || i.difficulty === difficulty)
      )
    })
  }, [company, role, year, rounds, difficulty])

  const shareExperience = () => {
    if (!isAuthenticated) {
      setDetail('Please log in to share your interview experience.')
      return
    }
    setDetail('Experience submission form will connect to the backend API. Thank you for contributing (demo).')
  }

  const readExperience = (item) => {
    setDetail(
      `${item.company} — ${item.role} (${item.year}): ${item.summary} Full articles will load from MongoDB when published.`,
    )
  }

  return (
    <section id="interviews" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Real Interview Experiences. Practical Preparation."
          subtitle="Prepare smarter with first-hand placement stories, interview questions, recruitment insights, and lessons shared by fellow students."
        />

        <div className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <MiniFilter label="Company" value={company} onChange={setCompany} options={companies} />
          <MiniFilter label="Job Role" value={role} onChange={setRole} options={roles} />
          <MiniFilter label="Recruitment Year" value={year} onChange={setYear} options={years} />
          <MiniFilter label="Interview Round" value={rounds} onChange={setRounds} options={roundOptions} />
          <MiniFilter label="Difficulty Level" value={difficulty} onChange={setDifficulty} options={difficulties} />
        </div>

        {detail && (
          <p role="status" className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
            {detail}
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <InterviewExperienceCard key={item.id} item={item} onRead={readExperience} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={shareExperience}
            className="inline-flex items-center gap-2 rounded-xl bg-navy-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            <Plus className="h-4 w-4" /> Share Your Experience
          </button>
        </div>
      </div>
    </section>
  )
}

function MiniFilter({ label, value, onChange, options }) {
  return (
    <label className="text-xs font-semibold text-slate-500">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}
