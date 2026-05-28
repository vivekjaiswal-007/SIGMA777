import React, { useState, useEffect, useRef } from 'react'
import { openAuthModal } from '../utils/authModal.js'
import { filterGames } from '../utils/gameFilter.js'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

/* ── Banners ── */
const BANNERS = [
  {
    img: 'https://res.cloudinary.com/dgzoyuo9q/image/upload/v1779749481/WhatsApp_Image_2026-05-26_at_4.06.42_AM_vip5wj.jpg',
    label: '🏏 Live Cricket',
    action: 'cricket',
  },
  {
    img: 'https://res.cloudinary.com/dgzoyuo9q/image/upload/v1779749481/WhatsApp_Image_2026-05-26_at_4.18.29_AM_tgmb1o.jpg',
    label: '⚽ Live Football',
    action: 'cricket',
  },
  {
    img: 'https://res.cloudinary.com/dgzoyuo9q/image/upload/v1779749481/WhatsApp_Image_2026-05-26_at_4.13.24_AM_amtffy.jpg',
    label: '✈️ Aviator',
    path: '/games/aviator',
  },
  {
    img: 'https://res.cloudinary.com/dgzoyuo9q/image/upload/v1779749480/WhatsApp_Image_2026-05-26_at_4.18.32_AM_vzlnlj.jpg',
    label: '🎰 Live Casino',
    path: '/live-casino',
  },
  {
    img: 'https://res.cloudinary.com/dgzoyuo9q/image/upload/v1779749702/WhatsApp_Image_2026-05-26_at_4.21.44_AM_ghf3po.jpg',
    label: '🪙 Crypto Deposit',
    path: '/account',
  },
]

