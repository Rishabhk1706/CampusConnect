import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react'
import Logo from '../ui/Logo'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'
import { scrollToSection } from '../../utils/navigation'

const NAV_LINKS = [
  { label: 'Home', section: 'home' },
  { label: 'Explore Seniors', section: 'seniors' },
  { label: 'Interview Experiences', section: 'interviews' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setOpen(false)
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const goToSection = (section) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: section } })
    } else {
      scrollToSection(section)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <button
              key={link.section}
              type="button"
              onClick={() => goToSection(link.section)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
            >
              {link.label}
            </button>
          ))}
          <Link
            to="/about"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
          >
            About Us
          </Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-indigo-200"
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <Avatar name={user.name} size="sm" />
                <span className="max-w-[120px] truncate text-sm font-medium text-slate-700">{user.name}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white py-2 shadow-xl"
                >
                  <div className="border-b border-slate-100 px-4 py-2">
                    <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                    <p className="truncate text-xs text-slate-500">{user.email}</p>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                    onClick={() => {
                      setMenuOpen(false)
                      goToSection('community')
                    }}
                  >
                    <User className="h-4 w-4" /> My Profile
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:text-indigo-600"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-slate-700 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <button
                key={link.section}
                type="button"
                onClick={() => goToSection(link.section)}
                className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/about"
              className="rounded-lg px-3 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              About Us
            </Link>
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
            {isAuthenticated ? (
              <>
                <p className="px-3 text-sm font-medium text-slate-800">{user.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    logout()
                    setOpen(false)
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
