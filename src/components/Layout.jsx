import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Header from './Header'
import Sidebar from './Sidebar'

function BottomNav() {
  const { user } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const p = location.pathname

  const items = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: 'HOME', path: '/' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, label: 'CASINO', path: '/lobby' },
  ]
  const rightItems = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>, label: 'IN-PLAY', path: '/live-casino' },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>, label: 'ACCOUNT', path: user ? '/dashboard' : '/login' },
  ]

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {items.map(it => (
          <button key={it.path} className={`bnav-item${p === it.path ? ' active' : ''}`} onClick={() => navigate(it.path)}>
            {it.icon}
            <span>{it.label}</span>
          </button>
        ))}
        {/* Center play button */}
        <button className="bnav-center-btn" onClick={() => navigate('/lobby')}>
          <div className="bnav-center-circle">🎮</div>
          <span className="bnav-center-label">PLAY</span>
        </button>
        {rightItems.map(it => (
          <button key={it.path} className={`bnav-item${p === it.path ? ' active' : ''}`} onClick={() => navigate(it.path)}>
            {it.icon}
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
      setIsMobile(w < 768)
      setIsTablet(w >= 768 && w < 1024)
      if (w >= 768) setMobileSidebarOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => { setMobileSidebarOpen(false) }, [location.pathname])

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
