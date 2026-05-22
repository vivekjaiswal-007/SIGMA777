import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Header({ onMobileMenuClick, isMobile }) {
  const { user, balance, logout, toggleSidebar } = useStore()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchOpen(false)
    setSearchVal('')
  }

  return (
    <header className="app-header" style={{ background:'#0a2e14', borderBottom:'1px solid #071f0e', boxShadow:'0 1px 6px rgba(0,0,0,0.5)', padding:'0 10px' }}>

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', zIndex:2000, display:'flex', alignItems:'flex-start', justifyContent:'center', paddingTop:'60px' }}
          onClick={() => setSearchOpen(false)}>
          <form onSubmit={handleSearch} onClick={e => e.stopPropagation()}
            style={{ width:'90%', maxWidth:'400px', display:'flex', gap:'8px' }}>
            <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)}
              placeholder="Search games..."
              style={{ flex:1, padding:'10px 14px', background:'#1a1a1a', border:'1px solid #333', borderRadius:'8px', color:'#fff', fontSize:'15px', outline:'none' }} />
            <button type="submit" style={{ padding:'10px 16px', background:'#1e7d32', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'700', cursor:'pointer' }}>Go</button>
          </form>
        </div>
      )}

      {/* Left */}
      <div style={{ display:'flex', alignItems:'center', gap:'7px', flexShrink:0 }}>
        {!isMobile && (
          <button onClick={() => toggleSidebar()} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.7)', padding:'5px', display:'flex', alignItems:'center', cursor:'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>
          </button>
        )}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
          <div style={{ width:'24px', height:'24px', background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.35)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'11px', color:'#fff' }}>Σ</span>
          </div>
          <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize: isMobile?'13px':'15px', color:'#fff', letterSpacing:'1px' }}>
            SIGMA<span style={{ color:'#ffe066' }}>777</span>
          </span>
        </Link>
      </div>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:'5px', flexShrink:0 }}>
        {/* Search icon */}
        <button onClick={() => setSearchOpen(true)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.75)', padding:'4px 6px', cursor:'pointer', display:'flex', alignItems:'center' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

        {user ? (
          <>
            {/* Balance chip — Mahaling777 style */}
            <div onClick={() => navigate('/dashboard')} style={{ display:'flex', alignItems:'center', gap:'5px', background:'rgba(0,0,0,0.35)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'6px', padding:'3px 10px', cursor:'pointer', flexShrink:0 }}>
              <span style={{ fontSize:'12px' }}>🪙</span>
              <span style={{ color:'#ffe066', fontWeight:'800', fontSize:'12px' }}>CI {Number(balance||0).toLocaleString()}</span>
            </div>
            <button onClick={logout} style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.18)', color:'rgba(255,255,255,0.8)', padding:'3px 7px', borderRadius:'4px', fontSize:'10px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
              {isMobile ? '⬅' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={{ background:'rgba(0,0,0,0.3)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', padding:'4px 9px', borderRadius:'4px', fontSize:'11px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>LOGIN</button>
            </Link>
            <Link to="/signup">
              <button style={{ background:'rgba(0,0,0,0.4)', border:'1.5px solid rgba(255,255,255,0.4)', color:'#fff', padding:'3px 8px', borderRadius:'4px', fontSize:'11px', fontWeight:'800', cursor:'pointer', whiteSpace:'nowrap' }}>SIGNUP</button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
