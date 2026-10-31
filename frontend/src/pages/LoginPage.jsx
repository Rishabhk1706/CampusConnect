import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/ui/Logo'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  rememberMe: Yup.boolean(),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null)
      try {
        const result = login(values.email, values.password)
        if (!result.ok) {
          setStatus(result.message || 'Login failed. Please check your credentials.')
          setSubmitting(false)
          return
        }
        navigate('/')
      } catch {
        setStatus('An unexpected error occurred. Please try again.')
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-sky-50/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to connect with seniors, peers, and campus opportunities
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
          {formik.status && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <span>{formik.status}</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                College Email
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  {...formik.getFieldProps('email')}
                  placeholder="student@college.edu"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                    formik.touched.email && formik.errors.email
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{formik.errors.email}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...formik.getFieldProps('password')}
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                    formik.touched.password && formik.errors.password
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1.5 text-xs text-red-600 font-medium">{formik.errors.password}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                name="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-xs font-medium text-slate-600">
                Remember my session on this device
              </label>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {formik.isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Connect with 500+ verified campus seniors</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
