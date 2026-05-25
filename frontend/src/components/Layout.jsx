import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import Header from './Header'
import Sidebar from './Sidebar'
import AuthModal from './AuthModal'

function BottomNav({ onLoginClick, onSignupClick }) {
  const { user } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const p = location.pathname

  const tabs = [
    { label:'HOME', path:'/',
      icon: (active) => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill={active?'#fff':'#666'}>
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          <text x="12" y="17" textAnchor="middle" fontSize="6" fontWeight="900" fill={active?'#222':'#999'} fontFamily="Arial">n</text>
        </svg>
      )
    },
    { label:'CASINO', path:'/lobby',
      icon: (active) => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active?'#fff':'#666'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          {/* 3 playing cards fanned */}
          <rect x="9" y="5" width="11" height="15" rx="2" transform="rotate(10 9 5)" fill={active?'#fff':'#666'} stroke="none" opacity="0.3"/>
          <rect x="5" y="4" width="11" height="15" rx="2" fill={active?'#555':'#333'} stroke={active?'#fff':'#666'}/>
          <path d="M10 9 L10 15 M8 12 L12 12" stroke={active?'#fff':'#666'} strokeWidth="1.5"/>
          <path d="M8.5 8.5 L8.5 9.5" stroke={active?'#fff':'#666'} strokeWidth="1.5"/>
          <path d="M8.5 14.5 L8.5 15.5" stroke={active?'#fff':'#666'} strokeWidth="1.5"/>
          {/* Heart */}
          <path d="M14 10.5 C14 9.5 15.5 8.5 16 10 C16.5 8.5 18 9.5 18 10.5 C18 12 16 13.5 16 13.5 C16 13.5 14 12 14 10.5Z" fill={active?'#fff':'#666'} stroke="none"/>
        </svg>
      )
    },
    { label:'IN-PLAY', path:'/live-casino', isCenter:true,
      icon: () => (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
          <polygon points="6,3 21,12 6,21"/>
        </svg>
      )
    },
    { label:'OPEN BETS', path:'/dashboard',
      icon: (active) => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          {/* Cricket ball */}
          <circle cx="12" cy="12" r="9" stroke={active?'#fff':'#666'} strokeWidth="1.8"/>
          {/* Vertical seam */}
          <path d="M12 3 C9 6 9 10 12 12 C15 14 15 18 12 21" stroke={active?'#fff':'#666'} strokeWidth="1.5" fill="none"/>
          {/* Stitch lines */}
          <path d="M9 7 C10 6.5 11 7 12 7" stroke={active?'#fff':'#666'} strokeWidth="1.2" fill="none"/>
          <path d="M9 9 C10 8.5 11 9 12 9" stroke={active?'#fff':'#666'} strokeWidth="1.2" fill="none"/>
          <path d="M12 15 C13 14.5 14 15 15 15" stroke={active?'#fff':'#666'} strokeWidth="1.2" fill="none"/>
          <path d="M12 17 C13 16.5 14 17 15 17" stroke={active?'#fff':'#666'} strokeWidth="1.2" fill="none"/>
        </svg>
      )
    },
    { label:'ACCOUNT', path: user?'/account':null,
      icon: (active) => (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={active?'#fff':'#666'} strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="9" r="3.5"/>
          <path d="M5.5 20 C6.5 16.5 9 14.5 12 14.5 C15 14.5 17.5 16.5 18.5 20" strokeLinecap="round"/>
        </svg>
      )
    },
  ]

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner" style={{ display:'flex', height:'100%' }}>
        {tabs.map((tab, i) => {
          const active = p === tab.path
          if (tab.isCenter) return (
            <button key={i} className="bnav-center-btn" onClick={() => navigate(tab.path)}>
              <div className="bnav-center-circle">{tab.icon()}</div>
              <span className="bnav-center-label">{tab.label}</span>
            </button>
          )
          return (
            <button key={i} className={`bnav-item${active?' active':''}`}
              onClick={() => {
                if (tab.label==='ACCOUNT' && !user) { onLoginClick(); return }
                navigate(tab.path)
              }}>
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
  const { sidebarOpen, user } = useStore()
  const location = useLocation()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1024)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [authModal, setAuthModal] = useState(null) // 'login' | 'signup' | null

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      setIsMobile(w < 768); setIsTablet(w >= 768 && w < 1024)
      if (w >= 768) setMobileSidebarOpen(false)
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => { setMobileSidebarOpen(false) }, [location.pathname])

  useEffect(() => {
    const handler = (e) => setAuthModal(e.detail?.mode || 'login')
    window.addEventListener('open-auth-modal', handler)
    return () => window.removeEventListener('open-auth-modal', handler)
  }, [])

  const getSidebarClass = () => {
    if (isMobile) return `app-sidebar${mobileSidebarOpen?' open':''}`
    if (isTablet) return `app-sidebar${sidebarOpen?' open':''}`
    return `app-sidebar${!sidebarOpen?' collapsed':''}`
  }

  const getMainClass = () => {
    if (isMobile) return 'app-main'
    if (isTablet) return `app-main${sidebarOpen?' sidebar-open':''}`
    return `app-main${!sidebarOpen?' sidebar-collapsed':''}`
  }

  return (
    <div className="app-shell">
      <Header
        onMobileMenuClick={() => setMobileSidebarOpen(p=>!p)}
        isMobile={isMobile}
        onLoginClick={() => setAuthModal('login')}
        onSignupClick={() => setAuthModal('signup')}
      />
      <div className="app-body">
        <Sidebar className={getSidebarClass()} sidebarOpen={isMobile?mobileSidebarOpen:sidebarOpen} isMobile={isMobile} />
        <div className={`sidebar-overlay${isMobile&&mobileSidebarOpen?' visible':''}`} onClick={()=>setMobileSidebarOpen(false)} />
        <main className={getMainClass()}><Outlet /></main>
      </div>
      <BottomNav onLoginClick={()=>setAuthModal('login')} onSignupClick={()=>setAuthModal('signup')} />

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={() => setAuthModal(authModal==='login'?'signup':'login')}
        />
      )}
    </div>
  )
}
