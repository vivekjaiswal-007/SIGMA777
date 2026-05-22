import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

export default function AccountPage() {
  const { user, balance, logout } = useStore()
  const navigate = useNavigate()

  if (!user) { navigate('/login'); return null }

  const menuItems = [
    { label: 'Deposit & Withdrawal', icon: '💳', path: '/dashboard' },
    { label: 'Bet History', icon: '📋', path: '/dashboard' },
    { label: 'Bank Transfer', icon: '🏦', path: '/dashboard' },
    { label: 'Profit & Loss', icon: '📊', path: '/dashboard' },
    { label: 'Bonus History', icon: '🎁', path: '/dashboard' },
    { label: 'Activity Log', icon: '📝', path: '/dashboard' },
    { label: 'Account Statements', icon: '📄', path: '/dashboard' },
    { label: 'Account Settings', icon: '⚙️', path: '/dashboard' },
  ]

  const btnStyle = {
    width: '100%',
    padding: '16px 20px',
    background: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    color: '#111',
    textAlign: 'left',
  }

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '80px' }}>

      {/* Back header */}
      <div style={{ background: '#0a2e14', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ‹ BACK
        </button>
        <button style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>🔔</button>
      </div>

      {/* User card */}
      <div style={{ background: '#1e7d32', margin: '16px', borderRadius: '12px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#fff', fontSize: '20px', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase' }}>{user.username}</span>
        <div style={{ width: '44px', height: '44px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
          </svg>
        </div>
      </div>

      {/* Balance stats */}
      <div style={{ background: '#fff', margin: '0 16px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
        {[
          { label: 'Available Balance', value: Number(balance || 0).toFixed(2), color: '#111' },
          { label: 'Wallet Balance', value: '0.00', color: '#111' },
          { label: 'Winning', value: `+${Number(balance || 0).toFixed(2)}`, color: '#1e7d32' },
          { label: 'Exposure', value: '0.00', color: '#e53935' },
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', borderBottom: i < 3 ? '1px solid #f0f0f0' : 'none' }}>
            <span style={{ fontSize: '15px', color: '#444' }}>{item.label}</span>
            <span style={{ fontSize: '15px', fontWeight: '700', color: item.color }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div style={{ margin: '0 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {menuItems.map((item, i) => (
          <button key={i} style={btnStyle} onClick={() => navigate(item.path)}>
            <span>{item.label}</span>
            <span style={{ color: '#999', fontSize: '18px' }}>›</span>
          </button>
        ))}

        {/* Logout */}
        <button onClick={() => { logout(); navigate('/') }} style={{ width: '100%', padding: '16px', background: '#e53935', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: '900', cursor: 'pointer', letterSpacing: '1px', marginTop: '4px' }}>
          LOGOUT
        </button>
      </div>

    </div>
  )
}