/* ── 6 Categories with exact Mahaling777-style SVG icons ── */
const CATEGORIES = [
  { label:'IN-PLAY',        badge:null,  action:'cricket',      img:'https://res.cloudinary.com/dblqd29s3/image/upload/v1779901064/17721097199816647_1_mfrwrt.gif' },
  { label:'SPORTSBOOK',     badge:null,  action:'cricket',      img:'https://res.cloudinary.com/dblqd29s3/image/upload/v1779901057/17721097044064323_kylxsf.gif' },
  { label:'VIRTUAL',        badge:null,  path:'/live-casino',   img:'https://res.cloudinary.com/dblqd29s3/image/upload/v1779901056/17721098612002083_r7jhm6.gif' },
  { label:'E-SPORTS',       badge:'NEW', path:'/e-sports',      img:'https://res.cloudinary.com/dblqd29s3/image/upload/v1779901056/17721098435339176_bs8tur.gif' },
  { label:'SPECIAL MARKET', badge:'NEW', action:'cricket',      img:'https://res.cloudinary.com/dblqd29s3/image/upload/v1779901056/17721097199816647_utlelp.gif' },
  { label:'PLAYER BATTLE',  badge:null,  path:'/player-battle', img:'https://res.cloudinary.com/dblqd29s3/image/upload/v1779901899/17721097112033203_1_exvkiq.gif' },
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
  const touchStart = useRef(null)
  const touchEnd = useRef(null)

  const resetTimer = (newIdx) => {
    clearInterval(timer.current)
    timer.current = setInterval(() => setIdx(i => (i+1) % BANNERS.length), 4000)
    if (newIdx !== undefined) setIdx(newIdx)
  }

  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i+1) % BANNERS.length), 4000)
    return () => clearInterval(timer.current)
  }, [])

  const goNext = () => setIdx(i => { const n=(i+1)%BANNERS.length; resetTimer(); return n })
  const goPrev = () => setIdx(i => { const n=(i-1+BANNERS.length)%BANNERS.length; resetTimer(); return n })

  const onTouchStart = (e) => { touchStart.current = e.targetTouches[0].clientX; touchEnd.current = null }
  const onTouchMove = (e) => { touchEnd.current = e.targetTouches[0].clientX }
  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return
    const diff = touchStart.current - touchEnd.current
    if (Math.abs(diff) > 40) { diff > 0 ? goNext() : goPrev() }
    touchStart.current = null; touchEnd.current = null
  }

  const b = BANNERS[idx]
  const handleClick = () => {
    if (b.action === 'cricket') onLaunch()
    else if (b.path) navigate(b.path)
  }

  return (
    <div
      style={{ position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:'12px', overflow:'hidden', marginBottom:'14px', minHeight:'180px', cursor:'pointer', userSelect:'none' }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onClick={handleClick}
    >
      {/* Image */}
      <img
        src={b.img}
        alt={b.label}
        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', transition:'opacity 0.3s' }}
      />

      {/* Bottom gradient + label */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent, rgba(0,0,0,0.7))', padding:'20px 14px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'#fff', fontWeight:'800', fontSize:'14px', textShadow:'0 1px 4px rgba(0,0,0,0.8)' }}>{b.label}</span>
        <button
          onClick={e => { e.stopPropagation(); handleClick() }}
          disabled={launching}
          style={{ padding:'6px 14px', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.4)', borderRadius:'20px', color:'#fff', fontWeight:'700', fontSize:'12px', cursor:'pointer', whiteSpace:'nowrap' }}
        >
          {launching ? '⏳' : 'Play →'}
        </button>
      </div>

      {/* Dots */}
      <div className="banner-dots">
        {BANNERS.map((_,i) => (
          <button key={i} className={`banner-dot${i===idx?' active':''}`}
            onClick={e => { e.stopPropagation(); resetTimer(i) }} />
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
  const navigate = useNavigate()
  const LIMIT = 8
  const visibleGames = row.games.slice(0, LIMIT)
  const hasMore = row.games.length > LIMIT
  const goToCategory = () => navigate(`/category/${encodeURIComponent(row.label)}`)

  return (
    <section style={{ marginBottom:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'7px' }}>
          <span style={{ fontSize:'13px', fontWeight:'800', color:'#fff', textTransform:'uppercase', letterSpacing:'0.5px' }}>{row.label}</span>
          {idx === 0 && <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 6px', borderRadius:'3px', background:'rgba(224,48,48,0.18)', color:'#e03030', border:'1px solid rgba(224,48,48,0.3)' }}>HOT</span>}
        </div>
        <div style={{ display:'flex', gap:'5px', alignItems:'center' }}>
          {hasMore && <button onClick={goToCategory} style={{ fontSize:'10px', color:'#4caf50', fontWeight:'700', background:'none', border:'none', cursor:'pointer', padding:'2px 6px' }}>View All ({row.games.length})</button>}
          <button onClick={() => rowRef.current?.scrollBy({ left:-300, behavior:'smooth' })} style={{ width:'28px', height:'28px', borderRadius:'6px', background:'#222', border:'1px solid #333', color:'#ccc', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>‹</button>
          <button onClick={() => rowRef.current?.scrollBy({ left:300, behavior:'smooth' })} style={{ width:'28px', height:'28px', borderRadius:'6px', background:'#222', border:'1px solid #333', color:'#ccc', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'700' }}>›</button>
        </div>
      </div>
      <div ref={rowRef} className="hscroll" style={{ gap:'8px' }}>
        {visibleGames.map((g, i) => {
          const busy = launchingGame === g.game_uid
          return (
            <div key={i} className="game-card" style={{ opacity:busy?0.6:1, position:'relative' }}>
              <div onClick={() => !busy && onPlay(g)} style={{ cursor:busy?'wait':'pointer' }}>
                {g.img ? <img src={g.img} alt={g.name} className="game-card-thumb" onError={e=>{e.target.style.display='none';e.target.nextSibling&&(e.target.nextSibling.style.display='flex')}}/> : null}
                <div className="game-card-thumb-placeholder" style={{ background:'#1a1a2a', fontSize:'28px', display:g.img?'none':'flex' }}>🎰</div>
                <div className="game-card-name">{busy?'⏳':g.name}</div>
              </div>

            </div>
          )
        })}
        {hasMore && (
          <div className="game-card" onClick={goToCategory} style={{ cursor:'pointer', position:'relative', flexShrink:0 }}>
            {row.games[LIMIT]?.img
              ? <img src={row.games[LIMIT].img} alt="" className="game-card-thumb" style={{ filter:'blur(3px)', opacity:0.4 }}/>
              : <div className="game-card-thumb-placeholder" style={{ background:'#1a1a2a', filter:'blur(3px)', opacity:0.4 }}>🎰</div>}
            <div style={{ position:'absolute', top:0, left:0, right:0, bottom:'30px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.55)', gap:'4px' }}>
              <div style={{ fontSize:'22px', fontWeight:'900', color:'#fff' }}>+{row.games.length - LIMIT}</div>
              <div style={{ fontSize:'10px', fontWeight:'800', color:'#fff', letterSpacing:'0.5px' }}>VIEW MORE</div>
            </div>
            <div className="game-card-name" style={{ color:'#4caf50', fontWeight:'700', textAlign:'center' }}>Show All</div>
          </div>
        )}
      </div>
    </section>
  )
}


function CasinoLobby({ games, onPlay, launchingGame }) {
  return (
    <section style={{ marginBottom:'20px' }}>
      <div style={{ marginBottom:'10px', borderBottom:'1px solid #2a2a2a', paddingBottom:'8px' }}>
        <h2 style={{ fontSize:'14px', fontWeight:'900', color:'#fff', textTransform:'uppercase', letterSpacing:'1px', margin:0, fontStyle:'italic' }}>CASINO LOBBY</h2>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'4px' }}>
        {games.map((g, i) => {
          const busy = launchingGame === g.game_uid
          return (
            <div key={i} style={{ borderRadius:'6px', overflow:'hidden', cursor:busy?'wait':'pointer', opacity:busy?0.6:1, position:'relative', aspectRatio:'4/3', transition:'transform 0.15s' }}
              onClick={() => !busy && onPlay(g)}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.04)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}
            >
              {g.img
                ? <img src={g.img} alt={g.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} onError={e=>{e.target.style.display='none'}}/>
                : <div style={{ width:'100%', height:'100%', background:'linear-gradient(135deg,#1a1a3a,#2a1a3a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px' }}>🎮</div>
              }
              <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,0.85))', padding:'8px 4px 3px' }}>
                <div style={{ fontSize:'7px', fontWeight:'900', color:'#fff', textTransform:'uppercase', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{busy?'⏳':g.name}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function LiveRow({ label, games, onPlay, launchingGame }) {
  const rowRef = useRef(null)
  if (!games || games.length === 0) return null
  return (
    <section style={{ marginBottom:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px', borderBottom:'1px solid #2a2a2a', paddingBottom:'8px' }}>
        <h2 style={{ fontSize:'14px', fontWeight:'900', color:'#fff', textTransform:'uppercase', letterSpacing:'1px', margin:0, fontStyle:'italic' }}>{label}</h2>
        <div style={{ display:'flex', gap:'5px' }}>
          <button onClick={() => rowRef.current?.scrollBy({ left:-300, behavior:'smooth' })} style={{ width:'26px', height:'26px', borderRadius:'5px', background:'#2a2a2a', border:'1px solid #3a3a3a', color:'#ccc', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
          <button onClick={() => rowRef.current?.scrollBy({ left:300, behavior:'smooth' })} style={{ width:'26px', height:'26px', borderRadius:'5px', background:'#2a2a2a', border:'1px solid #3a3a3a', color:'#ccc', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
        </div>
      </div>
      <div ref={rowRef} className="hscroll" style={{ gap:'8px' }}>
        {games.map((g, i) => {
          const busy = launchingGame === g.game_uid
          return (
            <div key={i} style={{ flexShrink:0, width:'130px', borderRadius:'10px', overflow:'hidden', cursor:busy?'wait':'pointer', opacity:busy?0.6:1, position:'relative', transition:'transform 0.2s' }}
              onClick={() => !busy && onPlay(g)}
              onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform='none'}
            >
              {g.img
                ? <img src={g.img} alt={g.name} style={{ width:'100%', height:'175px', objectFit:'cover', display:'block' }} onError={e=>{e.target.style.display='none'}}/>
                : <div style={{ width:'100%', height:'175px', background:'linear-gradient(135deg,#1a1a3a,#2a1a2a)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'32px' }}>🎮</div>
              }
              <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(transparent,rgba(0,0,0,0.9))', padding:'20px 8px 7px' }}>
                <div style={{ fontSize:'10px', fontWeight:'900', color:'#fff', textTransform:'uppercase', letterSpacing:'0.3px', lineHeight:1.3 }}>{busy?'⏳':g.name}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function LuckySportEmbed() {
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(function() {
    api.post('/live-casino/launch', { game_uid: '7004', language: 'hi', currency_code: 'INR' })
      .then(function(r) {
        if (r.data.success && r.data.gameUrl) setUrl(r.data.gameUrl)
        else setError(true)
        setLoading(false)
      })
      .catch(function() { setError(true); setLoading(false) })
  }, [])

  if (error) return null
  if (loading) return null

  return (
    <section style={{ marginBottom:'20px' }}>
      <div style={{ marginBottom:'8px', display:'flex', alignItems:'center', gap:'8px' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background:'#ff4444', animation:'pulse 1.4s infinite' }} />
        <span style={{ fontSize:'13px', fontWeight:'700', color:'#ddd' }}>🏏 Live Sports Betting</span>
      </div>
      <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid #3a2800' }}>
        <iframe src={url} style={{ width:'100%', height:'500px', border:'none', display:'block' }} allow="autoplay; fullscreen" title="Live Sports" />
      </div>
    </section>
  )
}

function NewLaunchRow({ games, onPlay, launchingGame }) {
  const rowRef = useRef(null)
  return (
    <section style={{ marginBottom:'20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
        <h2 style={{ fontSize:'14px', fontWeight:'900', color:'#fff', textTransform:'uppercase', letterSpacing:'1px', margin:0 }}>
          <span style={{ fontStyle:'italic' }}>NEW LAUNCH</span>
        </h2>
        <div style={{ display:'flex', gap:'5px' }}>
          <button onClick={() => rowRef.current?.scrollBy({ left:-300, behavior:'smooth' })}
            style={{ width:'26px', height:'26px', borderRadius:'5px', background:'#2a2a2a', border:'1px solid #3a3a3a', color:'#ccc', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
          <button onClick={() => rowRef.current?.scrollBy({ left:300, behavior:'smooth' })}
            style={{ width:'26px', height:'26px', borderRadius:'5px', background:'#2a2a2a', border:'1px solid #3a3a3a', color:'#ccc', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
        </div>
      </div>
      <div ref={rowRef} className="hscroll" style={{ gap:'8px' }}>
        {games.map((g, i) => {
          const busy = launchingGame === g.game_uid
          return (
            <div key={i} className="game-card" onClick={() => !busy && onPlay(g)}
              style={{ opacity:busy?0.6:1, cursor:busy?'wait':'pointer' }}>
              {g.img
                ? <img src={g.img} alt={g.name} className="game-card-thumb" onError={e=>{e.target.style.display='none';e.target.nextSibling&&(e.target.nextSibling.style.display='flex')}}/>
                : null}
              <div className="game-card-thumb-placeholder" style={{ background:'#1a1a2a', fontSize:'24px', display:g.img?'none':'flex' }}>🎮</div>
              <div className="game-card-name">{busy?'⏳':g.name}</div>
            </div>
          )
        })}
      </div>
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
  const [cricketUrl, setCricketUrl] = useState(null)

  useEffect(() => {
    api.get('/live-casino/games').then(r => setLiveGames(r.data.games || [])).catch(() => {})
    const handler = () => launchCricket()
    window.addEventListener('launch-cricket', handler)
    return () => window.removeEventListener('launch-cricket', handler)
  }, [])

  const rows = filterGames(liveGames)

  async function launchCricket() {
    if (!user) { toast.error('Login karein pehle!'); openAuthModal('login'); return }
    setLaunching(true)
    try {
      const res = await api.post('/live-casino/launch', { game_uid:'7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) {
        setCricketUrl(res.data.gameUrl)
        setModal(res.data.gameUrl)
      }
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunching(false)
  }

  async function launchGame(g) {
    if (!user) { toast.error('Login karein pehle!'); openAuthModal('login'); return }
    setLaunchingGame(g.game_uid)
    try {
      const res = await api.post('/live-casino/launch', { game_uid: g.game_uid || '7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunchingGame(null)
  }

  async function launchDemo(g) {
    if (!user) { openAuthModal('login'); return }
    setLaunchingGame(g.game_uid + '_demo')
    try {
      const res = await api.post('/live-casino/launch', { game_uid: g.game_uid || '7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error('Demo mode not available for this game')
    } catch { toast.error('Demo launch failed') }
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

      {/* HERO — 2 column like Jackpot247 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
        {/* Casino Card */}
        <div onClick={() => navigate('/live-casino')}
          style={{ borderRadius:'12px', overflow:'hidden', cursor:'pointer' }}>
          <img src="https://res.cloudinary.com/dblqd29s3/image/upload/v1779935399/banner__b60da0af-8c10-4ed6-bacf-469a95279493_gss8fo.webp"
            alt="Casino" style={{ width:'100%', height:'auto', display:'block' }} />
        </div>

        {/* Sports Card */}
        <div onClick={() => window.dispatchEvent(new CustomEvent('launch-cricket'))}
          style={{ borderRadius:'12px', overflow:'hidden', cursor:'pointer' }}>
          <img src="https://res.cloudinary.com/dblqd29s3/image/upload/v1779935399/banner__dd023389-11bc-4599-91aa-8115fafaa346_bqoyll.webp"
            alt="Sports" style={{ width:'100%', height:'auto', display:'block' }} />
        </div>
      </div>

      {/* VIDEO SECTIONS */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px' }}>
        <div style={{ borderRadius:'12px', overflow:'hidden', cursor:'pointer' }} onClick={() => navigate('/live-casino')}>
          <img src="https://res.cloudinary.com/dblqd29s3/image/upload/v1779935534/download_1_oujczg.webp"
            alt="Video 1" style={{ width:'100%', height:'160px', objectFit:'cover', display:'block' }} />
        </div>
        <div style={{ borderRadius:'12px', overflow:'hidden', cursor:'pointer' }} onClick={() => window.dispatchEvent(new CustomEvent('launch-cricket'))}>
          <img src="https://res.cloudinary.com/dblqd29s3/image/upload/v1779935534/download_g3qc8w.webp"
            alt="Video 2" style={{ width:'100%', height:'160px', objectFit:'cover', display:'block' }} />
        </div>
      </div>


      {/* TOP MATCHES — LuckySports Live */}
      {user && <LuckySportEmbed />}

      {/* NEW LAUNCH ROW */}
      {liveGames.length > 0 && (() => {
        const newLaunch = liveGames.slice(0, 12)
        return (
          <NewLaunchRow games={newLaunch} onPlay={launchGame} launchingGame={launchingGame} />
        )
      })()}

      {/* TRENDING GAMES 3x2 GRID */}
      <section style={{ marginBottom:'20px' }}>
        <h2 style={{ fontSize:'14px', fontWeight:'900', color:'#fff', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'12px', fontStyle:'italic', borderBottom:'1px solid #2a2a2a', paddingBottom:'8px' }}>
          TRENDING GAMES
        </h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {[
            { label:'AVIATOR', color:'#3a0808', path:'/games/aviator', video:'https://res.cloudinary.com/dblqd29s3/video/upload/v1779935948/aviator_k2ysp5.mp4' },
            { label:'MARBLE RUN', color:'#1a1a0a', path:'/live-casino', video:'https://res.cloudinary.com/dblqd29s3/video/upload/v1779935949/Mobile_run_mc8tr4.mp4' },
            { label:'CHICKEN GAMES', color:'#1a2a0a', path:'/games/chicken-road', video:'https://res.cloudinary.com/dblqd29s3/video/upload/v1779935948/chicken_road_w7kqyo.mp4' },
            { label:'COLOR PREDICTION', color:'#3a1a08', path:'/games/color-prediction', video:'https://res.cloudinary.com/dblqd29s3/video/upload/v1779935948/colour_prediction_mucljg.mp4' },
            { label:'LIVE PREDICTION', color:'#0a1a0a', action:'cricket', video:null },
            { label:'MINES', color:'#08083a', path:'/games/mines', video:'https://res.cloudinary.com/dblqd29s3/video/upload/v1779935949/mines_mxzdzq.mp4' },
          ].map((g, i) => (
            <div key={i}
              onClick={() => g.action === 'cricket' ? window.dispatchEvent(new CustomEvent('launch-cricket')) : navigate(g.path)}
              style={{ background:g.color, borderRadius:'10px', overflow:'hidden', cursor:'pointer', aspectRatio:'16/10', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', border:'1px solid rgba(255,255,255,0.06)', transition:'transform 0.2s', position:'relative' }}
              onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
            >
              {g.video
                ? <video src={g.video} autoPlay loop muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', position:'absolute', inset:0 }} />
                : <span style={{ fontSize:'clamp(24px,6vw,40px)' }}>📈</span>
              }
            </div>
          ))}
        </div>
      </section>



      {/* CASINO LOBBY */}
      {liveGames.length > 0 && (
        <CasinoLobby games={liveGames.slice(0, 18)} onPlay={launchGame} launchingGame={launchingGame} />
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
  if (loading) return null
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
