import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

/* ── Banners ── */
const BANNERS = [
  { bg:'linear-gradient(135deg,#0a0020,#1a0040)', accent:'#9944ff', tag:'TRENDING', title:'Aviator', sub:'Crash & Win — Up to 100x', icon:'✈️', btn:'Play Now', path:'/games/aviator' },
  { bg:'linear-gradient(135deg,#001a00,#003a10)', accent:'#00d084', tag:'GREY GAMING', title:'GreyJet Live', sub:'The Ultimate Crash Game', icon:'🚀', btn:'Play Now', path:'/games/crash-rocket' },
  { bg:'linear-gradient(135deg,#1a0000,#3a0010)', accent:'#ff4444', tag:'LIVE NOW 🔴', title:'Live Cricket Betting', sub:'IPL • T20 • PSL • Real Money', icon:'🏏', btn:'Bet Now', action:'cricket' },
  { bg:'linear-gradient(135deg,#100a00,#2a1800)', accent:'#ff9900', tag:'HOT', title:'Guess It Right', sub:'Turn Picks Into Prizes!', icon:'💰', btn:'Join Now', action:'cricket' },
  { bg:'linear-gradient(135deg,#0a1020,#102040)', accent:'#4488ff', tag:'POPULAR', title:'Teen Patti', sub:"India's Favourite Card Game", icon:'♠️', btn:'Play Now', path:'/games/teen-patti' },
  { bg:'linear-gradient(135deg,#001520,#002a40)', accent:'#00ccff', tag:'NEW', title:'Sportsbook', sub:'All Sports • Live Odds', icon:'🎯', btn:'Bet Now', action:'cricket' },
]

