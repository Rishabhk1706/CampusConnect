import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    const result = register(form)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/', { state: { scrollTo: 'seniors' } })
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12">
      <h1 className="font-display text-3xl font-bold text-navy-900">Join PeerConnect</h1>
      <p className="mt-2 text-sm text-slate-600">Create your student profile and start learning from experienced seniors.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <Field label="Full name" name="name" value={form.name} onChange={onChange} autoComplete="name" />
        <Field label="College email" name="email" type="email" value={form.email} onChange={onChange} autoComplete="email" />
        <Field label="Password" name="password" type="password" value={form.password} onChange={onChange} autoComplete="new-password" />
        <Field
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={onChange}
          autoComplete="new-password"
        />
        <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700">
          Get Started
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  )
}

function Field({ label, name, value, onChange, type = 'text', autoComplete }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
      />
    </label>
  )
}
