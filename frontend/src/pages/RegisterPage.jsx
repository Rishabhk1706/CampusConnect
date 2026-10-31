import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { AlertCircle, ArrowRight, Building2, CheckCircle2, Eye, EyeOff, GraduationCap,Lock,Mail,User,} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/ui/Logo'

const YEAR_OPTIONS = [
  '1st Year',
  '2nd Year', 
  '3rd Year' , 
  '4th Year' , 
]

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('College email is required'),
  college: Yup.string()
    .trim()
    .min(2, 'College name must be at least 2 characters')
    .required('College name is required'),
  branch: Yup.string()
    .trim()
    .min(2, 'Branch must be at least 2 characters')
    .required('Department / Branch is required'),
  year: Yup.string()
    .required('Academic year is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions'),
})

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      college: '',
      branch: '',
      year: YEAR_OPTIONS[0],
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null)
      try {
        const result = register(values)
        if (!result.ok) {
          setStatus(result.message || 'Registration failed. Please check your information.')
          setSubmitting(false)
          return
        }
        navigate('/')
      } catch {
        setStatus('An error occurred during registration. Please try again.')
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-sky-50/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="mb-8 text-center">
          <div className="inline-flex justify-center mb-4">
            <Logo />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">
            Create Your Student Account
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Join your campus peer network to unlock mock interviews and senior mentorship
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md">
          {formik.status && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 animate-fadeIn">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
              <span>{formik.status}</span>
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Full Name
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    id="name"
                    type="text"
                    {...formik.getFieldProps('name')}
                    placeholder="Aditi Rao"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                      formik.touched.name && formik.errors.name
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.name}</p>
                )}
              </div>

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
                  <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="college" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  College / University
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <input
                    id="college"
                    type="text"
                    {...formik.getFieldProps('college')}
                    placeholder="IIT, NIT, BITS, etc."
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                      formik.touched.college && formik.errors.college
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {formik.touched.college && formik.errors.college && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.college}</p>
                )}
              </div>

              <div>
                <label htmlFor="year" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Academic Year
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <select
                    id="year"
                    {...formik.getFieldProps('year')}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {YEAR_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="branch" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Department / Branch
              </label>
              <div className="relative mt-1.5">
                <input
                  id="branch"
                  type="text"
                  {...formik.getFieldProps('branch')}
                  placeholder="Computer Science & Engineering, IT, Mechanical, etc."
                  className={`w-full rounded-xl border py-2.5 px-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                    formik.touched.branch && formik.errors.branch
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                      : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                  }`}
                />
              </div>
              {formik.touched.branch && formik.errors.branch && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.branch}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    {...formik.getFieldProps('password')}
                    placeholder="Min 6 characters"
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
                  <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...formik.getFieldProps('confirmPassword')}
                    placeholder="Re-enter password"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                      formik.touched.confirmPassword && formik.errors.confirmPassword
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-1">
              <div className="flex items-start gap-2.5">
                <input
                  id="agreeTerms"
                  type="checkbox"
                  name="agreeTerms"
                  checked={formik.values.agreeTerms}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="agreeTerms" className="text-xs leading-relaxed text-slate-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-indigo-600 hover:underline">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-indigo-600 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </label>
              </div>
              {formik.touched.agreeTerms && formik.errors.agreeTerms && (
                <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.agreeTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 mt-2"
            >
              {formik.isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>Zero spam, verified student-only campus network</span>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
