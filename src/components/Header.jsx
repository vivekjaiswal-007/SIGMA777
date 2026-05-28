import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function Header({ isMobile, onLoginClick, onSignupClick }) {
  const { user, balance, logout } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  const navTabs = [
    { label: 'Home', path: '/' },
    { label: 'Inplay', action: 'cricket' },
    { label: 'Sportsbook', action: 'cricket' },
    { label: 'Casino', path: '/live-casino' },
    { label: 'Multi Markets', path: '/lobby' },
  ]

  const handleTab = (tab) => {
    if (tab.action === 'cricket') window.dispatchEvent(new CustomEvent('launch-cricket'))
    else if (tab.path) navigate(tab.path)
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 'var(--header-height)',
      background: '#2a1e00',
      borderBottom: '1px solid #3a2800',
      display: 'flex',
      alignItems: 'center',
      padding: '0 14px',
      zIndex: 1100,
      gap: '16px',
    }}>

      {/* Logo */}
      <Link to="/" style={{ display:'flex', alignItems:'center', flexShrink:0, textDecoration:'none', gap:'2px' }}>
        <span style={{ fontFamily:'Georgia,serif', fontWeight:'900', fontSize: isMobile?'17px':'21px', color:'#c9a84c', letterSpacing:'-0.5px', textTransform:'uppercase', textShadow:'0 0 14px rgba(201,168,76,0.5)' }}>
          MAHADEV<span style={{ fontSize: isMobile?'11px':'13px', verticalAlign:'super' }}>247</span>
        </span>
      </Link>

      {/* Nav tabs — always visible, even mobile */}
      <nav style={{ display:'flex', alignItems:'center', gap:'2px', flex:1, overflowX:'auto', scrollbarWidth:'none' }}>
        {navTabs.map((tab, i) => {
          const isActive = tab.path && location.pathname === tab.path
          return (
            <button key={i} onClick={() => handleTab(tab)}
              style={{
                flexShrink: 0,
                padding: isMobile ? '5px 10px' : '5px 16px',
                background: isActive ? '#c9a84c' : 'transparent',
                border: 'none',
                borderRadius: '20px',
                color: isActive ? '#111' : '#bbb',
                fontWeight: isActive ? '700' : '500',
                fontSize: isMobile ? '11px' : '13px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#bbb' }}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>

      {/* Right */}
      <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
        {user ? (
          <>
            <div onClick={() => navigate('/account')}
              style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(201,168,76,0.15)', border:'1px solid rgba(201,168,76,0.4)', borderRadius:'20px', padding:'3px 10px', cursor:'pointer' }}>
              <span style={{ fontSize:'11px' }}>🪙</span>
              <span style={{ color:'#c9a84c', fontWeight:'800', fontSize:'12px' }}>CI {Number(balance||0).toLocaleString()}</span>
            </div>
            <button onClick={logout}
              style={{ background:'transparent', border:'1px solid #444', color:'#ccc', padding:'4px 12px', borderRadius:'20px', fontSize:'12px', cursor:'pointer' }}>
              {isMobile ? '⬅' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <button onClick={onLoginClick}
              style={{ background:'transparent', border:'1px solid #c9a84c', color:'#c9a84c', padding:'5px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}>
              Login
            </button>
            {!isMobile && (
              <button onClick={onSignupClick}
                style={{ background:'#c9a84c', border:'none', color:'#111', padding:'5px 16px', borderRadius:'20px', fontSize:'13px', fontWeight:'700', cursor:'pointer', whiteSpace:'nowrap' }}>
                Sign Up
              </button>
            )}
          </>
        )}
      </div>
    </header>
  )
}
