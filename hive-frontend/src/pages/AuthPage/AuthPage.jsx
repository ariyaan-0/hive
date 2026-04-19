import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function AuthPage() {
  const { login, register } = useAuth()
  const [activeTab, setActiveTab] = useState('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateLogin = () => {
    const newErrors = {}
    if (!loginForm.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(loginForm.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!loginForm.password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegister = () => {
    const newErrors = {}
    if (!registerForm.name.trim()) newErrors.name = 'Name is required'
    if (!registerForm.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (registerForm.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9]+$/.test(registerForm.username)) {
      newErrors.username = 'Letters and numbers only'
    }
    if (!registerForm.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!EMAIL_REGEX.test(registerForm.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!registerForm.password) {
      newErrors.password = 'Password is required'
    } else if (registerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (!registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (registerForm.password !== registerForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    if (!validateLogin()) return
    setIsSubmitting(true)
    try {
      await login(loginForm.email, loginForm.password);
    } catch (err) {
      setGeneralError(err.message || 'Login failed.');
      setIsSubmitting(false);
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    if (!validateRegister()) return
    setIsSubmitting(true)

    try {
      const formData = new FormData();
      formData.append('name', registerForm.name);
      formData.append('username', registerForm.username);
      formData.append('email', registerForm.email);
      formData.append('password', registerForm.password);
      
      await register(formData);
    } catch (err) {
      setGeneralError(err.message || 'Registration failed.');
      setIsSubmitting(false);
    }
  }

  const switchTab = (tab) => {
    setActiveTab(tab)
    setErrors({})
    setGeneralError('')
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-page-bg" id="auth-page">

      {/* ---- LEFT: Branding ---- */}
      <div
        className="flex flex-1 items-center justify-center md:justify-end relative overflow-hidden px-8 py-10 md:pr-15 md:pl-12 md:py-12"
        id="auth-branding"
      >
        <div className="relative z-10 text-center md:text-left" id="branding-content">
          {/* Honeycomb icon */}
          <div className="mb-6 animate-fade-in-up-slow flex justify-center md:justify-start" aria-hidden="true">
            <svg
              width="52" height="56" viewBox="0 0 52 56"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] text-primary-500"
            >
              <path d="M26 2L48 14V38L26 50L4 38V14L26 2Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
              <path d="M26 10L40 18V34L26 42L12 34V18L26 10Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.08"/>
              <path d="M26 18L33 22V30L26 34L19 30V22L26 18Z" fill="currentColor" opacity="0.25"/>
              <circle cx="26" cy="26" r="4" fill="currentColor"/>
            </svg>
          </div>

          <h1
            className="font-heading font-bold text-[40px] md:text-[48px] leading-[1.1] text-primary-500 tracking-tight mb-4 animate-fade-in-up-d1"
            id="brand-name"
          >
            HiveRoom
          </h1>

          <p className="font-body text-[22px] leading-relaxed text-text-body animate-fade-in-up-d2" id="brand-tagline">
            Join your cozy community.
            <br />
            <span className="text-text-muted text-[17px]">A hyper local social platform.</span>
          </p>
        </div>

        {/* Decorative hexagons */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="hex absolute w-20 h-20 bg-primary-50 opacity-20 top-[8%] left-[5%] animate-float-1" />
          <div className="hex absolute w-25 h-25 bg-primary-50 opacity-18 top-[65%] left-[10%] animate-float-2" />
          <div className="hex absolute w-15 h-15 bg-primary-50 opacity-25 bottom-[10%] right-[35%] animate-float-3" />
          <div className="hex absolute w-[90px] h-[90px] bg-primary-50 opacity-15 top-[20%] right-[15%] animate-float-4" />
          <div className="hex absolute w-[70px] h-[70px] bg-primary-50 opacity-20 bottom-[25%] left-[30%] animate-float-5" />
        </div>
      </div>

      {/* ---- RIGHT: Auth Form ---- */}
      <div
        className="flex flex-1 flex-col items-center md:items-start justify-center px-4 py-8 md:pl-15 md:pr-12 md:py-12"
        id="auth-form-wrapper"
      >
        <div
          className="w-full max-w-[420px] bg-card-bg rounded-2xl shadow-card p-8 animate-fade-in"
          id="auth-card"
        >
          {/* Tab Switcher */}
          <div className="flex bg-page-bg rounded-full p-1 gap-1 mb-7" id="auth-tabs" role="tablist">
            <button
              id="tab-login"
              className={`flex-1 py-2.5 px-4 rounded-full font-body text-[13px] font-medium uppercase tracking-[0.05em] cursor-pointer transition-all duration-200
                ${activeTab === 'login'
                  ? 'bg-primary-500 text-primary-text shadow-[var(--shadow-tab-active)]'
                  : 'text-text-muted hover:text-text-body hover:bg-primary-500/5'
                }`}
              onClick={() => switchTab('login')}
              role="tab"
              aria-selected={activeTab === 'login'}
              aria-controls="panel-login"
            >
              Sign In
            </button>
            <button
              id="tab-register"
              className={`flex-1 py-2.5 px-4 rounded-full font-body text-[13px] font-medium uppercase tracking-[0.05em] cursor-pointer transition-all duration-200
                ${activeTab === 'register'
                  ? 'bg-primary-500 text-primary-text shadow-[var(--shadow-tab-active)]'
                  : 'text-text-muted hover:text-text-body hover:bg-primary-500/5'
                }`}
              onClick={() => switchTab('register')}
              role="tab"
              aria-selected={activeTab === 'register'}
              aria-controls="panel-register"
            >
              Register
            </button>
          </div>

          {/* General Action Banner Error */}
          {generalError && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-fade-in-up">
              {generalError}
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form
              id="panel-login"
              className="flex flex-col gap-4.5 animate-fade-in-up"
              role="tabpanel"
              aria-labelledby="tab-login"
              onSubmit={handleLoginSubmit}
              noValidate
            >
              <FormField
                id="login-email"
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={loginForm.email}
                onChange={handleLoginChange}
                error={errors.email}
                autoComplete="email"
              />
              <FormField
                id="login-password"
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={handleLoginChange}
                error={errors.password}
                autoComplete="current-password"
              />
              <SubmitButton loading={isSubmitting} label="Sign In" loadingLabel="Signing in…" />
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form
              id="panel-register"
              className="flex flex-col gap-4.5 animate-fade-in-up"
              role="tabpanel"
              aria-labelledby="tab-register"
              onSubmit={handleRegisterSubmit}
              noValidate
            >
              <FormField
                id="register-name"
                label="Name"
                type="text"
                name="name"
                placeholder="Your name"
                value={registerForm.name}
                onChange={handleRegisterChange}
                error={errors.name}
                autoComplete="name"
              />
              <FormField
                id="register-username"
                label="Username (Letters & numbers only)"
                type="text"
                name="username"
                placeholder="e.g. alicewonder"
                value={registerForm.username}
                onChange={handleRegisterChange}
                error={errors.username}
                autoComplete="username"
              />
              <FormField
                id="register-email"
                label="Email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={registerForm.email}
                onChange={handleRegisterChange}
                error={errors.email}
                autoComplete="email"
              />
              <FormField
                id="register-password"
                label="Password"
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={registerForm.password}
                onChange={handleRegisterChange}
                error={errors.password}
                autoComplete="new-password"
              />
              <FormField
                id="register-confirm-password"
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={registerForm.confirmPassword}
                onChange={handleRegisterChange}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
              <SubmitButton loading={isSubmitting} label="Create Account" loadingLabel="Creating account…" />
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-[11px] text-text-muted text-center font-light w-full max-w-[420px]" id="auth-footer">
          🔒 Your data is stored privately in your account only — never sold or shared.
        </p>
      </div>
    </div>
  )
}

/* ---------- Reusable sub-components ---------- */

function FormField({ id, label, type, name, placeholder, value, onChange, error, autoComplete }) {
  return (
    <div className="flex flex-col gap-1.5" id={`${id}-group`}>
      <label
        htmlFor={id}
        className="text-[11px] font-medium uppercase tracking-[0.05em] text-text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        name={name}
        className={`w-full py-3 px-3.5 text-[15px] text-text-body bg-card-bg border rounded-lg transition-all duration-200
          placeholder:text-text-placeholder
          focus:border-primary-500 focus:shadow-input-focus
          ${error ? 'border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(192,57,43,0.12)]' : 'border-divider'}
        `}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      {error && (
        <span className="text-[11px] text-danger" id={`${id}-error`}>
          {error}
        </span>
      )}
    </div>
  )
}

function SubmitButton({ loading, label, loadingLabel }) {
  return (
    <button
      type="submit"
      className="w-full py-3.5 px-6 mt-1.5 text-[15px] font-medium text-primary-text
        bg-gradient-to-br from-primary-500 to-primary-700 border-none rounded-full cursor-pointer
        shadow-btn transition-all duration-200
        hover:from-primary-700 hover:to-primary-900 hover:shadow-btn-hover hover:-translate-y-0.5
        active:translate-y-0 active:shadow-[0_1px_6px_rgba(0,0,0,0.25)]
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      disabled={loading}
    >
      {loading ? loadingLabel : label}
    </button>
  )
}

export default AuthPage
