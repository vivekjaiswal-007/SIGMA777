import React, { useState, useEffect, useRef } from 'react'
import { CAT_ICONS } from '../catIcons.js'
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
  { label:'IN-PLAY',        badge:null,  action:'cricket',        iconKey:'inplay'       },
  { label:'SPORTSBOOK',     badge:null,  action:'cricket',        iconKey:'sportsbook'   },
  { label:'VIRTUAL',        badge:null,  path:'/live-casino',     iconKey:'virtual'      },
  { label:'E-SPORTS',       badge:'NEW', path:'/e-sports',        iconKey:'esports'      },
  { label:'SPECIAL MARKET', badge:'NEW', action:'cricket',        iconKey:'special'      },
  { label:'PLAYER BATTLE',  badge:null,  path:'/player-battle',   iconKey:'playerbattle' },
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

      {/* QUICK TABS */}
      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        @keyframes icon-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.9)} }
        .live-dot { animation: blink 1.2s infinite; }
        .tab-icon-blink { animation: icon-pulse 2s infinite; display:flex; align-items:center; }
      `}</style>
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'10px', marginBottom:'2px', scrollbarWidth:'none', marginLeft:'-12px', marginRight:'-12px', paddingLeft:'12px', paddingRight:'12px' }}>
        {[
          {
            label:'Aviator',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M21 3L3 10.5l7 2.5 1.5 6.5 3.5-4 4.5 3L21 3z"/></svg>,
            path:'/games/aviator', live: false
          },
          {
            label:'Grey Gaming',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="4"/><line x1="8" y1="12" x2="12" y2="12"/><line x1="10" y1="10" x2="10" y2="14"/><circle cx="17" cy="11" r="1" fill="white"/><circle cx="17" cy="13" r="1" fill="white"/></svg>,
            action:'cricket', live: false
          },
          {
            label:'Live Cricket',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M8 12 Q12 8 16 12 Q12 16 8 12"/></svg>,
            action:'cricket', live: true
          },
          {
            label:'E-Soccer',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3 L14 8 L19 8 L15 11 L17 16 L12 13 L7 16 L9 11 L5 8 L10 8 Z" fill="white" stroke="none"/></svg>,
            path:'/e-sports', live: false
          },
          {
            label:'Live Casino',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M3 10h18"/></svg>,
            path:'/live-casino', live: true
          },
          {
            label:'Teen Patti',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2zm5 3a1 1 0 100 2 1 1 0 000-2zm0 4a3 3 0 100 6 3 3 0 000-6z"/></svg>,
            path:'/games/teen-patti', live: false
          },
          {
            label:'Crash',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M3 17 L9 11 L13 15 L21 7"/><polyline points="15 7 21 7 21 13" fill="none" stroke="white" strokeWidth="2"/></svg>,
            path:'/games/crash-rocket', live: false
          },
          {
            label:'Mines',
            icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="5" fill="white"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="7.1" y2="7.1"/><line x1="16.9" y1="16.9" x2="19.1" y2="19.1"/></svg>,
            path:'/games/mines', live: false
          },
        ].map((tab, i) => (
          <button key={i} onClick={() => tab.action === 'cricket' ? launchCricket() : navigate(tab.path)}
            style={{ flexShrink:0, display:'flex', alignItems:'center', gap:'5px', padding:'5px 12px', background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'20px', color:'#ccc', fontSize:'11px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap' }}
            onMouseEnter={e => { e.currentTarget.style.background='#222'; e.currentTarget.style.borderColor='#3a3a3a' }}
            onMouseLeave={e => { e.currentTarget.style.background='#1a1a1a'; e.currentTarget.style.borderColor='#2a2a2a' }}
          >
            {tab.live && <span className="live-dot" style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#4caf50', display:'inline-block', marginRight:'1px' }}/>}
            <span className="tab-icon-blink" style={{ display:'flex', alignItems:'center' }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* BANNER */}
      <BannerSlider onLaunch={launchCricket} launching={launching} />

      {/* 6 CATEGORY GRID */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'18px' }}>
        {CATEGORIES.map((cat, i) => (
          <button key={i} onClick={() => handleCat(cat)} style={{ position:'relative', background:'#181818', border:'1px solid #2a2a2a', borderRadius:'12px', padding:'14px 8px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0', cursor:'pointer', transition:'all 0.2s', overflow:'hidden' }}
            onMouseEnter={e => { e.currentTarget.style.background='#222'; e.currentTarget.style.borderColor='#3a3a3a' }}
            onMouseLeave={e => { e.currentTarget.style.background='#181818'; e.currentTarget.style.borderColor='#2a2a2a' }}
          >
            {cat.badge && (
              <div style={{ position:'absolute', top:0, right:0, background:'#e03030', color:'#fff', fontSize:'8px', fontWeight:'900', padding:'3px 8px 3px 12px', borderBottomLeftRadius:'10px', letterSpacing:'0.5px' }}>NEW</div>
            )}
            {/* Icon */}
            <div style={{ width:'84px', height:'84px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <img src={CAT_ICONS[cat.iconKey]} alt={cat.label} style={{ width:'80px', height:'80px', objectFit:'contain', filter:'brightness(0) invert(1)' }} />
            </div>
            {/* Label */}

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
