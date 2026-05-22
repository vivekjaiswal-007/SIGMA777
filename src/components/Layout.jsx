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

  const tabs = [
    {
      label:'HOME', path:'/',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active?'#4caf50':'none'} stroke={active?'#4caf50':'#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      label:'CASINO', path:'/lobby',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?'#4caf50':'#888'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h4v4H4zM10 4h4v4h-4zM16 4h4v4h-4z"/>
          <path d="M7 8v2M12 8v2M17 8v2"/>
          <path d="M5 14h14"/>
          <path d="M5 14l1 6h12l1-6"/>
          <circle cx="9" cy="17" r="1" fill={active?'#4caf50':'#888'}/>
          <circle cx="15" cy="17" r="1" fill={active?'#4caf50':'#888'}/>
        </svg>
      )
    },
    {
      label:'IN-PLAY', path:'/live-casino', isCenter: true,
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active?'#fff':'#fff'} stroke="none">
          <polygon points="6,3 20,12 6,21"/>
        </svg>
      )
    },
    {
      label:'OPEN BETS', path:'/dashboard',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?'#4caf50':'#888'} strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9"/>
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="3" x2="12" y2="7"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
          <line x1="3" y1="12" x2="7" y2="12"/>
          <line x1="17" y1="12" x2="21" y2="12"/>
        </svg>
      )
    },
    {
      label:'ACCOUNT', path: user ? '/account' : '/login',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active?'#4caf50':'#888'} strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
      )
    },
  ]

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner" style={{ display:'flex', height:'100%' }}>
        {tabs.map((tab, i) => {
          const active = p === tab.path || (tab.path === '/lobby' && p.startsWith('/lobby'))
          if (tab.isCenter) return (
            <button key={i} className="bnav-center-btn" onClick={() => navigate(tab.path)}>
              <div className="bnav-center-circle">{tab.icon(true)}</div>
              <span className="bnav-center-label">{tab.label}</span>
            </button>
          )
          return (
            <button key={i} className={`bnav-item${active?' active':''}`} onClick={() => navigate(tab.path)}>
              {tab.icon(active)}
              <span>{tab.label}</span>
            </button>
          )
        })}
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
    onResize()
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
