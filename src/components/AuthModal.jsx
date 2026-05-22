import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const IS = {
  width: '100%',
  padding: '16px',
  background: 'transparent',
  border: '1px solid #333',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '15px',
  outline: 'none',
  boxSizing: 'border-box',
  marginBottom: '10px',
}

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, signup, isLoading } = useStore()
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [signupCode, setSignupCode] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const isLogin = mode === 'login'

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
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      {/* Overlay */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)' }} onClick={onClose} />

      {/* Modal */}
      <div style={{ position:'relative', background:'#1a1a1a', borderRadius:'0', padding:'0 0 30px 0', zIndex:1, maxHeight:'95vh', overflowY:'auto' }}>

        {/* Top banner area — shows content behind like Mahaling777 */}
        <div style={{ background:'#111', padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid #222', marginBottom:'20px' }}>
          <div style={{ flex:1 }} />
          <button onClick={onClose} style={{ display:'flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.12)', border:'none', color:'#fff', padding:'7px 14px', borderRadius:'6px', fontSize:'13px', fontWeight:'700', cursor:'pointer', letterSpacing:'0.5px' }}>
            CLOSE &nbsp; ✕
          </button>
        </div>

        <div style={{ padding:'0 20px' }}>
          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:'22px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'4px' }}>
              <div style={{ width:'34px', height:'34px', background:'rgba(255,255,255,0.1)', border:'2px solid rgba(255,255,255,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'15px', color:'#fff' }}>Σ</span>
              </div>
              <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'22px', color:'#fff', letterSpacing:'1px' }}>
                SIGMA<span style={{ color:'#ffe066' }}>777</span>
              </span>
            </div>
            <div style={{ fontSize:'10px', color:'#555', letterSpacing:'1px' }}>www.sigma777.com</div>
          </div>

          {/* Phone row */}
          <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
            <div style={{ ...IS, width:'105px', flexShrink:0, display:'flex', alignItems:'center', color:'#aaa', fontSize:'14px', marginBottom:0, cursor:'pointer' }}>
              IN (+91)
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={isLogin ? 'Phone or Email' : 'Phone no.'}
              style={{ ...IS, flex:1, marginBottom:0 }}
            />
          </div>
          <div style={{ marginBottom:'10px' }} />

          {/* Signup fields */}
          {!isLogin && (
            <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" style={IS} />
          )}

          {/* Password */}
          <div style={{ position:'relative' }}>
            <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" style={{ ...IS, paddingRight:'50px' }} />
            <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:'14px', top:'16px', background:'none', border:'none', color:'#888', cursor:'pointer', fontSize:'18px', padding:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>

          {/* Confirm password */}
          {!isLogin && (
            <div style={{ position:'relative' }}>
              <input type={showConfirm?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="Confirm Password" style={{ ...IS, paddingRight:'50px' }} />
              <button type="button" onClick={()=>setShowConfirm(!showConfirm)} style={{ position:'absolute', right:'14px', top:'16px', background:'none', border:'none', color:'#888', cursor:'pointer', fontSize:'18px', padding:0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          )}

          {/* Signup code */}
          {!isLogin && (
            <input type="text" value={signupCode} onChange={e=>setSignupCode(e.target.value)} placeholder="Enter Signup Code" style={IS} />
          )}

          {/* Terms */}
          <p style={{ color:'#777', fontSize:'12px', lineHeight:1.6, marginBottom:'16px' }}>
            By clicking the '{isLogin?'Login':'Sign up'}' button, you confirm that you have attained the age of majority in your country of residence and accept the Terms & Conditions SIGMA777.
          </p>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={isLoading} style={{ width:'100%', padding:'16px', background:'#fff', border:'none', borderRadius:'8px', color:'#111', fontWeight:'900', fontSize:'16px', cursor:'pointer', letterSpacing:'1px', marginBottom:'16px' }}>
            {isLoading ? 'Please wait...' : isLogin ? 'LOGIN' : 'SIGN UP'}
          </button>

          {/* Switch */}
          <p style={{ textAlign:'center', color:'#666', fontSize:'13px' }}>
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
