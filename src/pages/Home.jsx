import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

const BANNERS = [
  { bg:'linear-gradient(135deg,#0a0020 0%,#1a0040 50%,#0a0020 100%)', accent:'#9944ff', tag:'TRENDING', title:'Aviator', sub:'Crash & Win Big — Up to 100x Multiplier', icon:'✈️', btn:'Play Now', path:'/games/aviator' },
  { bg:'linear-gradient(135deg,#001a00 0%,#003a10 50%,#001a00 100%)', accent:'#00d084', tag:'GREY GAMING', title:'GreyJet Live', sub:'The Ultimate Crash Game Experience', icon:'🚀', btn:'Play Now', path:'/games/crash-rocket' },
  { bg:'linear-gradient(135deg,#1a0000 0%,#3a0010 50%,#1a0000 100%)', accent:'#ff4444', tag:'LIVE NOW 🔴', title:'Live Cricket Betting', sub:'IPL • T20 • PSL • Real Money', icon:'🏏', btn:'Bet Now', action:'cricket' },
  { bg:'linear-gradient(135deg,#0a1020 0%,#102040 50%,#0a1020 100%)', accent:'#4488ff', tag:'HOT', title:'Boxing — ONE BX', sub:'Live Fight Betting • Real Money', icon:'🥊', btn:'Bet Now', action:'cricket' },
  { bg:'linear-gradient(135deg,#1a1000 0%,#2a2000 50%,#1a1000 100%)', accent:'#ff9900', tag:'POPULAR', title:'Teen Patti', sub:"India's Favourite Card Game", icon:'♠️', btn:'Play Now', path:'/games/teen-patti' },
]

const CATEGORIES = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <text x="16" y="20" textAnchor="middle" fontSize="8" fontWeight="900" fill="currentColor">LIVE</text>
      </svg>
    ),
    iconEmoji: '📡',
    label: 'IN-PLAY', badge: null, action: 'cricket', color: '#e03030',
    desc: 'Live matches betting'
  },
  {
    iconEmoji: '🎯',
    label: 'SPORTSBOOK', badge: null, action: 'cricket', color: '#ff6b00',
    desc: 'All sports betting'
  },
  {
    iconEmoji: '🎮',
    label: 'VIRTUAL', badge: null, path: '/live-casino', color: '#4488ff',
    desc: 'Virtual games'
  },
  {
    iconEmoji: '🕹️',
    label: 'E-SPORTS', badge: 'NEW', path: '/e-sports', color: '#9944ff',
    desc: 'E-Cricket, E-Soccer'
  },
  {
    iconEmoji: '⭐',
    label: 'SPECIAL MARKET', badge: 'NEW', action: 'cricket', color: '#00d084',
    desc: 'Special odds'
  },
  {
    iconEmoji: '⚔️',
    label: 'PLAYER BATTLE', badge: null, path: '/player-battle', color: '#ff9900',
    desc: 'Coming soon'
  },
]

