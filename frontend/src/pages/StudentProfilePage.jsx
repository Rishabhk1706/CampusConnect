import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BriefcaseBusiness,
  Code2,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Share2,
  UserRound,
} from 'lucide-react'
import { getStudentProfile } from '../utils/apis'

const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : (parts[0]?.[0] || '').toUpperCase()
}
const yearLabel = (year) => year ? `${year}${year === 1 ? 'st' : year === 2 ? 'nd' : year === 3 ? 'rd' : 'th'} Year` : ''
const externalUrl = (url) => url.startsWith('http') ? url : `https://${url}`

export default function StudentProfilePage() {
  const { id } = useParams()
  const location = useLocation()
  const [student, setStudent] = useState(null)
  const [error, setError] = useState('')
  const [chatNotice, setChatNotice] = useState('')
  const directoryPath = location.state?.from?.startsWith('/directory/')
    ? location.state.from
    : '/directory/peers'

  useEffect(() => {
    let active = true
    getStudentProfile(id)
      .then((data) => active && setStudent(data))
      .catch((err) => active && setError(err.response?.data?.error || 'Could not load this student profile.'))
    return () => { active = false }
  }, [id])

  if (error) {
    return (
      <main className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50/70 px-4 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
          <p className="font-semibold text-rose-700">{error}</p>
          <Link to={directoryPath} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <ArrowLeft size={16} />Back to directory
          </Link>
        </div>
      </main>
    )
  }

  if (!student) {
    return (
      <main className="min-h-[70vh] bg-gradient-to-br from-slate-50 via-white to-indigo-50/70 px-4 py-12">
        <div className="mx-auto max-w-6xl animate-pulse rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <div className="h-7 w-48 rounded bg-slate-100" />
          <div className="mt-5 h-40 rounded-2xl bg-slate-100" />
          <div className="mt-5 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
            <div className="h-56 rounded-2xl bg-slate-100" />
            <div className="h-56 rounded-2xl bg-slate-100" />
          </div>
        </div>
      </main>
    )
  }

  const skills = student.skills || []
  const interests = student.interests || []
  const contacts = [
    student.email && { label: student.email, href: `mailto:${student.email}`, icon: Mail },
    student.linkedinUrl && { label: student.linkedinUrl.replace(/^https?:\/\//, ''), href: externalUrl(student.linkedinUrl), icon: Link2 },
    student.githubUrl && { label: student.githubUrl.replace(/^https?:\/\//, ''), href: externalUrl(student.githubUrl), icon: Code2 },
    student.leetcodeUrl && { label: student.leetcodeUrl.replace(/^https?:\/\//, ''), href: externalUrl(student.leetcodeUrl), icon: Code2 },
    student.codeforcesUrl && { label: student.codeforcesUrl.replace(/^https?:\/\//, ''), href: externalUrl(student.codeforcesUrl), icon: Code2 },
  ].filter(Boolean)

  const showChatNotice = () => {
    setChatNotice('Direct chat is not available yet. Use the contact links below to connect.')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/70 px-4 py-6 text-slate-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <Link to={directoryPath} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900">
          <ArrowLeft size={16} />Back to Directory
        </Link>

        <section className="relative isolate overflow-hidden rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
          <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-2/3 bg-gradient-to-bl from-violet-100/90 via-indigo-50/60 to-white" />
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-full bg-gradient-to-br from-indigo-100 to-violet-200 text-2xl font-bold text-indigo-700 ring-4 ring-white shadow-sm sm:h-24 sm:w-24 sm:text-3xl">
                {initials(student.name)}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{student.name}</h1>
                <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
                  {[student.course?.name, student.branch?.name, yearLabel(student.year)].filter(Boolean).join(' · ') || 'Student'}
                </p>
                {student.college?.name && (
                  <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-500">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                    <span>{student.college.name}</span>
                  </p>
                )}
                {student.bio && <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{student.bio}</p>}
                {skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.slice(0, 5).map((skill) => (
                      <span key={skill} className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700">{skill}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:flex-col lg:flex-row">
              <button
                type="button"
                onClick={showChatNotice}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 md:flex-none"
              >
                <MessageCircle size={16} className="text-indigo-600" />Chat
              </button>
              <button
                type="button"
                onClick={showChatNotice}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 md:flex-none"
              >
                <MessagesSquare size={16} />Message/Chat
              </button>
            </div>
          </div>
          {chatNotice && (
            <p role="status" className="mt-4 rounded-xl border border-indigo-100 bg-white/90 px-4 py-3 text-sm text-indigo-800">
              {chatNotice}
            </p>
          )}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <UserRound size={18} className="text-violet-600" />About
            </h2>
            <dl className="mt-4 divide-y divide-slate-100 text-sm">
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <dt className="text-slate-500">Name</dt>
                <dd className="break-words font-medium text-slate-800">{student.name}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <dt className="text-slate-500">Course</dt>
                <dd className="break-words font-medium text-slate-800">{student.course?.name || '—'}{student.branch?.name ? ` (${student.branch.name})` : ''}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <dt className="text-slate-500">Year</dt>
                <dd className="font-medium text-slate-800">{yearLabel(student.year) || '—'}</dd>
              </div>
              <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                <dt className="text-slate-500">University</dt>
                <dd className="break-words font-medium text-slate-800">{student.college?.name || '—'}</dd>
              </div>
              {interests.length > 0 && (
                <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <dt className="text-slate-500">Interests</dt>
                  <dd className="break-words font-medium text-slate-800">{interests.join(', ')}</dd>
                </div>
              )}
              {skills.length > 0 && (
                <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <dt className="text-slate-500">Skills</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => <span key={skill} className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">{skill}</span>)}
                  </dd>
                </div>
              )}
              {(student.company || student.role) && (
                <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-2.5 sm:grid-cols-[7rem_minmax(0,1fr)]">
                  <dt className="text-slate-500">Experience</dt>
                  <dd className="flex min-w-0 items-start gap-1.5 break-words font-medium text-slate-800">
                    <BriefcaseBusiness size={14} className="mt-0.5 shrink-0 text-indigo-500" />
                    <span>{[student.company, student.role].filter(Boolean).join(' · ')}</span>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <Share2 size={18} className="text-violet-600" />Connect
            </h2>
            {contacts.length > 0 ? (
              <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-2 sm:p-3">
                {contacts.map(({ label, href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    target={href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={href.startsWith('mailto:') ? undefined : 'noreferrer'}
                    className="flex min-w-0 items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm text-slate-600 transition hover:bg-white hover:text-indigo-700"
                  >
                    <Icon size={17} className="shrink-0 text-violet-500" />
                    <span className="break-all">{label}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
                This student has not added contact links yet.
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
