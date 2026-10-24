import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    const result = login(email, password)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/', { state: { scrollTo: 'community' } })
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-navy-900">Welcome back</h1>
      <p className="mt-2 text-sm text-slate-600">Sign in to connect with seniors and join community discussions.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
          />
        </label>
        <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        New to PeerConnect?{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
