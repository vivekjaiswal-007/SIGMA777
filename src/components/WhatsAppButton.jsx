import React, { useState, useEffect, useRef } from 'react'

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const timer = useRef(null)

  const resetTimer = () => {
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2000)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
      resetTimer()
    }
    const handleTouch = () => resetTimer()
    const handleClick = () => resetTimer()

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('touchstart', handleTouch, { passive: true })
    window.addEventListener('click', handleClick)

    // Start initial timer
    timer.current = setTimeout(() => setVisible(false), 2000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouch)
      window.removeEventListener('click', handleClick)
      clearTimeout(timer.current)
    }
  }, [])

  if (!scrolled) return null

  return (
    <div
      onClick={resetTimer}
      style={{
        position: 'fixed',
        right: '14px',
        bottom: 'calc(var(--bottom-nav-h, 58px) + 16px)',
        zIndex: 999,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.7)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: visible ? 'auto' : 'none',
        cursor: 'pointer',
      }}
    >
      {/* Cricket ball icon like Mahaling777 */}
      <div style={{
        width: '46px',
        height: '46px',
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #cc3300, #8b0000)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Cricket ball seam lines */}
        <svg width="46" height="46" viewBox="0 0 46 46" style={{ position:'absolute', inset:0 }}>
          {/* Vertical seam */}
          <path d="M23 4 C18 10, 18 20, 23 23 C28 26, 28 36, 23 42" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
          {/* Horizontal stitch top */}
          <path d="M16 12 C19 10, 21 11, 23 12 C25 13, 27 12, 30 11" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
          <path d="M16 15 C19 13, 21 14, 23 15 C25 16, 27 15, 30 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
          {/* Horizontal stitch bottom */}
          <path d="M16 31 C19 29, 21 30, 23 31 C25 32, 27 31, 30 30" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
          <path d="M16 34 C19 32, 21 33, 23 34 C25 35, 27 34, 30 33" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none"/>
        </svg>
      </div>
    </div>
  )
}
