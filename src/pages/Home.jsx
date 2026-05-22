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
    label:'IN-PLAY', badge:null, action:'cricket', color:'#cccccc',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="15" stroke="white" strokeWidth="2"/>
        <circle cx="18" cy="18" r="11" stroke="white" strokeWidth="1.5"/>
        <text x="18" y="16" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="white" fontFamily="Arial">LIVE</text>
        <path d="M12 21 Q18 24 24 21" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label:'SPORTSBOOK', badge:null, action:'cricket', color:'#cccccc',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="6" y="8" width="24" height="20" rx="3" stroke="white" strokeWidth="2"/>
        <circle cx="18" cy="18" r="7" stroke="white" strokeWidth="1.5"/>
        <line x1="18" y1="11" x2="18" y2="25" stroke="white" strokeWidth="1.5"/>
        <line x1="11" y1="18" x2="25" y2="18" stroke="white" strokeWidth="1.5"/>
        <path d="M13 13 L23 23 M23 13 L13 23" stroke="white" strokeWidth="1" opacity="0.5"/>
      </svg>
    )
  },
  {
    label:'VIRTUAL', badge:null, path:'/live-casino', color:'#cccccc',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 6 L18 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="18" cy="18" r="4" fill="white"/>
        <path d="M10 10 L14 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 10 L22 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M6 18 L14 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M30 18 L22 18" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M10 26 L14 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M26 26 L22 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <path d="M18 30 L18 22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label:'E-SPORTS', badge:'NEW', path:'/e-sports', color:'#cccccc',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="12" width="28" height="16" rx="4" stroke="white" strokeWidth="2"/>
        <line x1="12" y1="20" x2="16" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="18" x2="14" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="23" cy="19" r="1.5" fill="white"/>
        <circle cx="23" cy="23" r="1.5" fill="white"/>
        <path d="M12 8 L24 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )
  },
  {
    label:'SPECIAL MARKET', badge:'NEW', action:'cricket', color:'#cccccc',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4 L20 14 L30 14 L22 20 L25 30 L18 24 L11 30 L14 20 L6 14 L16 14 Z" stroke="white" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      </svg>
    )
  },
  {
    label:'PLAYER BATTLE', badge:null, path:'/player-battle', color:'#cccccc',
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M8 14 C8 10 12 8 16 10 L18 12 L20 10 C24 8 28 10 28 14 C28 20 18 28 18 28 C18 28 8 20 8 14Z" stroke="white" strokeWidth="2" fill="none"/>
        <path d="M14 14 L18 18 L22 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  },
]