/* ── 6 Categories with exact Mahaling777-style SVG icons ── */
const CATEGORIES = [
  {
    label:'IN-PLAY', badge:null, action:'cricket',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* Basketball/ball with LIVE text — like Mahaling777 */}
        <circle cx="22" cy="22" r="18" stroke="white" strokeWidth="2.2"/>
        <circle cx="22" cy="22" r="12" stroke="white" strokeWidth="1.8"/>
        {/* LIVE text in center */}
        <rect x="10" y="17" width="24" height="10" rx="2" fill="white" opacity="0.15"/>
        <text x="22" y="24.5" textAnchor="middle" fontSize="7" fontWeight="900" fill="white" fontFamily="Arial,sans-serif" letterSpacing="0.5">LIVE</text>
        {/* Arc lines like basketball */}
        <path d="M8 22 Q22 14 36 22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
        <path d="M8 22 Q22 30 36 22" stroke="white" strokeWidth="1.5" fill="none" opacity="0.6"/>
      </svg>
    )
  },
  {
    label:'SPORTSBOOK', badge:null, action:'cricket',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* Ticket/coupon shape */}
        <rect x="5" y="10" width="34" height="24" rx="3" stroke="white" strokeWidth="2.2"/>
        {/* Notch left */}
        <path d="M5 19 Q11 19 11 22 Q11 25 5 25" stroke="white" strokeWidth="2" fill="none"/>
        {/* Notch right */}
        <path d="M39 19 Q33 19 33 22 Q33 25 39 25" stroke="white" strokeWidth="2" fill="none"/>
        {/* Cricket ball in center */}
        <circle cx="22" cy="22" r="7" stroke="white" strokeWidth="1.8"/>
        <path d="M17 19 Q22 16 27 19" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M17 25 Q22 28 27 25" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <line x1="22" y1="15" x2="22" y2="29" stroke="white" strokeWidth="1.2"/>
      </svg>
    )
  },
  {
    label:'VIRTUAL', badge:null, path:'/live-casino',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* Hand with pointer finger — like Mahaling777 virtual icon */}
        <path d="M22 8 L22 18" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        {/* Horizontal bars at top */}
        <path d="M16 11 L22 8 L28 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        {/* Hand/pointer */}
        <path d="M22 18 L22 30" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M16 22 L22 18 L28 22" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Finger tip */}
        <circle cx="22" cy="30" r="2.5" fill="white"/>
        {/* Touch ripples */}
        <path d="M16 34 Q22 31 28 34" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M13 37 Q22 33 31 37" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>
      </svg>
    )
  },
  {
    label:'E-SPORTS', badge:'NEW', path:'/e-sports',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* Gamepad body */}
        <rect x="4" y="14" width="36" height="20" rx="6" stroke="white" strokeWidth="2.2"/>
        {/* D-pad left side */}
        <line x1="13" y1="24" x2="19" y2="24" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        <line x1="16" y1="21" x2="16" y2="27" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
        {/* Buttons right side */}
        <circle cx="28" cy="21" r="2" fill="white"/>
        <circle cx="33" cy="24" r="2" fill="white"/>
        <circle cx="28" cy="27" r="2" fill="white"/>
        <circle cx="23" cy="24" r="2" fill="white"/>
        {/* Cable top */}
        <path d="M16 14 L16 9 L28 9 L28 14" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label:'SPECIAL MARKET', badge:'NEW', action:'cricket',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* Medal/award shape */}
        <circle cx="22" cy="26" r="12" stroke="white" strokeWidth="2.2"/>
        {/* Star inside */}
        <path d="M22 18 L23.8 23.5 L29.5 23.5 L25 27 L26.8 32.5 L22 29 L17.2 32.5 L19 27 L14.5 23.5 L20.2 23.5 Z" fill="white" opacity="0.9"/>
        {/* Ribbon left */}
        <path d="M16 16 L12 6 L18 10 L22 6" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round"/>
        {/* Ribbon right */}
        <path d="M28 16 L32 6 L26 10 L22 6" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label:'PLAYER BATTLE', badge:null, path:'/player-battle',
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        {/* Two fists facing each other — exactly like Mahaling777 */}
        {/* Left fist */}
        <rect x="4" y="18" width="14" height="10" rx="3" stroke="white" strokeWidth="2"/>
        <rect x="6" y="14" width="10" height="6" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="9" y1="14" x2="9" y2="18" stroke="white" strokeWidth="1.5"/>
        <line x1="12" y1="14" x2="12" y2="18" stroke="white" strokeWidth="1.5"/>
        <line x1="15" y1="14" x2="15" y2="18" stroke="white" strokeWidth="1.5"/>
        {/* Right fist (mirrored) */}
        <rect x="26" y="18" width="14" height="10" rx="3" stroke="white" strokeWidth="2"/>
        <rect x="28" y="14" width="10" height="6" rx="2" stroke="white" strokeWidth="1.8"/>
        <line x1="31" y1="14" x2="31" y2="18" stroke="white" strokeWidth="1.5"/>
        <line x1="34" y1="14" x2="34" y2="18" stroke="white" strokeWidth="1.5"/>
        <line x1="37" y1="14" x2="37" y2="18" stroke="white" strokeWidth="1.5"/>
        {/* Impact lines in middle */}
        <path d="M20 20 L24 20" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M21 17 L23 15" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M21 23 L23 25" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    )
  },
]

const ROW_TAGS = [
  '🔥 Trending', '🎰 Casino Games', '⭐ Recommended',
  '🏆 Top Rated', '♠️ Card Games', '🎯 Popular Picks',
  '💥 Crash Games', '🎲 Table Games',
]

