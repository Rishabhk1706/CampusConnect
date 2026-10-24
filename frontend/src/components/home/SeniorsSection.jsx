import { useState } from 'react'
import { Check, X } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import MentorCard from './MentorCard'
import { MENTORS } from '../../data/demoData'
import { useAuth } from '../../context/AuthContext'
import { scrollToSection } from '../../utils/navigation'

export default function SeniorsSection() {
  const { isAuthenticated } = useAuth()
  const [notice, setNotice] = useState('')
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [requested, setRequested] = useState(() => {
    try { return JSON.parse(localStorage.getItem('peerconnect-requests')) || [] } catch { return [] }
  })

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

        {notice && (
          <p role="status" className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
            {notice}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {MENTORS.map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} onViewProfile={handleView} onConnect={handleConnect} requested={requested.includes(mentor.id)} />
          ))}
        </div>

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