/* ── Featured games ── */
const FEATURED = [
  { name:'Aviator', path:'/games/aviator', icon:'✈️', color:'#ff4444', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/aviator_nw6vp5.mp4', badge:'HOT' },
  { name:'Crash Rocket', path:'/games/crash-rocket', icon:'🚀', color:'#9944ff', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/Mobile_run_o48kbe.mp4', badge:'HOT' },
  { name:'Color Prediction', path:'/games/color-prediction', icon:'🎨', color:'#ff4488', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066669/colour_prediction_nfxrqp.mp4', badge:'NEW' },
  { name:'Chicken Road', path:'/games/chicken-road', icon:'🐔', color:'#ff9900', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066669/chicken_road_i61thh.mp4', badge:'NEW' },
  { name:'Mines', path:'/games/mines', icon:'💎', color:'#00d084', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/mines_xsbshb.mp4' },
  { name:'Dragon Tiger', path:'/games/dragon-tiger', icon:'🐉', color:'#ff4444' },
]

/* ── Static live casino games (no auto-loop) ── */
const TRENDING_ROWS = [
  {
    label:'🔥 Trending',
    games: [
      { name:'Kickoff Roulette', icon:'🎡', color:'#1a3a1a', uid:'7004' },
      { name:'Vortex Aero', icon:'✈️', color:'#1a1a3a', uid:'7004' },
      { name:'Fortune Garuda 500', icon:'🦅', color:'#3a2a00', uid:'7004' },
      { name:'Teen Patti Gold', icon:'♠️', color:'#3a0000', uid:'7004' },
      { name:'Aviator', icon:'✈️', color:'#2a0020', uid:'7004' },
      { name:'Dragon Tiger', icon:'🐉', color:'#2a0000', uid:'7004' },
      { name:'Lightning Roulette', icon:'⚡', color:'#1a1a00', uid:'7004' },
    ]
  },
  {
    label:'🎰 Roulette',
    games: [
      { name:'Roulette A', icon:'🎡', color:'#1a003a', uid:'7004' },
      { name:'Speed Roulette', icon:'🎡', color:'#002a3a', uid:'7004' },
      { name:'Kickoff Roulette', icon:'⚽', color:'#003a1a', uid:'7004' },
      { name:'Lightning Roulette', icon:'⚡', color:'#1a1a00', uid:'7004' },
      { name:'Immersive Roulette', icon:'🎮', color:'#2a002a', uid:'7004' },
    ]
  },
  {
    label:'♠️ Teen Patti',
    games: [
      { name:'Teen Patti Gold', icon:'♠️', color:'#3a0000', uid:'7004' },
      { name:'AK47 Teen Patti', icon:'🔫', color:'#1a1a00', uid:'7004' },
      { name:'Teen Patti Joker', icon:'🃏', color:'#001a3a', uid:'7004' },
      { name:'3 Patti Bonus', icon:'🎁', color:'#003a00', uid:'7004' },
    ]
  },
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
    <div style={{ position:'relative', width:'100%', aspectRatio:'2.2/1', borderRadius:'12px', overflow:'hidden', marginBottom:'14px', background:b.bg, transition:'background 0.5s', minHeight:'140px' }}>
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
function StaticRow({ games, onPlay }) {
  const ref = useRef(null)
  const scroll = (dir) => { if (ref.current) ref.current.scrollBy({ left: dir * 280, behavior:'smooth' }) }
  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => scroll(-1)} style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', zIndex:10, width:'28px', height:'28px', borderRadius:'50%', background:'rgba(30,30,40,0.9)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
      <div ref={ref} className="hscroll" style={{ paddingLeft:'34px', paddingRight:'34px' }}>
        {games.map((g, i) => (
          <div key={i} className="game-card" onClick={() => onPlay(g)}>
            <div className="game-card-thumb-placeholder" style={{ background:g.color, fontSize:'28px' }}>{g.icon}</div>
            <div className="game-card-name">{g.name}</div>
          </div>
        ))}
      </div>
      <button onClick={() => scroll(1)} style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', zIndex:10, width:'28px', height:'28px', borderRadius:'50%', background:'rgba(30,30,40,0.9)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
    </div>
  )
}

export default function Home() {
  const { user, balance } = useStore()
  const navigate = useNavigate()
  const [launching, setLaunching] = useState(false)
  const [modal, setModal] = useState(null)

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
    try {
      const res = await api.post('/live-casino/launch', { game_uid: g.uid || '7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
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

      {/* WELCOME */}
      {user && (
        <div style={{ padding:'9px 13px', background:'rgba(34,139,34,0.1)', border:'1px solid rgba(34,139,34,0.2)', borderRadius:'10px', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'10px', color:'var(--text-muted)', letterSpacing:'0.5px' }}>WELCOME BACK</div>
            <div style={{ fontSize:'15px', fontWeight:'700' }}>{user.username} 👑</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'10px', color:'var(--text-muted)' }}>BALANCE</div>
            <div style={{ color:'#4caf50', fontWeight:'800', fontSize:'16px' }}>🪙 {Number(balance||0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* BANNER */}
      <BannerSlider onLaunch={launchCricket} launching={launching} />

      {/* 6 CATEGORY GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'18px' }}>
        {CATEGORIES.map((cat, i) => (
          <button key={i} onClick={() => handleCat(cat)} style={{ position:'relative', background:'#1c1c28', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'12px', padding:'18px 8px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:'10px', cursor:'pointer', transition:'all 0.2s', overflow:'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.background='#252535'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background='#1c1c28'; e.currentTarget.style.borderColor='rgba(255,255,255,0.08)' }}
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

      {/* FEATURED — 3 col video */}
      <section style={{ marginBottom:'18px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
          <span style={{ fontSize:'14px', fontWeight:'800', color:'#fff', letterSpacing:'0.3px' }}>
            TRENDING
            <span style={{ marginLeft:'8px', fontSize:'9px', fontWeight:'800', padding:'2px 7px', borderRadius:'3px', background:'rgba(224,48,48,0.18)', color:'#e03030', border:'1px solid rgba(224,48,48,0.3)', textTransform:'uppercase' }}>HOT</span>
          </span>
          <div style={{ display:'flex', gap:'6px' }}>
            <button id="feat-prev" style={{ width:'26px', height:'26px', borderRadius:'5px', background:'#252535', border:'1px solid rgba(255,255,255,0.1)', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>‹</button>
            <button id="feat-next" style={{ width:'26px', height:'26px', borderRadius:'5px', background:'#252535', border:'1px solid rgba(255,255,255,0.1)', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>›</button>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {FEATURED.map((g,i) => (
            <Link key={i} to={g.path} style={{ textDecoration:'none' }}>
              <div style={{ aspectRatio:'4/3', background:`linear-gradient(135deg,${g.color}33,#12121a)`, borderRadius:'10px', overflow:'hidden', cursor:'pointer', transition:'transform 0.2s', position:'relative', border:'1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}
              >
                {g.video
                  ? <video src={g.video} autoPlay loop muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(22px,5vw,38px)' }}>{g.icon}</div>
                }
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'4px 8px', background:'linear-gradient(transparent,rgba(0,0,0,0.88))', fontSize:'clamp(9px,2vw,11px)', fontWeight:'700', color:'white', textTransform:'uppercase', letterSpacing:'0.3px' }}>{g.name}</div>
                {g.badge && <div style={{ position:'absolute', top:'4px', left:'4px', fontSize:'8px', fontWeight:'800', padding:'1px 5px', borderRadius:'3px', background:'rgba(224,48,48,0.9)', color:'#fff' }}>{g.badge}</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* STATIC LIVE CASINO ROWS */}
      {TRENDING_ROWS.map((row, idx) => (
        <section key={idx} style={{ marginBottom:'18px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
            <span style={{ fontSize:'14px', fontWeight:'800', color:'#fff' }}>{row.label}</span>
            <div style={{ display:'flex', gap:'6px' }}>
              <span style={{ fontSize:'11px', color:'var(--text-muted)', cursor:'pointer' }}>View All →</span>
            </div>
          </div>
          <StaticRow games={row.games} onPlay={launchGame} />
        </section>
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