const FEATURED = [
  { name:'Aviator', path:'/games/aviator', icon:'✈️', color:'#ff4444', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/aviator_nw6vp5.mp4', badge:'HOT' },
  { name:'Crash Rocket', path:'/games/crash-rocket', icon:'🚀', color:'#9944ff', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/Mobile_run_o48kbe.mp4', badge:'HOT' },
  { name:'Color Prediction', path:'/games/color-prediction', icon:'🎨', color:'#ff4488', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066669/colour_prediction_nfxrqp.mp4', badge:'NEW' },
  { name:'Chicken Road', path:'/games/chicken-road', icon:'🐔', color:'#ff9900', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066669/chicken_road_i61thh.mp4', badge:'NEW' },
  { name:'Mines', path:'/games/mines', icon:'💎', color:'#00d084', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/mines_xsbshb.mp4' },
  { name:'Dragon Tiger', path:'/games/dragon-tiger', icon:'🐉', color:'#ff4444' },
]

const ROW_TAGS = [
  { label:'🔥 Trending', badge:'HOT', bc:'#e03030' },
  { label:'✈️ Crash Games', badge:'POPULAR', bc:'#4488ff' },
  { label:'⭐ Recommended', badge:'TOP', bc:'#00d084' },
  { label:'🎯 Popular Picks', badge:'', bc:'' },
  { label:'🏆 Top Rated', badge:'', bc:'' },
  { label:'💥 Live Casino', badge:'LIVE', bc:'#e03030' },
  { label:'🎲 Table Games', badge:'', bc:'' },
  { label:'🎰 Slots & More', badge:'', bc:'' },
]

function ScrollRow({ children, count }) {
  const ref = useRef(null)
  const anim = useRef(null)
  const paused = useRef(false)
  const pos = useRef(0)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const total = count * 138
    function tick() {
      if (!paused.current) { pos.current += 0.5; if (pos.current >= total) pos.current = 0; if (el) el.scrollLeft = pos.current }
      anim.current = requestAnimationFrame(tick)
    }
    anim.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(anim.current)
  }, [count])
  const Btn = (left) => ({ position:'absolute', [left?'left':'right']:0, top:'50%', transform:'translateY(-50%)', zIndex:10, width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'none', color:'white', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' })
  return (
    <div style={{ position:'relative' }}>
      <button style={Btn(true)} onClick={() => { paused.current=true; pos.current=Math.max(0,pos.current-280); if(ref.current) ref.current.scrollLeft=pos.current; setTimeout(()=>paused.current=false,1500) }}>‹</button>
      <div ref={ref} className="hscroll" style={{ paddingLeft:'30px', paddingRight:'30px' }}
        onMouseEnter={()=>paused.current=true} onMouseLeave={()=>paused.current=false}
        onTouchStart={()=>paused.current=true} onTouchEnd={()=>setTimeout(()=>paused.current=false,2000)}
      >{children}{children}</div>
      <button style={Btn(false)} onClick={() => { paused.current=true; pos.current+=280; if(ref.current) ref.current.scrollLeft=pos.current; setTimeout(()=>paused.current=false,1500) }}>›</button>
    </div>
  )
}

function BannerSlider({ onLaunch, launching }) {
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()
  const timer = useRef(null)
  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i+1) % BANNERS.length), 4000)
    return () => clearInterval(timer.current)
  }, [])
  const b = BANNERS[idx]
  const handleBtn = () => {
    if (b.action === 'cricket') onLaunch()
    else if (b.path) navigate(b.path)
  }
  return (
    <div style={{ position:'relative', borderRadius:'12px', overflow:'hidden', marginBottom:'14px', aspectRatio:'16/9', background:b.bg, transition:'background 0.5s' }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 75% 50%, ${b.accent}28 0%, transparent 65%)` }} />
      {/* Big faded icon bg */}
      <div style={{ position:'absolute', right:'-5%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(80px,25vw,180px)', opacity:0.12, userSelect:'none', pointerEvents:'none' }}>{b.icon}</div>
      {/* Content */}
      <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', padding:'clamp(16px,5vw,52px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:b.accent, display:'inline-block', animation:'pulse-live 1.4s infinite' }} />
          <span style={{ fontSize:'clamp(9px,1.8vw,12px)', color:b.accent, fontWeight:'800', letterSpacing:'2.5px', textTransform:'uppercase' }}>{b.tag}</span>
        </div>
        <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(20px,5.5vw,52px)', color:'white', lineHeight:1.1, marginBottom:'6px', textShadow:'0 2px 16px rgba(0,0,0,0.6)', fontWeight:'900' }}>{b.title}</h2>
        <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'clamp(10px,2.2vw,17px)', marginBottom:'clamp(14px,3vw,28px)', maxWidth:'60%' }}>{b.sub}</p>
        <button onClick={handleBtn} style={{ alignSelf:'flex-start', padding:'clamp(9px,2vw,16px) clamp(18px,4vw,36px)', background:`linear-gradient(135deg,${b.accent}dd,${b.accent})`, border:'none', borderRadius:'9px', color:'#fff', fontWeight:'800', fontSize:'clamp(11px,2.2vw,17px)', cursor:'pointer', boxShadow:`0 4px 20px ${b.accent}55`, whiteSpace:'nowrap', letterSpacing:'0.3px' }}>
          {launching ? '⏳ Loading...' : `${b.btn} →`}
        </button>
      </div>
      {/* Dots */}
      <div className="banner-dots" style={{ bottom:'12px' }}>
        {BANNERS.map((_,i) => (
          <button key={i} className={`banner-dot${i===idx?' active':''}`} onClick={() => { setIdx(i); clearInterval(timer.current); timer.current=setInterval(()=>setIdx(j=>(j+1)%BANNERS.length),4000) }} />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const { user, balance } = useStore()
  const navigate = useNavigate()
  const [liveGames, setLiveGames] = useState([])
  const [launching, setLaunching] = useState(false)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    api.get('/live-casino/games').then(r => setLiveGames(r.data.games || [])).catch(() => {})
  }, [])

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

  async function launchLiveGame(game) {
    if (!user) { toast.error('Login karein pehle!'); navigate('/login'); return }
    try {
      const res = await api.post('/live-casino/launch', { game_uid: game.game_uid, language:'hi', currency_code:'INR' })
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
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0a0a0f', flexShrink:0, borderBottom:'1px solid rgba(224,48,48,0.2)' }}>
            <span className="sigma-logo-text" style={{ fontSize:'16px' }}>SIGMA777</span>
            <button onClick={() => setModal(null)} style={{ padding:'7px 18px', background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.4)', borderRadius:'8px', color:'#ff6666', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>✕ Exit</button>
          </div>
          <iframe src={modal} style={{ flex:1, border:'none' }} allow="autoplay; fullscreen" title="Live Game" />
        </div>
      )}

      {/* WELCOME */}
      {user && (
        <div style={{ padding:'9px 13px', background:'rgba(224,48,48,0.07)', border:'1px solid rgba(224,48,48,0.14)', borderRadius:'10px', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'10px', color:'var(--text-muted)', letterSpacing:'0.5px' }}>WELCOME BACK</div>
            <div style={{ fontSize:'15px', fontWeight:'700' }}>{user.username} 👑</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'10px', color:'var(--text-muted)' }}>BALANCE</div>
            <div style={{ color:'var(--primary)', fontWeight:'800', fontSize:'16px' }}>🪙 {Number(balance||0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* BANNER — 16:9 */}
      <BannerSlider onLaunch={launchCricket} launching={launching} />

      {/* 6 CATEGORY GRID — Mahaling777 style */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'18px' }}>
        {CATEGORIES.map((cat, i) => (
          <button key={i} onClick={() => handleCat(cat)} style={{ position:'relative', background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'16px 8px 12px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', cursor:'pointer', transition:'all 0.2s', overflow:'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.border=`1px solid ${cat.color}44`; e.currentTarget.style.background='var(--bg-hover)' }}
            onMouseLeave={e => { e.currentTarget.style.border='1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.background='var(--bg-card)' }}
          >
            {/* NEW badge */}
            {cat.badge && (
              <div style={{ position:'absolute', top:0, right:0, background:'#e03030', color:'#fff', fontSize:'8px', fontWeight:'900', padding:'2px 7px 2px 10px', borderBottomLeftRadius:'10px', letterSpacing:'0.5px' }}>NEW</div>
            )}
            {/* Icon */}
            <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:`${cat.color}18`, border:`1px solid ${cat.color}33`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px' }}>
              {cat.iconEmoji}
            </div>
            {/* Label */}
            <div style={{ fontSize:'clamp(9px,2.5vw,11px)', fontWeight:'800', color:'#fff', textAlign:'center', lineHeight:1.2, letterSpacing:'0.3px' }}>{cat.label}</div>
          </button>
        ))}
      </div>

      {/* FEATURED — 3 col video grid */}
      <section style={{ marginBottom:'18px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
          <span style={{ fontSize:'13px', fontWeight:'700', display:'flex', alignItems:'center', gap:'6px' }}>
            🔥 Trending Games
            <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 7px', borderRadius:'3px', background:'rgba(224,48,48,0.18)', color:'#e03030', border:'1px solid rgba(224,48,48,0.3)', textTransform:'uppercase' }}>HOT</span>
          </span>
          <Link to="/lobby" style={{ fontSize:'11px', color:'var(--text-muted)' }}>View All →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {FEATURED.map((g,i) => (
            <Link key={i} to={g.path} style={{ textDecoration:'none' }}>
              <div style={{ aspectRatio:'16/9', background:`linear-gradient(135deg,${g.color}33,#12121a)`, borderRadius:'10px', overflow:'hidden', cursor:'pointer', transition:'transform 0.2s', position:'relative', border:'1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}
              >
                {g.video ? <video src={g.video} autoPlay loop muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'clamp(20px,5vw,36px)' }}>{g.icon}</div>
                }
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'4px 8px', background:'linear-gradient(transparent,rgba(0,0,0,0.88))', fontSize:'clamp(9px,2vw,11px)', fontWeight:'700', color:'white' }}>{g.name}</div>
                {g.badge && <div style={{ position:'absolute', top:'4px', left:'4px', fontSize:'8px', fontWeight:'800', padding:'1px 5px', borderRadius:'3px', background:'rgba(224,48,48,0.9)', color:'#fff' }}>{g.badge}</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LIVE SPORTS EMBED */}
      {user && <LiveSportsEmbed />}



      {/* GUEST CTA */}
      {!user && (
        <div style={{ textAlign:'center', padding:'28px 16px', background:'rgba(224,48,48,0.04)', borderRadius:'14px', border:'1px solid rgba(224,48,48,0.1)', marginBottom:'16px' }}>
          <div className="sigma-logo-text" style={{ fontSize:'clamp(22px,6vw,38px)', marginBottom:'6px' }}>SIGMA777</div>
          <p style={{ color:'var(--text-secondary)', fontSize:'13px', marginBottom:'18px' }}>248+ Live Games • Instant Payouts • 24/7 Support</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
            <Link to="/signup"><button className="btn-primary" style={{ padding:'11px 24px' }}>🎁 Get 1000 Free Coins</button></Link>
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
  if (loading) return <div style={{ height:'180px', background:'var(--bg-card)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:'13px', marginBottom:'18px' }}>⏳ Loading Live Sports...</div>
  return (
    <section style={{ marginBottom:'18px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'8px' }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:'#ff4444', display:'inline-block', animation:'pulse-live 1.4s infinite' }} />
        <span style={{ fontSize:'13px', fontWeight:'700' }}>🏏 Live Sports Betting</span>
        <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 7px', borderRadius:'3px', background:'rgba(224,48,48,0.18)', color:'#e03030', border:'1px solid rgba(224,48,48,0.3)' }}>LIVE</span>
      </div>
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(224,48,48,0.15)' }}>
        <iframe src={url} style={{ width:'100%', height:'400px', border:'none', display:'block' }} allow="autoplay; fullscreen" title="Live Sports" />
      </div>
    </section>
  )
}
