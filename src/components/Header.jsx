import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toggleSound, getSoundState } from '../utils/sounds'
import { useStore } from '../store/useStore'

export default function Header({ onMobileMenuClick, isMobile }) {
  const { user, balance, logout, toggleSidebar } = useStore()
  const navigate = useNavigate()
  const [soundOn, setSoundOn] = React.useState(() => { try { return getSoundState() } catch { return true } })

  const handleMenu = () => { if (isMobile) { onMobileMenuClick?.() } else { toggleSidebar() } }

  return (
    <header className="app-header" style={{
      background: 'linear-gradient(90deg, #1a6b2a 0%, #1e7d32 50%, #1a6b2a 100%)',
      borderBottom: '1px solid rgba(0,0,0,0.3)',
      boxShadow: '0 2px 12px rgba(0,0,0,0.4)'
    }}>
      {/* Left — Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
        <button onClick={handleMenu} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.8)', padding:'7px', borderRadius:'6px', display:'flex', alignItems:'center', cursor:'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
        </button>

        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'7px', flexShrink:0 }}>
          {/* Logo icon — Σ in circle */}
          <div style={{ width: isMobile?'32px':'38px', height: isMobile?'32px':'38px', background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize: isMobile?'14px':'17px', color:'#fff' }}>Σ</span>
          </div>
          <div>
            <div style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize: isMobile?'15px':'18px', color:'#ffffff', letterSpacing:'1px', lineHeight:1, textShadow:'0 1px 4px rgba(0,0,0,0.4)' }}>
              SIGMA<span style={{ color:'#ffe066' }}>777</span>
            </div>
            {!isMobile && <div style={{ fontSize:'8px', color:'rgba(255,255,255,0.65)', letterSpacing:'1.5px', textTransform:'uppercase' }}>Live Casino</div>}
          </div>
        </Link>
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
        {user ? (
          <>
            {/* Balance chip — dark green */}
            <div onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'20px', padding: isMobile?'4px 10px':'5px 13px', cursor:'pointer', flexShrink:0 }}>
              <span style={{ fontSize:'13px' }}>🪙</span>
              <span style={{ color:'#ffe066', fontWeight:'800', fontSize: isMobile?'12px':'13px' }}>{Number(balance||0).toLocaleString()}</span>
            </div>
            {/* Avatar */}
            <div onClick={() => navigate('/dashboard')} style={{ width:'30px', height:'30px', background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.4)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:'800', cursor:'pointer', color:'#fff', flexShrink:0 }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            {!isMobile && <span style={{ fontSize:'12px', color:'rgba(255,255,255,0.8)', maxWidth:'70px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.username}</span>}
            <button onClick={logout} style={{ background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.9)', padding: isMobile?'5px 8px':'5px 12px', borderRadius:'6px', fontSize:'12px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
              {isMobile ? '⬅' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={{ background:'rgba(0,0,0,0.25)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', padding: isMobile?'6px 12px':'7px 16px', borderRadius:'6px', fontSize:'12px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', letterSpacing:'0.5px' }}>LOGIN</button>
            </Link>
            <Link to="/signup">
              <button style={{ background:'rgba(0,0,0,0.35)', border:'2px solid rgba(255,255,255,0.5)', color:'#fff', padding: isMobile?'5px 11px':'6px 15px', borderRadius:'6px', fontSize:'12px', fontWeight:'800', cursor:'pointer', whiteSpace:'nowrap', letterSpacing:'0.5px' }}>SIGNUP</button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
