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
    { label:'HOME', icon:'🏠', path:'/' },
    { label:'CASINO', icon:'🎰', path:'/lobby' },
    { label:'IN-PLAY', icon:'🏏', path:'live', action:'inplay' },
    { label:'OPEN BETS', icon:'📋', path:'/dashboard' },
    { label:'ACCOUNT', icon:'👤', path: user ? '/dashboard' : '/login' },
  ]

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner" style={{ display:'flex', height:'100%' }}>
        {tabs.map((tab, i) => {
          const isCenter = i === 2
          const active = p === tab.path || (tab.path === '/lobby' && p.startsWith('/lobby')) || (tab.path === '/live-casino' && p.startsWith('/live-casino'))
          if (isCenter) return (
            <button key={i} className="bnav-center-btn" onClick={() => navigate('/live-casino')}>
              <div className="bnav-center-circle" style={{ fontSize:'18px' }}>{tab.icon}</div>
              <span className="bnav-center-label">{tab.label}</span>
            </button>
          )
          return (
            <button key={i} className={`bnav-item${active?' active':''}`} onClick={() => navigate(tab.path)}>
              <span style={{ fontSize:'19px', lineHeight:1 }}>{tab.icon}</span>
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
      setIsMobile(w < 768); setIsTablet(w >= 768 && w < 1024)
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
