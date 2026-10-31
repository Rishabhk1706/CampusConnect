import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/ui/Logo'
import { getColleges, getCourses, getBranches, verifyOtpApi, resendOtpApi } from '../utils/apis'

const COLLEGE_EMAIL_REGEX = /^[^\s@]+@[a-zA-Z0-9.-]+\.(ac\.in|edu|edu\.in)$/i

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  email: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .matches(
      COLLEGE_EMAIL_REGEX,
      'Only official college / institution email (.ac.in, .edu, .edu.in) is allowed'
    )
    .required('College email is required'),
  college: Yup.string()
    .trim()
    .required('College / University is required'),
  course: Yup.string()
    .required('Course is required'),
  branch: Yup.string()
    .required('Department / Branch is required'),
  year: Yup.string()
    .required('Academic year is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
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

  // Step state: 'form' | 'otp' | 'success'
  const [step, setStep] = useState('form')
  const [pendingEmail, setPendingEmail] = useState('')
  const [devOtp, setDevOtp] = useState(null)

  // OTP inputs & states
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState(null)
  const [otpSuccess, setOtpSuccess] = useState(null)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resendingOtp, setResendingOtp] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  // Database-driven states
  const [colleges, setColleges] = useState([])
  const [courses, setCourses] = useState([])
  const [branches, setBranches] = useState([])
  const [loadingColleges, setLoadingColleges] = useState(true)
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [loadingBranches, setLoadingBranches] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Handle passed email from login redirect
  useEffect(() => {
    if (location.state?.verifyEmail) {
      setPendingEmail(location.state.verifyEmail)
      setStep('otp')
      setCooldown(30)
    }
  }, [location.state])

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // 1. Fetch Colleges & Courses from database on mount
  useEffect(() => {
    getColleges()
      .then((data) => {
        if (Array.isArray(data)) setColleges(data)
      })
      .catch((err) => console.error('Error fetching colleges:', err))
      .finally(() => setLoadingColleges(false))

    getCourses()
      .then((data) => {
        if (Array.isArray(data)) setCourses(data)
      })
      .catch((err) => console.error('Error fetching courses:', err))
      .finally(() => setLoadingCourses(false))
  }, [])

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      college: '',
      course: '',
      branch: '',
      year: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    validationSchema: registerSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(null)

      // Strict domain check: verify email domain matches selected college domain
      const selectedCollege = colleges.find((c) => String(c._id) === String(values.college))
      const normalizedEmail = values.email.trim().toLowerCase()
      const emailDomain = normalizedEmail.split('@')[1]

      if (selectedCollege && selectedCollege.domain) {
        if (emailDomain !== selectedCollege.domain.toLowerCase()) {
          setStatus(
            `Email domain (@${emailDomain}) does not match ${selectedCollege.name} (@${selectedCollege.domain}). Please use your official college email ID.`
          )
          setSubmitting(false)
          return
        }
      }

      const academicYear = Number(String(values.year).replace(/\D/g, ''))

      const payload = {
        name: values.name.trim(),
        email: normalizedEmail,
        college: values.college,
        course: values.course,
        branch: values.branch,
        year: academicYear,
        password: values.password,
      }

      try {
        const result = await register(payload)

        if (!result.ok) {
          // If already pending verification, transition to OTP step
          if (result.message && result.message.toLowerCase().includes('pending')) {
            setPendingEmail(normalizedEmail)
            setStep('otp')
            setOtpError('Registration is pending. Please enter the OTP sent to your email.')
            setCooldown(60)
            setSubmitting(false)
            return
          }

          setStatus(result.message || 'Registration failed. Please check your information.')
          setSubmitting(false)
          return
        }

        // Registration successful -> proceed to OTP verification
        setPendingEmail(normalizedEmail)
        if (result.data?.devOtp) {
          setDevOtp(result.data.devOtp)
        }
        setStep('otp')
        setCooldown(60)
        setOtpSuccess(result.data?.message || 'Verification code sent to your email!')
      } catch (err) {
        setStatus(err.response?.data?.error || 'An error occurred during registration. Please try again.')
      } finally {
        setSubmitting(false)
      }
    },
  })

  // 2. Fetch Branches from database whenever course changes
  useEffect(() => {
    const selectedCourseId = formik.values.course
    if (!selectedCourseId) {
      setBranches([])
      return
    }

    setLoadingBranches(true)
    getBranches(selectedCourseId)
      .then((data) => {
        if (Array.isArray(data)) {
          const matched = data.filter((b) => {
            const cId = b.courseId?._id || b.courseId
            return String(cId) === String(selectedCourseId)
          })
          setBranches(matched.length > 0 ? matched : data)
        }
      })
      .catch((err) => {
        console.error('Error fetching branches:', err)
        setBranches([])
      })
      .finally(() => {
        setLoadingBranches(false)
      })
  }, [formik.values.course])

  // Handle course change: reset branch & year when course changes
  const handleCourseChange = (e) => {
    const newCourseId = e.target.value
    formik.setFieldValue('course', newCourseId)
    formik.setFieldValue('branch', '')
    formik.setFieldValue('year', '')
  }

  // Calculate dynamic academic years based on course durationYears
  const selectedCourseObj = courses.find((c) => String(c._id) === String(formik.values.course))
  const maxYears = selectedCourseObj?.durationYears || 4
  const dynamicYearOptions = Array.from({ length: maxYears }, (_, idx) => {
    const yr = idx + 1
    const suffix = yr === 1 ? '1st' : yr === 2 ? '2nd' : yr === 3 ? '3rd' : `${yr}th`
    return `${suffix} Year`
  })

  // Selected college object for dynamic domain display
  const selectedCollegeObj = colleges.find((c) => String(c._id) === String(formik.values.college))

  // Handle OTP digit typing
  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '')
    if (!cleanValue) {
      const nextDigits = [...otpDigits]
      nextDigits[index] = ''
      setOtpDigits(nextDigits)
      return
    }

    // If user pasted multi digits
    if (cleanValue.length > 1) {
      const pasted = cleanValue.slice(0, 6).split('')
      const nextDigits = [...otpDigits]
      pasted.forEach((char, idx) => {
        if (idx < 6) nextDigits[idx] = char
      })
      setOtpDigits(nextDigits)
      const targetIndex = Math.min(pasted.length, 5)
      otpInputRefs[targetIndex]?.current?.focus()
      return
    }

    const nextDigits = [...otpDigits]
    nextDigits[index] = cleanValue.slice(-1)
    setOtpDigits(nextDigits)

    // Auto-focus next input
    if (index < 5 && cleanValue) {
      otpInputRefs[index + 1]?.current?.focus()
    }
  }

  // Handle Backspace navigation in OTP
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus()
    }
  }

  // Handle OTP Verification Submit
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault()
    const fullOtp = otpDigits.join('')
    if (fullOtp.length !== 6) {
      setOtpError('Please enter the complete 6-digit verification code.')
      return
    }

    setVerifyingOtp(true)
    setOtpError(null)
    setOtpSuccess(null)

    try {
      const res = await verifyOtpApi({ email: pendingEmail, otp: fullOtp })
      setStep('success')
      setOtpSuccess(res?.message || 'Email verified successfully! You can now log in.')

      setTimeout(() => {
        navigate('/login', {
          state: {
            verifiedEmail: pendingEmail,
            justVerified: true,
            message: 'Email verified successfully! You can now log in.',
          },
        })
      }, 1500)
    } catch (err) {
      setOtpError(err.response?.data?.error || 'Verification failed. Please check the OTP.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || resendingOtp) return
    setResendingOtp(true)
    setOtpError(null)
    setOtpSuccess(null)

    try {
      const res = await resendOtpApi({ email: pendingEmail })
      if (res?.devOtp) {
        setDevOtp(res.devOtp)
      }
      setCooldown(60)
      setOtpSuccess('A new verification code has been sent to your college email.')
    } catch (err) {
      setOtpError(err.response?.data?.error || 'Failed to resend code. Please try again.')
    } finally {
      setResendingOtp(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-indigo-50/30 to-sky-50/40 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-navy-900">
            {step === 'otp' ? 'Verify Your College Email' : step === 'success' ? 'Verification Complete!' : 'Create Your Student Account'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {step === 'otp'
              ? `We sent a 6-digit OTP code to ${pendingEmail}`
              : step === 'success'
              ? 'Your account is now verified and active. Redirecting to login...'
              : 'Join your campus peer network to unlock mock interviews and senior mentorship'}
          </p>
        </div>

        {/* STEP 2: OTP VERIFICATION UI */}
        {step === 'otp' && (
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-6 sm:p-8 shadow-xl shadow-slate-200/50 backdrop-blur-md animate-fadeIn">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner mb-3">
                <KeyRound className="h-8 w-8" />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Enter Verification Code</h2>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                Enter the 6-digit OTP code sent to your official college email{' '}
                <span className="font-semibold text-slate-700">{pendingEmail}</span>.
              </p>
            </div>

            {/* Dev mode OTP banner for easy testing */}
            {devOtp && (
              <div className="mb-5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                  <span>
                    Test OTP Code: <strong className="font-mono text-sm tracking-widest text-amber-900">{devOtp}</strong>
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

            {otpError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 p-3 text-xs text-red-700 animate-fadeIn">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>{otpError}</span>
              </div>
            )}

            {otpSuccess && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-xs text-emerald-700 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                <span>{otpSuccess}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* 6 Digit Input Boxes */}
              <div className="flex justify-center items-center gap-2 sm:gap-3">
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
                    className="h-12 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold text-slate-900 rounded-xl border border-slate-200 bg-slate-50/50 shadow-sm focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || otpDigits.join('').length !== 6}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {verifyingOtp ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Verify & Activate Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition font-medium"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Change details / email</span>
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || resendingOtp}
                  onClick={handleResendOtp}
                  className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition font-semibold disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${resendingOtp ? 'animate-spin' : ''}`} />
                  <span>
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend OTP Code'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS STATE */}
        {step === 'success' && (
          <div className="rounded-2xl border border-emerald-200 bg-white/95 p-8 shadow-xl text-center backdrop-blur-md animate-fadeIn">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4 animate-bounce">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Account Verified!</h2>
            <p className="mt-2 text-sm text-slate-600">
              Your college email has been verified. Redirecting you to login...
            </p>
            <div className="mt-6 flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            </div>
          </div>
        )}

        {/* STEP 1: REGISTRATION FORM */}
        {step === 'form' && (
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
                      placeholder="Enter your full name"
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
                    Official College Email
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <input
                      id="email"
                      type="email"
                      {...formik.getFieldProps('email')}
                      placeholder={
                        selectedCollegeObj?.domain
                          ? `student@${selectedCollegeObj.domain}`
                          : 'student@college.ac.in'
                      }
                      className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none transition ${
                        formik.touched.email && formik.errors.email
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                      }`}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email ? (
                    <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.email}</p>
                  ) : selectedCollegeObj?.domain ? (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-indigo-700 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Must end with @{selectedCollegeObj.domain}</span>
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">
                      {/* Only official .ac.in, .edu, or .edu.in email accepted */}
                    </p>
                  )}
                </div>
              </div>

              {/* College Dropdown from DB */}
              <div>
                <label htmlFor="college" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  College / University
                </label>
                <div className="relative mt-1.5">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <select
                    id="college"
                    name="college"
                    value={formik.values.college}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition ${
                      formik.touched.college && formik.errors.college
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  >
                    <option value="">
                      {loadingColleges ? 'Loading colleges from database...' : 'Select your college / university'}
                    </option>
                    {colleges.map((col) => (
                      <option key={col._id} value={col._id}>
                        {col.name} {col.location ? `(${col.location})` : ''} — @{col.domain}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.college && formik.errors.college && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.college}</p>
                )}
              </div>

              {/* Course & Branch Dropdowns from DB */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="course" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Course
                  </label>
                  <div className="relative mt-1.5">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <select
                      id="course"
                      name="course"
                      value={formik.values.course}
                      onChange={handleCourseChange}
                      onBlur={formik.handleBlur}
                      className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition ${
                        formik.touched.course && formik.errors.course
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                      }`}
                    >
                      <option value="">
                        {loadingCourses ? 'Loading courses...' : 'Select Course'}
                      </option>
                      {courses.map((crs) => (
                        <option key={crs._id} value={crs._id}>
                          {crs.name} ({crs.durationYears} Years)
                        </option>
                      ))}
                    </select>
                  </div>
                  {formik.touched.course && formik.errors.course && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.course}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="branch" className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Department / Branch
                  </label>
                  <div className="relative mt-1.5">
                    <select
                      id="branch"
                      name="branch"
                      value={formik.values.branch}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled={!formik.values.course || loadingBranches}
                      className={`w-full rounded-xl border py-2.5 px-4 text-sm text-slate-900 outline-none transition disabled:opacity-60 disabled:cursor-not-allowed ${
                        formik.touched.branch && formik.errors.branch
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                      }`}
                    >
                      <option value="">
                        {!formik.values.course
                          ? '— Select course first —'
                          : loadingBranches
                          ? 'Loading branches...'
                          : branches.length === 0
                          ? 'No branches found for this course'
                          : 'Select your branch'}
                      </option>
                      {branches.map((br) => (
                        <option key={br._id} value={br._id}>
                          {br.name} ({br.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  {formik.touched.branch && formik.errors.branch && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.branch}</p>
                  )}
                </div>
              </div>

              {/* Academic Year Dropdown (Dynamic based on selected course) */}
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
                    name="year"
                    value={formik.values.year}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition ${
                      formik.touched.year && formik.errors.year
                        ? 'border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                        : 'border-slate-200 bg-slate-50/50 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20'
                    }`}
                  >
                    <option value="">Select your academic year</option>
                    {dynamicYearOptions.map((opt, idx) => (
                      <option key={opt} value={idx + 1}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                {formik.touched.year && formik.errors.year && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{formik.errors.year}</p>
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
                      placeholder="Min 8 characters"
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
                    <span>Continue to OTP Verification</span>
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
        )}

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
