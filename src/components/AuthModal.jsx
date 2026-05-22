import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, signup, isLoading } = useStore()
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const isLogin = mode === 'login'

  const IS = {
    width:'100%', padding:'14px 16px',
    background:'transparent', border:'1px solid #2e2e2e',
    borderRadius:'8px', color:'#fff', fontSize:'15px',
    outline:'none', boxSizing:'border-box',
  }

  const EyeIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )

  const handleSubmit = async () => {
    if (isLogin) {
      if (!phone.trim()) return toast.error('Enter phone or email')
      if (!password) return toast.error('Enter password')
      const res = await login(phone.trim(), password)
      if (res.success) { toast.success('Welcome back!'); onClose() }
      else toast.error(res.error)
    } else {
      if (!phone.trim()) return toast.error('Enter phone number')
      if (!username.trim()) return toast.error('Enter username')
      if (password.length < 6) return toast.error('Min 6 characters')
      if (password !== confirm) return toast.error('Passwords do not match')
      const res = await signup(username.trim(), phone.trim(), password)
      if (res.success) { toast.success('Account created! 🎉'); onClose() }
      else toast.error(res.error)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      {/* Overlay */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)' }} onClick={onClose} />

      {/* Modal box — centered, compact */}
      <div style={{ position:'relative', background:'#191919', borderRadius:'14px', width:'100%', maxWidth:'360px', zIndex:1, overflow:'hidden' }}>

        {/* CLOSE bar */}
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'12px 14px 0' }}>
          <button onClick={onClose} style={{ display:'flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.08)', border:'none', color:'#ccc', padding:'6px 12px', borderRadius:'6px', fontSize:'12px', fontWeight:'700', cursor:'pointer', letterSpacing:'0.5px' }}>
            CLOSE &nbsp;✕
          </button>
        </div>

        <div style={{ padding:'14px 20px 24px' }}>
          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:'18px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', marginBottom:'3px' }}>
              <div style={{ width:'30px', height:'30px', background:'rgba(255,255,255,0.1)', border:'2px solid rgba(255,255,255,0.25)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'13px', color:'#fff' }}>Σ</span>
              </div>
              <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'20px', color:'#fff', letterSpacing:'1px' }}>
                SIGMA<span style={{ color:'#ffe066' }}>777</span>
              </span>
            </div>
            <div style={{ fontSize:'10px', color:'#444', letterSpacing:'1px' }}>www.sigma777.com</div>
          </div>

          {/* Fields */}
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'12px' }}>
            {/* Phone row */}
            <div style={{ display:'flex', gap:'8px' }}>
              <div style={{ ...IS, width:'105px', flexShrink:0, display:'flex', alignItems:'center', color:'#888', fontSize:'13px' }}>
                IN (+91)
              </div>
              <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
                placeholder={isLogin?'Phone or Email':'Phone no.'}
                style={{ ...IS, flex:1 }}
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
              />
            </div>

            {!isLogin && (
              <input type="text" value={username} onChange={e=>setUsername(e.target.value)}
                placeholder="Username" style={IS}
              />
            )}

            <div style={{ position:'relative' }}>
              <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
                placeholder="Password" style={{ ...IS, paddingRight:'46px' }}
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
              />
              <button type="button" onClick={()=>setShowPass(!showPass)}
                style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                <EyeIcon/>
              </button>
            </div>

            {!isLogin && (
              <div style={{ position:'relative' }}>
                <input type={showConfirm?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)}
                  placeholder="Confirm Password" style={{ ...IS, paddingRight:'46px' }}
                />
                <button type="button" onClick={()=>setShowConfirm(!showConfirm)}
                  style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                  <EyeIcon/>
                </button>
              </div>
            )}
          </div>

          {/* Terms */}
          <p style={{ color:'#555', fontSize:'11px', lineHeight:1.6, marginBottom:'14px' }}>
            By clicking the '{isLogin?'Login':'Sign up'}' button, you confirm that you have attained the age of majority in your country of residence and accept the Terms & Conditions SIGMA777.
          </p>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={isLoading}
            style={{ width:'100%', padding:'15px', background:'#fff', border:'none', borderRadius:'8px', color:'#111', fontWeight:'900', fontSize:'15px', cursor:'pointer', letterSpacing:'1px', marginBottom:'14px' }}>
            {isLoading ? 'Please wait...' : isLogin ? 'LOGIN' : 'SIGN UP'}
          </button>

          {/* Switch */}
          <p style={{ textAlign:'center', color:'#555', fontSize:'12px' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span onClick={onSwitch} style={{ color:'#4caf50', fontWeight:'700', cursor:'pointer' }}>
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
