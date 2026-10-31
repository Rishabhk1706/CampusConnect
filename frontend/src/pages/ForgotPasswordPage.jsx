import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { forgotPasswordApi, resetPasswordApi } from '../utils/apis'

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .required('College email is required'),
})

const resetSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
})

export default function ForgotPasswordPage() {
  const [step, setStep] = useState('email') // 'email' | 'otp-reset' | 'success'
  const [email, setEmail] = useState('')
  const [devOtp, setDevOtp] = useState(null)
  const [statusMessage, setStatusMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  // Passwords toggle
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // OTP states
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [cooldown, setCooldown] = useState(0)
  const [resending, setResending] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  const navigate = useNavigate()

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Step 1: Send OTP to Email
  const emailFormik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: emailSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null)
      setErrorMessage(null)
      try {
        const normalizedEmail = values.email.trim().toLowerCase()
        const res = await forgotPasswordApi({ email: normalizedEmail })

        setEmail(normalizedEmail)
        if (res?.devOtp) {
          setDevOtp(res.devOtp)
        }
        setCooldown(60)
        setStatusMessage(res?.message || 'Verification code sent to your email.')
        setStep('otp-reset')
      } catch (err) {
        setStatus(err.response?.data?.error || 'Could not send reset code. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  // Step 2: Reset Formik (Password validation)
  const resetFormik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: resetSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      const fullOtp = otpDigits.join('')
      if (fullOtp.length !== 6) {
        setErrorMessage('Please enter the complete 6-digit OTP code.')
        setSubmitting(false)
        return
      }

      setStatus(null)
      setErrorMessage(null)
      setIsResetting(true)

      try {
        const res = await resetPasswordApi({
          email,
          otp: fullOtp,
          newPassword: values.newPassword,
        })

        setStep('success')
        setStatusMessage(res?.message || 'Password reset successfully!')

        setTimeout(() => {
          navigate('/login', {
            state: {
              verifiedEmail: email,
              justVerified: true,
              message: 'Password reset successfully! Please log in with your new password.',
            },
          })
        }, 1800)
      } catch (err) {
        setErrorMessage(err.response?.data?.error || 'Password reset failed. Please check the OTP.')
      } finally {
        setIsResetting(false)
        setSubmitting(false)
      }
    },
  })

  // OTP inputs handling
  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '')
    if (!cleanValue) {
      const nextDigits = [...otpDigits]
      nextDigits[index] = ''
      setOtpDigits(nextDigits)
      return
    }

    // Pasted code
    if (cleanValue.length > 1) {
      const pasted = cleanValue.slice(0, 6).split('')
      const nextDigits = [...otpDigits]
      pasted.forEach((char, idx) => {
        if (idx < 6) nextDigits[idx] = char
      })
      setOtpDigits(nextDigits)
      const targetIdx = Math.min(pasted.length, 5)
      otpInputRefs[targetIdx]?.current?.focus()
      return
    }

    const nextDigits = [...otpDigits]
    nextDigits[index] = cleanValue.slice(-1)
    setOtpDigits(nextDigits)

    if (index < 5 && cleanValue) {
      otpInputRefs[index + 1]?.current?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus()
    }
  }

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return
    setResending(true)
    setErrorMessage(null)
    setStatusMessage(null)

    try {
      const res = await forgotPasswordApi({ email })
      if (res?.devOtp) {
        setDevOtp(res.devOtp)
      }
      setCooldown(60)
      setStatusMessage('A new verification code has been sent to your email.')
    } catch (err) {
      setErrorMessage(err.response?.data?.error || 'Failed to resend code. Please try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-sky-50/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner mb-3">
            <KeyRound className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">
            {step === 'email'
              ? 'Forgot Password?'
              : step === 'otp-reset'
              ? 'Reset Password'
              : 'Password Updated!'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {step === 'email'
              ? 'Enter your college email address to receive an OTP code.'
              : step === 'otp-reset'
              ? `Enter the 6-digit code sent to ${email} and choose a new password.`
              : 'Your password has been changed successfully. Redirecting to login...'}
          </p>
        </div>

        {/* STEP 1: REQUEST OTP */}
        {step === 'email' && (
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md animate-fadeIn">
            {emailFormik.status && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 animate-fadeIn">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                <span>{emailFormik.status}</span>
              </div>
            )}

            <form onSubmit={emailFormik.handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Registered College Email
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    {...emailFormik.getFieldProps('email')}
                    placeholder="student@college.ac.in"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                      emailFormik.touched.email && emailFormik.errors.email
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  />
                </div>
                {emailFormik.touched.email && emailFormik.errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 font-medium">{emailFormik.errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={emailFormik.isSubmitting}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {emailFormik.isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Log in</span>
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: ENTER OTP & NEW PASSWORD */}
        {step === 'otp-reset' && (
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md animate-fadeIn">
            {/* Dev mode test badge */}
            {devOtp && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>
                    Test Reset OTP: <strong className="font-mono text-sm tracking-widest text-amber-900">{devOtp}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const digits = String(devOtp).split('')
                    setOtpDigits(digits)
                  }}
                  className="rounded bg-amber-200/80 px-2 py-0.5 text-xs font-semibold text-amber-900 hover:bg-amber-300 transition"
                >
                  Auto-fill
                </button>
              </div>
            )}

            {statusMessage && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-700 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={resetFormik.handleSubmit} className="space-y-5">
              {/* OTP Digits */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 text-center mb-2">
                  6-Digit Verification Code
                </label>
                <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="h-12 w-11 text-center text-lg font-bold text-slate-900 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                    />
                  ))}
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  New Password
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    {...resetFormik.getFieldProps('newPassword')}
                    placeholder="Min 8 characters"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                      resetFormik.touched.newPassword && resetFormik.errors.newPassword
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
                {resetFormik.touched.newPassword && resetFormik.errors.newPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{resetFormik.errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...resetFormik.getFieldProps('confirmPassword')}
                    placeholder="Re-enter new password"
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                      resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword
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
                {resetFormik.touched.confirmPassword && resetFormik.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{resetFormik.errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isResetting || otpDigits.join('').length !== 6}
                className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {isResetting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Reset Password & Save</span>
                    <ShieldCheck className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change email</span>
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || resending}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition font-semibold disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resending ? 'animate-spin' : ''}`} />
                  <span>
                    {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Code'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'success' && (
          <div className="rounded-2xl border border-emerald-200 bg-white/95 p-8 shadow-xl text-center backdrop-blur-md animate-fadeIn">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Password Reset Complete!</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your password has been updated. Redirecting you to the login page...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
