import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import toast from 'react-hot-toast'

const IS = {
  width: '100%',
  padding: '14px 16px',
  background: '#1a1a2a',
  border: '1px solid #2a2a3a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box',
}

export default function AuthModal({ mode, onClose, onSwitch }) {
  const { login, signup, isLoading } = useStore()
  const [phone, setPhone] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const isLogin = mode === 'login'

  const handleSubmit = async () => {
    if (isLogin) {
      if (!phone.trim()) return toast.error('Enter phone or email')
      if (!password) return toast.error('Enter password')
      const res = await login(phone.trim(), password)
      if (res.success) { toast.success('Welcome back! 🎮'); onClose() }
      else toast.error(res.error)
    } else {
      if (!phone.trim()) return toast.error('Enter phone number')
      if (!username.trim()) return toast.error('Enter username')
      if (password.length < 6) return toast.error('Min 6 char password')
      if (password !== confirm) return toast.error('Passwords do not match')
      const res = await signup(username.trim(), phone.trim(), password)
      if (res.success) { toast.success('Account created! 🎉'); onClose() }
      else toast.error(res.error)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999, display:'flex', flexDirection:'column' }}>
      {/* Blurred overlay — shows content behind */}
      <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.65)', backdropFilter:'blur(4px)' }} onClick={onClose} />

      {/* Modal slides up from bottom */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'#111', borderRadius:'20px 20px 0 0', padding:'28px 20px 40px', zIndex:1 }}>

        {/* Close button */}
        <button onClick={onClose} style={{ position:'absolute', top:'16px', right:'16px', background:'rgba(255,255,255,0.1)', border:'none', color:'#fff', width:'32px', height:'32px', borderRadius:'50%', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>✕</button>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'22px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
            <div style={{ width:'32px', height:'32px', background:'rgba(255,255,255,0.12)', border:'2px solid rgba(255,255,255,0.35)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'14px', color:'#fff' }}>Σ</span>
            </div>
            <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'20px', color:'#fff', letterSpacing:'1px' }}>
              SIGMA<span style={{ color:'#ffe066' }}>777</span>
            </span>
          </div>
        </div>

        {/* Phone row */}
        <div style={{ display:'flex', gap:'8px', marginBottom:'10px' }}>
          <div style={{ ...IS, width:'110px', flexShrink:0, display:'flex', alignItems:'center', color:'#aaa', fontSize:'14px' }}>
            IN (+91)
          </div>
          <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
            placeholder={isLogin ? 'Phone or Email' : 'Phone no.'}
            style={{ ...IS, flex:1 }}
            onKeyDown={e => e.key==='Enter' && handleSubmit()}
          />
        </div>

        {/* Signup only fields */}
        {!isLogin && (
          <input type="text" value={username} onChange={e=>setUsername(e.target.value)}
            placeholder="Username" style={{ ...IS, marginBottom:'10px' }}
          />
        )}

        {/* Password */}
        <div style={{ position:'relative', marginBottom:'10px' }}>
          <input type={showPass?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)}
            placeholder="Password" style={{ ...IS, paddingRight:'48px' }}
            onKeyDown={e => e.key==='Enter' && handleSubmit()}
          />
          <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#aaa', cursor:'pointer', fontSize:'18px' }}>
            👁
          </button>
        </div>

        {/* Confirm password — signup only */}
        {!isLogin && (
          <div style={{ position:'relative', marginBottom:'10px' }}>
            <input type={showConfirm?'text':'password'} value={confirm} onChange={e=>setConfirm(e.target.value)}
              placeholder="Confirm Password" style={{ ...IS, paddingRight:'48px' }}
            />
            <button type="button" onClick={()=>setShowConfirm(!showConfirm)} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#aaa', cursor:'pointer', fontSize:'18px' }}>
              👁
            </button>
          </div>
        )}

        {/* Terms text */}
        <p style={{ color:'#666', fontSize:'11px', lineHeight:1.5, marginBottom:'16px' }}>
          By clicking the '{isLogin?'Login':'Sign up'}' button, you confirm that you have attained the age of majority in your country of residence and accept the Terms & Conditions of SIGMA777.
        </p>

        {/* Submit */}
        <button onClick={handleSubmit} disabled={isLoading}
          style={{ width:'100%', padding:'15px', background:'#fff', border:'none', borderRadius:'8px', color:'#111', fontWeight:'900', fontSize:'16px', cursor:'pointer', letterSpacing:'1px', marginBottom:'14px' }}>
          {isLoading ? '⏳ Please wait...' : isLogin ? 'LOGIN' : 'SIGN UP'}
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
  )
}
