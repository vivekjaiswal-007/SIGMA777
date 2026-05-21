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
    <header className="app-header">
      {/* Left */}
      <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
        <button onClick={handleMenu} style={{ background:'none', border:'none', color:'var(--text-secondary)', padding:'7px', borderRadius:'7px', display:'flex', alignItems:'center', cursor:'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
        </button>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'7px', flexShrink:0 }}>
          <div style={{ width: isMobile?'30px':'36px', height: isMobile?'30px':'36px', background:'linear-gradient(135deg,#c91818,#ff4040)', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontSize: isMobile?'15px':'19px', fontWeight:'900', color:'#fff', fontFamily:'Cinzel,serif', boxShadow:'0 0 14px rgba(220,30,30,0.4)', flexShrink:0 }}>Σ</div>
          <div>
            <div className="sigma-logo-text" style={{ fontSize: isMobile?'14px':'19px', letterSpacing:'2px' }}>SIGMA<span style={{ WebkitTextFillColor:'#ff6b00' }}>777</span></div>
            {!isMobile && <div style={{ fontSize:'8px', color:'var(--text-muted)', letterSpacing:'2px', textTransform:'uppercase' }}>Premium Casino</div>}
          </div>
        </Link>
      </div>

      {/* Nav tabs — desktop */}
      {!isMobile && (
        <div style={{ display:'flex', gap:'2px' }}>
          {[['/', '🏠 Home'], ['/lobby', '🎮 Casino'], ['/live-casino', '📺 Live']].map(([path, label]) => (
            <Link key={path} to={path}>
              <button style={{ background:'transparent', border:'none', color:'var(--text-secondary)', padding:'6px 14px', borderRadius:'7px', fontSize:'12px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.color='#fff'} onMouseLeave={e => e.currentTarget.style.color='var(--text-secondary)'}
              >{label}</button>
            </Link>
          ))}
        </div>
      )}

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:'5px', flexShrink:0 }}>
        {user ? (
          <>
            <div onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(224,48,48,0.1)', border:'1px solid rgba(224,48,48,0.25)', borderRadius:'8px', padding: isMobile?'4px 9px':'5px 11px', cursor:'pointer', flexShrink:0 }}>
              <span style={{ fontSize:'12px' }}>🪙</span>
              <span style={{ color:'var(--primary)', fontWeight:'700', fontSize: isMobile?'12px':'13px' }}>{Number(balance||0).toLocaleString()}</span>
            </div>
            <div onClick={() => navigate('/dashboard')} style={{ width:'28px', height:'28px', background:'linear-gradient(135deg,#c91818,#ff4040)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'700', cursor:'pointer', boxShadow:'0 0 8px rgba(220,30,30,0.4)', flexShrink:0 }}>
              {user.username?.[0]?.toUpperCase()}
            </div>
            {!isMobile && <span style={{ fontSize:'12px', color:'var(--text-secondary)', maxWidth:'70px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.username}</span>}
            <button onClick={() => { try { const s = toggleSound(); setSoundOn(s) } catch{} }} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color: soundOn?'var(--primary)':'var(--text-muted)', padding:'5px 7px', borderRadius:'6px', fontSize:'13px', cursor:'pointer', flexShrink:0 }}>{soundOn?'🔊':'🔇'}</button>
            <button onClick={logout} style={{ background:'rgba(255,68,68,0.1)', border:'1px solid rgba(255,68,68,0.25)', color:'#ff4444', padding: isMobile?'5px 7px':'5px 11px', borderRadius:'6px', fontSize: isMobile?'12px':'12px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>{isMobile?'⬅':'Logout'}</button>
          </>
        ) : (
          <>
            <Link to="/login"><button style={{ background:'transparent', border:'1px solid var(--primary)', color:'var(--primary)', padding: isMobile?'5px 9px':'6px 14px', borderRadius:'7px', fontSize:'12px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>LOGIN</button></Link>
            <Link to="/signup"><button style={{ background:'linear-gradient(135deg,#c91818,#ff4040)', border:'none', color:'#fff', padding: isMobile?'5px 9px':'6px 14px', borderRadius:'7px', fontSize:'12px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 0 10px rgba(220,30,30,0.35)' }}>SIGNUP</button></Link>
          </>
        )}
      </div>
    </header>
  )
}
