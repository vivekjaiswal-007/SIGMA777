import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const IS = {
  width: '100%', padding: '12px 14px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(224,48,48,0.2)',
  borderRadius: '8px', color: 'white', fontSize: '16px', outline: 'none',
  transition: 'border-color 0.2s'
}

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useStore()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!emailOrPhone.trim()) return toast.error('Enter email or phone number')
    if (!password) return toast.error('Enter your password')
    const res = await login(emailOrPhone.trim(), password)
    if (res.success) {
      toast.success('Welcome back! 🎮')
      navigate('/')
    } else {
      toast.error(res.error)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
      backgroundImage: `
        radial-gradient(ellipse at 20% 20%, rgba(224,48,48,0.06) 0%, transparent 55%),
        radial-gradient(ellipse at 80% 80%, rgba(180,20,20,0.05) 0%, transparent 50%)
      `,
      padding: '16px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo block */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg,#c91818,#ff4040)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', margin: '0 auto 14px',
            boxShadow: '0 0 32px rgba(220,30,30,0.45)',
            color: '#fff', fontWeight: '900', fontFamily: 'Cinzel,serif'
          }}>Σ</div>
          <div className="sigma-logo-text" style={{ fontSize: '26px', letterSpacing: '3px' }}>
            SIGMA<span style={{ WebkitTextFillColor: '#ff6b00' }}>777</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
            Welcome back, player 🎮
          </p>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(224,48,48,0.18)',
          borderRadius: '16px', padding: '28px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(200,20,20,0.06)'
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '600', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Email or Mobile Number
              </label>
              <input type="text" value={emailOrPhone} onChange={e => setEmailOrPhone(e.target.value)} required
                placeholder="your@email.com  or  9876543210"
                style={IS}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'rgba(224,48,48,0.2)'} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <label style={{ color: 'var(--text-secondary)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</label>
                <Link to="/forgot-password" style={{ color: 'var(--gold)', fontSize: '12px', fontWeight: '600' }}>Forgot?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Your password"
                  style={{ ...IS, paddingRight: '44px' }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(224,48,48,0.2)'} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '16px' }}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-gold" disabled={isLoading}
              style={{ width: '100%', padding: '13px', fontSize: '15px', marginTop: '4px' }}>
              {isLoading ? '⏳ Logging in...' : '🔐 Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
            No account? <Link to="/signup" style={{ color: 'var(--gold)', fontWeight: '700' }}>Sign up free →</Link>
          </p>

          <div style={{ marginTop: '14px', padding: '10px', background: 'rgba(224,48,48,0.05)', borderRadius: '8px', border: '1px solid rgba(224,48,48,0.1)', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>Demo: admin@sigma777.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
