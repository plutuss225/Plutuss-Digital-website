import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    // Simulate login — redirect to home after success
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 1200)
  }

  return (
    <div className="login-page">
      {/* Left panel */}
      <div className="login-left d-none d-lg-flex">
        <div className="login-left-inner">
          <NavLink to="/" className="d-flex align-items-center gap-2 text-decoration-none mb-5">
            <img
              src="https://plutusdigitalasset.com/assets/img/logo.png"
              alt="Plutus"
              style={{ height: '55px' }}
            />
            <span className="login-brand-name">Plutus Digital Asset</span>
          </NavLink>
          <h2 className="login-left-title">
            Your gateway to digital asset markets
          </h2>
          <p className="login-left-sub">
            Seamless access to premier crypto trading and liquidity venues through a single, unified platform.
          </p>
          <div className="login-left-pills mt-5">
            {['Portfolio Management', 'Risk Management', 'Crypto Algorithms'].map(t => (
              <span key={t} className="login-pill">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-form-box">
          {/* Mobile logo */}
          <NavLink to="/" className="d-flex d-lg-none align-items-center gap-2 text-decoration-none mb-4 justify-content-center">
            <img
              src="https://plutusdigitalasset.com/assets/img/logo.png"
              alt="Plutus"
              style={{ height: '50px' }}
            />
            <span className="login-brand-name-dark">Plutus Digital Asset</span>
          </NavLink>

          <h2 className="login-title">Sign in</h2>
          <p className="login-subtitle">Welcome back — enter your credentials to continue.</p>

          {error && (
            <div className="login-error">
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="login-field">
              <label className="login-label">Email Address</label>
              <div className="login-input-wrap">
                <i className="bi bi-envelope login-input-icon"></i>
                <input
                  type="email"
                  name="email"
                  className="login-input"
                  placeholder="you@company.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="login-label mb-0">Password</label>
                <button type="button" className="login-forgot">Forgot password?</button>
              </div>
              <div className="login-input-wrap">
                <i className="bi bi-lock login-input-icon"></i>
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-eye"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  <i className={`bi ${showPwd ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading
                ? <><span className="login-spinner"></span> Signing in…</>
                : <>Sign In <i className="bi bi-arrow-right ms-2"></i></>
              }
            </button>
          </form>

          <p className="login-footer-note">
            Don't have an account?{' '}
            <NavLink to="/contact" className="login-link">Request a Demo</NavLink>
          </p>
        </div>
      </div>
    </div>
  )
}
