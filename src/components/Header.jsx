import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toggleSound, getSoundState } from '../utils/sounds'
import { useStore } from '../store/useStore'

export default function Header({ onMobileMenuClick, isMobile }) {
  const { user, balance, logout, toggleSidebar } = useStore()
  const navigate = useNavigate()

  return (
    <header className="app-header" style={{
      background: '#0a2e14',
      borderBottom: '1px solid #0d3b1a',
      boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
    }}>
      {/* Left — Logo only on mobile, full on desktop */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
        {/* Hamburger — desktop only */}
        {!isMobile && (
          <button onClick={() => toggleSidebar()} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', padding:'6px', borderRadius:'6px', display:'flex', alignItems:'center', cursor:'pointer' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          </button>
        )}

        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'7px', flexShrink:0 }}>
          {/* Σ circle icon */}
          <div style={{ width: isMobile?'28px':'32px', height: isMobile?'28px':'32px', background:'rgba(255,255,255,0.12)', border:'2px solid rgba(255,255,255,0.35)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize: isMobile?'13px':'15px', color:'#fff' }}>Σ</span>
          </div>
          {/* Name — hidden on mobile */}
          {!isMobile && (
            <div>
              <div style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'17px', color:'#ffffff', letterSpacing:'1px', lineHeight:1 }}>
                SIGMA<span style={{ color:'#ffe066' }}>777</span>
              </div>
              <div style={{ fontSize:'8px', color:'rgba(255,255,255,0.55)', letterSpacing:'1.5px', textTransform:'uppercase' }}>Live Casino</div>
            </div>
          )}
          {/* Mobile — show name compact */}
          {isMobile && (
            <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'14px', color:'#fff', letterSpacing:'1px' }}>
              SIGMA<span style={{ color:'#ffe066' }}>777</span>
            </span>
          )}
        </Link>
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:'5px', flexShrink:0 }}>
        {user ? (
          <>
            <div onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'20px', padding: isMobile?'3px 9px':'4px 11px', cursor:'pointer', flexShrink:0 }}>
              <span style={{ fontSize:'11px' }}>🪙</span>
              <span style={{ color:'#ffe066', fontWeight:'800', fontSize: isMobile?'12px':'13px' }}>{Number(balance||0).toLocaleString()}</span>
            </div>
            <div onClick={() => navigate('/dashboard')} style={{ width:'26px', height:'26px', background:'rgba(255,255,255,0.15)', border:'2px solid rgba(255,255,255,0.3)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'800', cursor:'pointer', color:'#fff', flexShrink:0 }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            <button onClick={logout} style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.2)', color:'rgba(255,255,255,0.85)', padding: isMobile?'4px 7px':'4px 10px', borderRadius:'5px', fontSize:'11px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
              {isMobile ? '⬅' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', padding: isMobile?'5px 10px':'5px 14px', borderRadius:'5px', fontSize:'11px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', letterSpacing:'0.5px' }}>LOGIN</button>
            </Link>
            <Link to="/signup">
              <button style={{ background:'rgba(0,0,0,0.4)', border:'2px solid rgba(255,255,255,0.45)', color:'#fff', padding: isMobile?'4px 9px':'4px 13px', borderRadius:'5px', fontSize:'11px', fontWeight:'800', cursor:'pointer', whiteSpace:'nowrap', letterSpacing:'0.5px' }}>SIGNUP</button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
