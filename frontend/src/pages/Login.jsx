import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { login, isLoading } = useStore()
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!emailOrPhone.trim()) return toast.error('Email ya mobile number daalo')
    if (!password) return toast.error('Password daalo')
    const res = await login(emailOrPhone.trim(), password)
    if (res.success) { toast.success('Welcome back! 🎮'); navigate('/') }
    else toast.error(res.error)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-primary)', backgroundImage:'radial-gradient(ellipse at 20% 20%, rgba(224,48,48,0.07) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(180,20,20,0.05) 0%, transparent 50%)', padding:'16px' }}>
      <div style={{ width:'100%', maxWidth:'380px' }}>
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <div style={{ width:'60px', height:'60px', background:'linear-gradient(135deg,#c91818,#ff4040)', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'28px', margin:'0 auto 12px', boxShadow:'0 0 28px rgba(220,30,30,0.4)', color:'#fff', fontWeight:'900', fontFamily:'Cinzel,serif' }}>Σ</div>
          <div className="sigma-logo-text" style={{ fontSize:'24px' }}>SIGMA<span style={{ WebkitTextFillColor:'#ff6b00' }}>777</span></div>
          <p style={{ color:'var(--text-secondary)', fontSize:'13px', marginTop:'5px' }}>Welcome back, player 🎮</p>
        </div>
        <div style={{ background:'var(--bg-card)', border:'1px solid rgba(224,48,48,0.18)', borderRadius:'16px', padding:'26px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={{ display:'block', color:'var(--text-secondary)', fontSize:'11px', fontWeight:'600', marginBottom:'5px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Email or Mobile</label>
              <input className="inp" type="text" value={emailOrPhone} onChange={e=>setEmailOrPhone(e.target.value)} required placeholder="email@example.com or 9876543210" />
            </div>
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
                <label style={{ color:'var(--text-secondary)', fontSize:'11px', fontWeight:'600', textTransform:'uppercase', letterSpacing:'0.5px' }}>Password</label>
                <Link to="/forgot-password" style={{ color:'var(--primary)', fontSize:'12px', fontWeight:'600' }}>Forgot?</Link>
              </div>
              <div style={{ position:'relative' }}>
                <input className="inp" type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Your password" style={{ paddingRight:'44px' }} />
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--text-muted)', cursor:'pointer', fontSize:'16px' }}>{showPass?'🙈':'👁️'}</button>
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width:'100%', padding:'13px', fontSize:'15px' }}>
              {isLoading ? '⏳ Logging in...' : '🔐 LOGIN'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:'14px', color:'var(--text-secondary)', fontSize:'13px' }}>
            No account? <Link to="/signup" style={{ color:'var(--primary)', fontWeight:'700' }}>Sign up free →</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
