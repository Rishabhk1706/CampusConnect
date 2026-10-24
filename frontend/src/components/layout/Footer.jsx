import { AtSign, Code2, Globe, Link2, Share2 } from 'lucide-react'
import Logo from '../ui/Logo'
import { scrollToSection } from '../../utils/navigation'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const FOOTER_GROUPS = [
  {
    title: 'Platform',
    links: [
      { label: 'Explore Seniors', section: 'seniors' },
      { label: 'Find a Mentor', section: 'mentor' },
      { label: 'Interview Experiences', section: 'interviews' },
      { label: 'Student Community', section: 'community' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'DSA Preparation', section: 'resources' },
      { label: 'Web Development', section: 'resources' },
      { label: 'Core CS Subjects', section: 'resources' },
      { label: 'Resume Building', section: 'resources' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', section: 'about' },
      { label: 'Our Mission', section: 'about' },
      { label: 'Contact', section: 'cta' },
      { label: 'Feedback', section: 'cta' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms and Conditions', to: '/terms' },
    ],
  },
]

const SOCIAL = [
  { icon: Link2, label: 'LinkedIn' },
  { icon: Share2, label: 'Twitter' },
  { icon: Globe, label: 'Instagram' },
  { icon: AtSign, label: 'Facebook' },
  { icon: Code2, label: 'GitHub' },
]

function FooterLink({ link, onSection }) {
  if (link.to) {
    return (
      <Link to={link.to} className="text-sm text-slate-400 transition hover:text-white">
        {link.label}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={() => onSection(link.section)}
      className="text-left text-sm text-slate-400 transition hover:text-white"
    >
      {link.label}
    </button>
  )
}

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const goSection = (section) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } })
    } else {
      scrollToSection(section)
    }
  }

  return (
    <footer className="bg-navy-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Logo className="[&_span]:text-white [&_span_span]:text-indigo-light" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              PeerConnect is a student-driven mentorship and knowledge-sharing platform designed to connect juniors and
              seniors, make career guidance more accessible, and encourage collaborative learning.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIAL.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  aria-label={`PeerConnect on ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:border-indigo-500 hover:text-white"
                  onClick={(e) => e.preventDefault()}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">{group.title}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} onSection={goSection} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} PeerConnect. Demo content for academic demonstration. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
