import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Header from './Header'
import Sidebar from './Sidebar'

function BottomNav() {
  const { user } = useStore()
  const navigate = useNavigate()
  const p = useLocation().pathname

  const items = [
    { icon:'🏠', label:'HOME', path:'/' },
    { icon:'🎰', label:'CASINO', path:'/lobby' },
  ]
  const rightItems = [
    { icon:'🏏', label:'IN-PLAY', path:'/live-casino' },
    { icon:'📋', label:'OPEN BETS', path: user ? '/dashboard' : '/login' },
    { icon:'👤', label:'ACCOUNT', path: user ? '/dashboard' : '/login' },
  ]

  const BtnStyle = (active) => ({
    flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
    gap:'3px', cursor:'pointer', border:'none', background:'transparent',
    color: active ? 'var(--primary)' : 'var(--text-muted)',
    fontSize:'9px', fontWeight:'700', letterSpacing:'0.3px', textTransform:'uppercase', padding:'0',
    transition:'color 0.15s',
  })

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {items.map(it => (
          <button key={it.path} style={BtnStyle(p===it.path)} onClick={() => navigate(it.path)}>
            <span style={{ fontSize:'20px' }}>{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
        {/* Center play button */}
        <button style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2px', cursor:'pointer', border:'none', background:'transparent', padding:0 }} onClick={() => navigate('/lobby')}>
          <div style={{ width:'44px', height:'44px', background:'linear-gradient(135deg,#c91818,#ff4040)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', boxShadow:'0 0 16px rgba(224,48,48,0.5)', marginTop:'-14px', border:'3px solid var(--bg-primary)' }}>▶</div>
          <span style={{ fontSize:'9px', fontWeight:'700', color:'var(--primary)', textTransform:'uppercase', letterSpacing:'0.3px' }}>PLAY</span>
        </button>
        {rightItems.map(it => (
          <button key={it.label} style={BtnStyle(p===it.path)} onClick={() => navigate(it.path)}>
            <span style={{ fontSize:'20px' }}>{it.icon}</span>
            <span>{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default function Layout() {
  const { sidebarOpen } = useStore()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setIsMobile(w < 768); setIsTablet(w >= 768 && w < 1024)
      if (w >= 768) setMobileSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => setMobileSidebarOpen(false), [location.pathname])

  const getSidebarClass = () => {
    if (isMobile) return `app-sidebar${mobileSidebarOpen ? ' open' : ''}`
    if (isTablet) return `app-sidebar${sidebarOpen ? ' open' : ''}`
    return `app-sidebar${!sidebarOpen ? ' collapsed' : ''}`
  }
  const getMainClass = () => {
    if (isMobile) return 'app-main'
    if (isTablet) return `app-main${sidebarOpen ? ' sidebar-open' : ''}`
    return `app-main${!sidebarOpen ? ' sidebar-collapsed' : ''}`
  }

  return (
    <div className="app-shell">
      <Header onMobileMenuClick={() => setMobileSidebarOpen(p => !p)} isMobile={isMobile} />
      <div className="app-body">
        <Sidebar className={getSidebarClass()} sidebarOpen={isMobile ? mobileSidebarOpen : sidebarOpen} isMobile={isMobile} />
        <div className={`sidebar-overlay${isMobile && mobileSidebarOpen ? ' visible' : ''}`} onClick={() => setMobileSidebarOpen(false)} />
        <main className={getMainClass()}><Outlet /></main>
      </div>
      <BottomNav />
    </div>
  )
}
