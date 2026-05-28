import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toggleSound, getSoundState } from '../utils/sounds'
import { useStore } from '../store/useStore'

export default function Header({ onMobileMenuClick, isMobile }) {
  const { user, balance, logout, toggleSidebar } = useStore()
  const navigate = useNavigate()
  const [soundOn, setSoundOn] = useState(getSoundState())
  const handleSoundToggle = () => { const s = toggleSound(); setSoundOn(s) }

  const handleMenuClick = () => {
    if (isMobile) {
      onMobileMenuClick?.()
    } else {
      toggleSidebar()
    }
  }

  return (
    <header className="app-header">
      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Hamburger */}
        <button
          onClick={handleMenuClick}
          style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            padding: '8px', borderRadius: '7px', display: 'flex', alignItems: 'center',
            cursor: 'pointer', flexShrink: 0
          }}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, textDecoration: 'none' }}>
          {/* Σ icon */}
          <div style={{
            width: isMobile ? '32px' : '38px',
            height: isMobile ? '32px' : '38px',
            background: 'linear-gradient(135deg,#c91818,#ff4040)',
            borderRadius: '9px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: isMobile ? '16px' : '20px',
            fontWeight: '900',
            color: '#fff',
            fontFamily: 'Cinzel,serif',
            boxShadow: '0 0 16px rgba(220,30,30,0.45)',
            flexShrink: 0,
            letterSpacing: '-1px'
          }}>Σ</div>
          {/* Name */}
          <div style={{ lineHeight: 1 }}>
            <div className="sigma-logo-text" style={{ fontSize: isMobile ? '15px' : '20px', letterSpacing: '2px' }}>
              SIGMA<span style={{ color: '#ff6b00', WebkitTextFillColor: '#ff6b00' }}>777</span>
            </div>
            {!isMobile && (
              <div style={{ fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '1px' }}>
                Premium Casino
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        {user ? (
          <>
            {/* Balance */}
            <div
              onClick={() => navigate('/dashboard')}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                background: 'rgba(224,48,48,0.1)', border: '1px solid rgba(224,48,48,0.28)',
                borderRadius: '8px', padding: isMobile ? '5px 10px' : '6px 12px',
                cursor: 'pointer', flexShrink: 0
              }}
            >
              <span style={{ fontSize: '13px' }}>🪙</span>
              <span style={{ color: 'var(--gold)', fontWeight: '700', fontSize: isMobile ? '13px' : '14px' }}>
                {Number(balance).toLocaleString()}
              </span>
            </div>

            {/* Avatar */}
            <div style={{
              width: '30px', height: '30px',
              background: 'linear-gradient(135deg,#c91818,#ff4040)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', flexShrink: 0, cursor: 'pointer',
              boxShadow: '0 0 10px rgba(220,30,30,0.4)'
            }}
              onClick={() => navigate('/dashboard')}
            >
              {user.username?.[0]?.toUpperCase()}
            </div>

            {/* Username */}
            {!isMobile && (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.username}
              </span>
            )}

            <button
              onClick={handleSoundToggle}
              title={soundOn ? 'Sound ON' : 'Sound OFF'}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: soundOn ? 'var(--gold)' : 'var(--text-muted)',
                padding: isMobile ? '5px 7px' : '6px 10px', borderRadius: '7px',
                fontSize: isMobile ? '14px' : '16px', cursor: 'pointer', flexShrink: 0
              }}
            >{soundOn ? '🔊' : '🔇'}</button>

            <button
              onClick={logout}
              style={{
                background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.28)',
                color: '#ff4444', padding: isMobile ? '5px 8px' : '6px 12px', borderRadius: '7px',
                fontSize: isMobile ? '11px' : '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
              }}
            >
              {isMobile ? '⬅' : 'Logout'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button style={{
                background: 'transparent', border: '1px solid var(--gold)', color: 'var(--gold)',
                padding: isMobile ? '6px 10px' : '7px 16px', borderRadius: '7px',
                fontSize: isMobile ? '12px' : '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'
              }}>Login</button>
            </Link>
            <Link to="/signup">
              <button style={{
                background: 'linear-gradient(135deg,#c91818,#ff4040)', border: 'none', color: '#fff',
                padding: isMobile ? '6px 10px' : '7px 16px', borderRadius: '7px',
                fontSize: isMobile ? '12px' : '13px', fontWeight: '700', cursor: 'pointer', whiteSpace: 'nowrap',
                boxShadow: '0 0 12px rgba(220,30,30,0.35)'
              }}>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