/* ── Banner slider ── */
function BannerSlider({ onLaunch, launching }) {
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i+1) % BANNERS.length), 4000)
    return () => clearInterval(timer.current)
  }, [])

  const b = BANNERS[idx]
  const handleBtn = () => { if (b.action === 'cricket') onLaunch(); else if (b.path) navigate(b.path) }

  return (
    <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:'12px', overflow:'hidden', marginBottom:'14px', background:b.bg, transition:'background 0.5s', minHeight:'200px' }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 75% 50%, ${b.accent}30 0%, transparent 65%)` }} />
      <div style={{ position:'absolute', right:'-3%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(70px,22vw,160px)', opacity:0.1, userSelect:'none', pointerEvents:'none' }}>{b.icon}</div>
      <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', padding:'clamp(14px,5vw,48px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'7px' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:b.accent, display:'inline-block', animation:'pulse-live 1.4s infinite' }} />
          <span style={{ fontSize:'clamp(9px,2vw,11px)', color:b.accent, fontWeight:'800', letterSpacing:'2.5px', textTransform:'uppercase' }}>{b.tag}</span>
        </div>
        <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(18px,5.5vw,48px)', color:'white', lineHeight:1.1, marginBottom:'5px', textShadow:'0 2px 16px rgba(0,0,0,0.6)', fontWeight:'900' }}>{b.title}</h2>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'clamp(10px,2.2vw,15px)', marginBottom:'clamp(12px,3vw,24px)', maxWidth:'65%' }}>{b.sub}</p>
        <button onClick={handleBtn} disabled={launching} style={{ alignSelf:'flex-start', padding:'clamp(8px,2vw,14px) clamp(16px,4vw,32px)', background:`linear-gradient(135deg,${b.accent}cc,${b.accent})`, border:'none', borderRadius:'8px', color:'#fff', fontWeight:'800', fontSize:'clamp(11px,2.2vw,15px)', cursor:'pointer', boxShadow:`0 4px 18px ${b.accent}55`, whiteSpace:'nowrap' }}>
          {launching ? '⏳ Loading...' : `${b.btn} →`}
        </button>
      </div>
      {/* Dots */}
      <div className="banner-dots">
        {BANNERS.map((_,i) => (
          <button key={i} className={`banner-dot${i===idx?' active':''}`} onClick={() => { setIdx(i); clearInterval(timer.current); timer.current=setInterval(()=>setIdx(j=>(j+1)%BANNERS.length),4000) }} />
        ))}
      </div>
    </div>
  )
}

/* ── Static horizontal scroll (no auto-loop) ── */
function StaticRow({ games, onPlay, launchingGame, rowRef }) {
  const scroll = (dir) => { if (rowRef?.current) rowRef.current.scrollBy({ left: dir * 300, behavior:'smooth' }) }
  // expose scroll via ref
  React.useImperativeHandle && void 0
  return (
    <div style={{ position:'relative' }}>
      <div ref={rowRef} className="hscroll" style={{ gap:'10px' }}>
        {games.map((g, i) => {
          const busy = launchingGame === g.game_uid
          return (
            <div key={i} className="game-card" onClick={() => !busy && onPlay(g)} style={{ opacity: busy ? 0.6 : 1, cursor: busy ? 'wait' : 'pointer' }}>
              {g.img
                ? <img src={g.img} alt={g.name} className="game-card-thumb" onError={e => { e.target.style.display='none'; e.target.nextSibling && (e.target.nextSibling.style.display='flex') }} />
                : null
              }
              <div className="game-card-thumb-placeholder" style={{ background:'#1a1a2a', fontSize:'28px', display: g.img ? 'none' : 'flex' }}>🎰</div>
              <div className="game-card-name">{busy ? '⏳' : g.name}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ArrowBtns({ rowRef }) {
  const scroll = (dir) => { if (rowRef?.current) rowRef.current.scrollBy({ left: dir * 300, behavior:'smooth' }) }
  const btnStyle = {
    width:'32px', height:'32px', borderRadius:'8px',
    background:'#2a2a3a', border:'1px solid rgba(255,255,255,0.12)',
    color:'white', fontSize:'18px', cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontWeight:'700', lineHeight:1,
  }
  return (
    <div style={{ display:'flex', gap:'6px' }}>
      <button style={btnStyle} onClick={() => scroll(-1)}>‹</button>
      <button style={btnStyle} onClick={() => scroll(1)}>›</button>
    </div>
  )
}

function GameRow({ row, idx, onPlay, launchingGame }) {
  const rowRef = useRef(null)
  const tag = ROW_TAGS[idx] || '🎮 Games'
  return (
    <section style={{ marginBottom:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
          <span style={{ fontSize:'13px', fontWeight:'800', color:'#fff', textTransform:'uppercase', letterSpacing:'0.5px' }}>{tag}</span>
          {idx === 0 && <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 6px', borderRadius:'3px', background:'rgba(224,48,48,0.18)', color:'#e03030', border:'1px solid rgba(224,48,48,0.3)' }}>HOT</span>}
          {idx === 1 && <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 6px', borderRadius:'3px', background:'rgba(68,136,255,0.18)', color:'#4488ff', border:'1px solid rgba(68,136,255,0.3)' }}>LIVE</span>}
        </div>
        <div style={{ display:'flex', gap:'5px' }}>
          <button onClick={() => rowRef.current?.scrollBy({ left:-300, behavior:'smooth' })}
            style={{ width:'28px', height:'28px', borderRadius:'6px', background:'#222', border:'1px solid #333', color:'#ccc', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>‹</button>
          <button onClick={() => rowRef.current?.scrollBy({ left:300, behavior:'smooth' })}
            style={{ width:'28px', height:'28px', borderRadius:'6px', background:'#222', border:'1px solid #333', color:'#ccc', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>›</button>
        </div>
      </div>
      <StaticRow games={row} onPlay={onPlay} launchingGame={launchingGame} rowRef={rowRef} />
    </section>
  )
}

export default function Home() {
  const { user, balance } = useStore()
  const navigate = useNavigate()
  const [launching, setLaunching] = useState(false)
  const [launchingGame, setLaunchingGame] = useState(null)
  const [modal, setModal] = useState(null)
  const [liveGames, setLiveGames] = useState([])

  useEffect(() => {
    api.get('/live-casino/games').then(r => setLiveGames(r.data.games || [])).catch(() => {})
  }, [])

  const rows = []
  for (let i = 0; i < liveGames.length; i += 15) rows.push(liveGames.slice(i, i+15))

  async function launchCricket() {
    if (!user) { toast.error('Login karein pehle!'); navigate('/login'); return }
    setLaunching(true)
    try {
      const res = await api.post('/live-casino/launch', { game_uid:'7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunching(false)
  }

  async function launchGame(g) {
    if (!user) { toast.error('Login karein pehle!'); navigate('/login'); return }
    setLaunchingGame(g.game_uid)
    try {
      const res = await api.post('/live-casino/launch', { game_uid: g.game_uid || '7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunchingGame(null)
  }

  const handleCat = (cat) => {
    if (cat.action === 'cricket') launchCricket()
    else if (cat.path) navigate(cat.path)
  }

  return (
    <div style={{ maxWidth:'1400px', margin:'0 auto' }}>

      {/* MODAL */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:9999, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0a0a0f', flexShrink:0, borderBottom:'1px solid rgba(34,139,34,0.3)' }}>
            <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'16px', color:'#4caf50' }}>SIGMA<span style={{ color:'#ffe066' }}>777</span></span>
            <button onClick={() => setModal(null)} style={{ padding:'7px 18px', background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.4)', borderRadius:'8px', color:'#ff6666', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>✕ Exit</button>
          </div>
          <iframe src={modal} style={{ flex:1, border:'none' }} allow="autoplay; fullscreen" title="Live Game" />
        </div>
      )}

      {/* QUICK TABS — Mahaling777 style horizontal scroll below header */}
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'10px', marginBottom:'2px', scrollbarWidth:'none', marginLeft:'-12px', marginRight:'-12px', paddingLeft:'12px', paddingRight:'12px' }}>
        {[
          { icon:'✈️', label:'Aviator', path:'/games/aviator' },
          { icon:'🎮', label:'Grey Gaming', action:'cricket' },
          { icon:'🏏', label:'Live Cricket', action:'cricket' },
          { icon:'⚽', label:'E-Soccer', path:'/e-sports' },
          { icon:'🎰', label:'Live Casino', path:'/live-casino' },
          { icon:'♠️', label:'Teen Patti', path:'/games/teen-patti' },
          { icon:'🚀', label:'Crash Games', path:'/games/crash-rocket' },
          { icon:'💎', label:'Mines', path:'/games/mines' },
        ].map((tab, i) => (
          <button key={i} onClick={() => tab.action === 'cricket' ? launchCricket() : navigate(tab.path)}
            style={{ flexShrink:0, display:'flex', alignItems:'center', gap:'5px', padding:'5px 12px', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'20px', color:'#ccc', fontSize:'11px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.background='#222'; e.currentTarget.style.borderColor='#3a3a3a' }}
            onMouseLeave={e => { e.currentTarget.style.background='#1a1a1a'; e.currentTarget.style.borderColor='#2a2a2a' }}
          >
            <span style={{ fontSize:'13px' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* BANNER */}
      <BannerSlider onLaunch={launchCricket} launching={launching} />

      {/* 6 CATEGORY GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'18px' }}>
        {CATEGORIES.map((cat, i) => (
          <button key={i} onClick={() => handleCat(cat)} style={{ position:'relative', background:'#181818', border:'1px solid #2a2a2a', borderRadius:'12px', padding:'18px 8px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', cursor:'pointer', transition:'all 0.2s', overflow:'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.background='#222'; e.currentTarget.style.borderColor='#3a3a3a' }}
            onMouseLeave={e => { e.currentTarget.style.background='#181818'; e.currentTarget.style.borderColor='#2a2a2a' }}
          >
            {cat.badge && (
              <div style={{ position:'absolute', top:0, right:0, background:'#e03030', color:'#fff', fontSize:'8px', fontWeight:'900', padding:'3px 8px 3px 12px', borderBottomLeftRadius:'10px', letterSpacing:'0.5px' }}>NEW</div>
            )}
            {/* Icon */}
            <div style={{ width:'52px', height:'52px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              {cat.icon}
            </div>
            {/* Label */}
            <div style={{ fontSize:'clamp(9px,2.5vw,11px)', fontWeight:'800', color:'#ffffff', textAlign:'center', lineHeight:1.2, letterSpacing:'0.5px' }}>{cat.label}</div>
          </button>
        ))}
      </div>

      {/* LIVE CASINO GAME ROWS — from API */}
      {liveGames.length === 0 && (
        <div style={{ height:'120px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:'13px' }}>⏳ Loading games...</div>
      )}

      {rows.map((row, idx) => (
        <GameRow key={idx} row={row} idx={idx} onPlay={launchGame} launchingGame={launchingGame} />
      ))}

      {/* LIVE SPORTS EMBED */}
      {user && <LiveSportsEmbed />}

      {/* GUEST CTA */}
      {!user && (
        <div style={{ textAlign:'center', padding:'28px 16px', background:'rgba(34,139,34,0.05)', borderRadius:'14px', border:'1px solid rgba(34,139,34,0.15)', marginBottom:'16px' }}>
          <div style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'clamp(22px,6vw,36px)', marginBottom:'6px', color:'#4caf50' }}>SIGMA<span style={{ color:'#ffe066' }}>777</span></div>
          <p style={{ color:'var(--text-secondary)', fontSize:'13px', marginBottom:'18px' }}>248+ Live Games • Instant Payouts • 24/7 Support</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
            <Link to="/signup"><button style={{ padding:'11px 24px', background:'linear-gradient(135deg,#1e7d32,#4caf50)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'800', fontSize:'14px', cursor:'pointer' }}>🎁 Get 1000 Free Coins</button></Link>
            <Link to="/login"><button style={{ padding:'11px 24px', background:'transparent', border:'1px solid #333', borderRadius:'8px', color:'#aaa', cursor:'pointer', fontSize:'14px' }}>Login</button></Link>
          </div>
        </div>
      )}
    </div>
  )
}

function LiveSportsEmbed() {
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState(false)
  useEffect(() => {
    api.post('/live-casino/launch', { game_uid:'7004', language:'hi', currency_code:'INR' })
      .then(r => { if (r.data.success && r.data.gameUrl) setUrl(r.data.gameUrl); else setErr(true); setLoading(false) })
      .catch(() => { setErr(true); setLoading(false) })
  }, [])
  if (err || !url) return null
  if (loading) return <div style={{ height:'160px', background:'var(--bg-card)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:'13px', marginBottom:'18px' }}>⏳ Loading...</div>
  return (
    <section style={{ marginBottom:'18px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:'#ff4444', display:'inline-block', animation:'pulse-live 1.4s infinite' }} />
        <span style={{ fontSize:'14px', fontWeight:'800', color:'#fff' }}>🏏 LIVE SPORTS BETTING</span>
        <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 7px', borderRadius:'3px', background:'rgba(224,48,48,0.18)', color:'#e03030', border:'1px solid rgba(224,48,48,0.3)' }}>LIVE</span>
      </div>
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(34,139,34,0.2)' }}>
        <iframe src={url} style={{ width:'100%', height:'400px', border:'none', display:'block' }} allow="autoplay; fullscreen" title="Live Sports" />
      </div>
    </section>
  )
}
