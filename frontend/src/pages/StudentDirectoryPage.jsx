import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { BriefcaseBusiness, GraduationCap, Search, UserRound, X, SlidersHorizontal, UsersRound, Sparkles, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getDirectory, getDirectoryOptions, getMyProfile, updateMyProfile } from '../utils/apis'

const relations = ['juniors', 'peers', 'seniors']
const labels = { juniors: 'Junior', peers: 'Peer', seniors: 'Senior' }
const initials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : (parts[0]?.[0] || '').toUpperCase()
}
const field = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
const PAGE_SIZE = 12

export default function StudentDirectoryPage() {
  const { relation = 'peers' } = useParams()
  const { user, saveUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [students, setStudents] = useState([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [branches, setBranches] = useState([])
  const [options, setOptions] = useState({ companies: [], roles: [] })
  const [filters, setFilters] = useState({ search: '', branch: '', internship: '', company: '', role: '' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => { if (!relations.includes(relation)) navigate('/directory/peers', { replace: true }) }, [relation, navigate])
  useEffect(() => {
    const open = () => { if (profile) setEditing(true) }
    window.addEventListener('campusconnect:open-profile', open)
    if (location.state?.openProfile && profile) {
      setEditing(true)
      navigate(location.pathname, { replace: true, state: {} })
    }
    return () => window.removeEventListener('campusconnect:open-profile', open)
  }, [profile, location.pathname, location.state, navigate])
  useEffect(() => {
    let active = true
    Promise.allSettled([getDirectoryOptions(), getMyProfile()]).then((results) => {
      if (!active) return
      if (results[0].status === 'fulfilled') setOptions(results[0].value)
      if (results[1].status === 'fulfilled') setProfile(results[1].value)
      else setNotice(results[1].reason?.response?.data?.error || 'Profile could not be loaded. Please sign in again.')
    }).finally(() => active && setProfileLoading(false))
    return () => { active = false }
  }, [])
  useEffect(() => {
    let active = true
    setLoading(true)
    getDirectory(relation, appliedFilters).then((data) => {
      if (!active) return
      setStudents(data.students || [])
      setBranches(data.branches || [])
      setError('')
    }).catch((err) => active && setError(err.response?.data?.error || 'Could not load students. Make sure the backend and database are running.'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [relation, appliedFilters])
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [relation, appliedFilters])

  const title = useMemo(() => `${labels[relation] || 'Peer'} Directory`, [relation])
  const visibleStudents = students.slice(0, visibleCount)
  const onSave = async (event) => {
    event.preventDefault()
    setSaveError('')
    setNotice('')
    const data = new FormData(event.currentTarget)
    const graduationYearValue = data.get('graduationYear')
    const graduationYear = graduationYearValue ? Number(graduationYearValue) : undefined
    if (graduationYear !== undefined && (!Number.isInteger(graduationYear) || graduationYear < 2000 || graduationYear > 2110)) {
      setSaveError('Graduation year must be a calendar year between 2000 and 2110.')
      return
    }

    setSaving(true)
    const payload = {
      name: data.get('name'),
      year: Number(data.get('year')),
      graduationYear,
      bio: data.get('bio'),
      company: data.get('company'),
      role: data.get('role'),
      linkedinUrl: data.get('linkedinUrl'),
      githubUrl: data.get('githubUrl'),
      skills: String(data.get('skills') || '').split(',').map((skill) => skill.trim()).filter(Boolean),
      interests: String(data.get('interests') || '').split(',').map((interest) => interest.trim()).filter(Boolean),
      internships: String(data.get('internships') || '').split(',').map((internship) => internship.trim()).filter(Boolean),
    }
    try {
      const result = await updateMyProfile(payload)
      setProfile(result.user); saveUser({ ...user, ...result.user, initials: initials(result.user.name), year: `${result.user.year} Year` })
      setEditing(false); setNotice('Profile updated successfully.')
      try {
        const refreshed = await getDirectory(relation, appliedFilters)
        setStudents(refreshed.students || [])
      } catch {
        setNotice('Profile updated successfully, but the directory could not be refreshed.')
      }
    } catch (err) {
      setSaveError(err.response?.data?.error || 'Profile could not be updated. Please try again.')
    }
    finally { setSaving(false) }
  }

  return <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/70 px-4 py-7 text-slate-900 sm:px-6 lg:py-8">
    <div className="mx-auto max-w-6xl">
      <section className="mb-5 rounded-3xl bg-gradient-to-r from-indigo-800 via-indigo-600 to-violet-600 px-6 py-7 text-white shadow-lg shadow-indigo-200 sm:px-8 sm:py-9">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium"><Sparkles size={13}/> Campus community</span><h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Student Directory</h1><p className="mt-2 max-w-xl text-sm text-indigo-100 sm:text-base">Find your people, exchange experience, and grow together.</p></div><div className="flex items-center gap-2 text-sm text-indigo-100"><UsersRound size={18}/><span>Built for your campus</span></div></div>
      </section>
      <nav aria-label="Student directory groups" className="mb-5 grid grid-cols-3 gap-2 sm:gap-3">{relations.map((item) => <Link key={item} to={`/directory/${item}`} className={`group flex flex-col items-center gap-2 rounded-2xl border p-2.5 text-center transition sm:flex-row sm:items-center sm:gap-4 sm:p-5 sm:text-left ${relation === item ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'border-slate-200 bg-white text-slate-800 shadow-sm hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md'}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-11 sm:w-11 ${relation === item ? 'bg-white/15' : 'bg-indigo-50 text-indigo-600'}`}><GraduationCap size={20}/></span><span><span className="block text-xs font-semibold sm:text-base">{labels[item]}s</span><span className={`hidden text-xs sm:block ${relation === item ? 'text-indigo-100' : 'text-slate-500'}`}>{relation === item ? 'Currently viewing' : 'Explore students'}</span></span></Link>)}</nav>
      <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
      <div className="mb-4 flex items-center gap-2"><SlidersHorizontal size={17} className="text-indigo-600"/><h2 className="font-semibold text-slate-900">Find students</h2></div>
      <form onSubmit={(event) => { event.preventDefault(); setAppliedFilters(filters) }}>
      <label className="relative block"><Search size={18} className="absolute left-4 top-3.5 text-slate-400"/><input className={`${field} pl-11`} placeholder="Search by name, skill or interest..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })}/></label>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
        <label className="text-xs font-semibold text-slate-600">Branch<select className={`${field} mt-1.5`} value={filters.branch} onChange={(e) => setFilters({ ...filters, branch: e.target.value })}><option value="">All Branches</option>{branches.map((branch) => <option key={branch._id} value={branch._id}>{branch.name}</option>)}</select></label>
        <label className="text-xs font-semibold text-slate-600">Internship<select className={`${field} mt-1.5`} value={filters.internship} onChange={(e) => setFilters({ ...filters, internship: e.target.value })}><option value="">Any</option><option value="yes">Yes</option><option value="no">No</option></select></label>
        <label className="text-xs font-semibold text-slate-600">Company<input list="directory-companies" className={`${field} mt-1.5`} placeholder="Search company..." value={filters.company} onChange={(e) => setFilters({ ...filters, company: e.target.value })}/><datalist id="directory-companies">{options.companies.map((name) => <option key={name} value={name}/>)}</datalist></label>
        <label className="text-xs font-semibold text-slate-600">Role<input list="directory-roles" className={`${field} mt-1.5`} placeholder="Search role..." value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })}/><datalist id="directory-roles">{options.roles.map((name) => <option key={name} value={name}/>)}</datalist></label>
        <button className="mt-auto inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700"><Search size={16}/>Search</button>
      </div>
      </form>
      </section>
      <div className="mb-4 mt-8 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Your campus network</p><h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2></div><span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">{loading ? 'Loading…' : `${students.length} matching students`}</span></div>
      {error && <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
      {notice && <p className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-700">{notice}</p>}
      {!loading && !error && students.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"><UsersRound className="mx-auto mb-3 text-indigo-300" size={32}/><p className="font-semibold text-slate-800">No students found</p><p className="mt-1 text-sm text-slate-500">Try changing your search or filters.</p></div>}
      <div className="grid gap-4 md:grid-cols-2">{visibleStudents.map((student) => <article key={student._id} onClick={() => navigate(`/students/${student._id}`, { state: { from: location.pathname } })} className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-100 hover:shadow-md"><div className="flex gap-3"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 font-semibold text-indigo-700">{initials(student.name)}</div><div className="min-w-0 flex-1"><h3 className="font-semibold text-slate-900">{student.name}</h3><p className="mt-0.5 text-xs text-slate-500">{student.course?.name || 'Student'}{student.branch?.name ? ` · ${student.branch.name}` : ''} · Year {student.year}</p>{student.bio && <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{student.bio}</p>}{student.skills?.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{student.skills.slice(0, 5).map((skill) => <span key={skill} className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">{skill}</span>)}</div>}{(student.company || student.role) && <p className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-sm text-slate-600"><BriefcaseBusiness size={15} className="text-indigo-500"/>{[student.company, student.role].filter(Boolean).join(' · ')}</p>}</div><span className="self-start whitespace-nowrap text-xs font-semibold text-indigo-600 hover:text-indigo-800">View profile →</span></div></article>)}</div>
      {!loading && visibleStudents.length < students.length && <div className="mt-6 flex justify-center"><button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="rounded-full border border-indigo-200 bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-indigo-50">Load more students</button></div>}
    </div>
    {editing && profile && (
      <div
        className="fixed inset-0 z-[70] overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setSaveError('')
            setEditing(false)
          }
        }}
      >
        <section className="mx-auto my-6 max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Your account</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">My Profile</h2>
              <p className="mt-1 text-sm text-slate-500">Update the details other students can see.</p>
            </div>
            <button type="button" onClick={() => { setSaveError(''); setEditing(false) }} aria-label="Close" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X /></button>
          </div>
          <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
            {profile.email && <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600 sm:col-span-2">Signed in as <strong className="font-medium text-slate-800">{profile.email}</strong></div>}
            {saveError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 sm:col-span-2">{saveError}</p>}
            <label className="text-xs font-semibold text-slate-600">Name<input name="name" required defaultValue={profile.name || ''} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600">Academic year<input name="year" type="number" min="1" max="10" required defaultValue={profile.year || ''} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600">
              Graduation year
              <input
                name="graduationYear"
                type="number"
                min="2000"
                max="2110"
                defaultValue={profile.graduationYear >= 2000 && profile.graduationYear <= 2110 ? profile.graduationYear : ''}
                className={`${field} mt-1.5`}
              />
              <span className="mt-1 block font-normal text-slate-400">Enter a calendar year, such as 2027.</span>
            </label>
            <label className="text-xs font-semibold text-slate-600">Company<input name="company" defaultValue={profile.company || ''} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Role<input name="role" defaultValue={profile.role || ''} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600 sm:col-span-2">About you<textarea name="bio" rows="3" defaultValue={profile.bio || ''} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Skills <span className="font-normal text-slate-400">(comma separated)</span><input name="skills" defaultValue={(profile.skills || []).join(', ')} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Interests <span className="font-normal text-slate-400">(comma separated)</span><input name="interests" defaultValue={(profile.interests || []).join(', ')} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600 sm:col-span-2">Internships <span className="font-normal text-slate-400">(comma separated)</span><input name="internships" defaultValue={(profile.internships || []).join(', ')} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600">LinkedIn URL<input name="linkedinUrl" defaultValue={profile.linkedinUrl || ''} className={`${field} mt-1.5`} /></label>
            <label className="text-xs font-semibold text-slate-600">GitHub URL<input name="githubUrl" defaultValue={profile.githubUrl || ''} className={`${field} mt-1.5`} /></label>
            <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-100 bg-white/95 py-4 sm:col-span-2">
              <button type="button" onClick={() => { setSaveError(''); setEditing(false) }} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">{saving ? 'Saving…' : 'Save changes'}</button>
            </div>
          </form>
        </section>
      </div>
    )}
  </main>
}
