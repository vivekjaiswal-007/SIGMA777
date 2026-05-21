import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

const BANNERS = [
  { bg:'linear-gradient(135deg,#0a0020 0%,#1a0040 50%,#0a0020 100%)', accent:'#9944ff', tag:'TRENDING', title:'Aviator', sub:'Crash & Win Big', icon:'✈️', btn:'Play Now', path:'/games/aviator' },
  { bg:'linear-gradient(135deg,#001a00 0%,#003a10 50%,#001a00 100%)', accent:'#00d084', tag:'GREY GAMING', title:'GreyJet', sub:'The Ultimate Crash Game', icon:'🚀', btn:'Play Now', path:'/games/crash-rocket' },
  { bg:'linear-gradient(135deg,#1a0000 0%,#3a0010 50%,#1a0000 100%)', accent:'#ff4444', tag:'LIVE NOW 🔴', title:'Live Cricket', sub:'IPL • T20 • Real Money', icon:'🏏', btn:'Bet Now', path:'/live-casino' },
  { bg:'linear-gradient(135deg,#0a1020 0%,#102040 50%,#0a1020 100%)', accent:'#4488ff', tag:'POPULAR', title:'Teen Patti', sub:'India\'s Favourite Card Game', icon:'♠️', btn:'Play Now', path:'/games/teen-patti' },
]

const CATEGORIES = [
  { icon:'🏠', label:'Home', path:'/' },
  { icon:'✈️', label:'Aviator', path:'/games/aviator' },
  { icon:'🎰', label:'Casino', path:'/lobby' },
  { icon:'📺', label:'Live', path:'/live-casino' },
  { icon:'🏏', label:'Cricket', path:'/live-casino' },
  { icon:'♠️', label:'Cards', path:'/games/teen-patti' },
  { icon:'🎲', label:'Dice', path:'/games/dice' },
  { icon:'💎', label:'Mines', path:'/games/mines' },
]

const FEATURED = [
  { name:'Aviator', path:'/games/aviator', icon:'✈️', color:'#ff4444', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/aviator_nw6vp5.mp4', badge:'HOT' },
  { name:'Crash Rocket', path:'/games/crash-rocket', icon:'🚀', color:'#9944ff', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/Mobile_run_o48kbe.mp4', badge:'HOT' },
  { name:'Color Prediction', path:'/games/color-prediction', icon:'🎨', color:'#ff4488', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066669/colour_prediction_nfxrqp.mp4', badge:'NEW' },
  { name:'Chicken Road', path:'/games/chicken-road', icon:'🐔', color:'#ff9900', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066669/chicken_road_i61thh.mp4', badge:'NEW' },
  { name:'Mines', path:'/games/mines', icon:'💎', color:'#00d084', video:'https://res.cloudinary.com/dnzfce2wa/video/upload/v1778066670/mines_xsbshb.mp4' },
  { name:'Dragon Tiger', path:'/games/dragon-tiger', icon:'🐉', color:'#ff4444' },
]

const QUICK_GAMES = [
  { name:'Teen Patti', path:'/games/teen-patti', icon:'♠️', color:'#e03030' },
  { name:'Roulette', path:'/games/roulette', icon:'🎡', color:'#00d084' },
  { name:'Blackjack', path:'/games/blackjack', icon:'🃏', color:'#4488ff' },
  { name:'Andar Bahar', path:'/games/andar-bahar', icon:'🎯', color:'#ff9900' },
  { name:'Plinko', path:'/games/plinko', icon:'⚡', color:'#ff4488' },
  { name:'Hi-Lo', path:'/games/hi-lo', icon:'📈', color:'#00d084' },
  { name:'Lucky Wheel', path:'/games/lucky-wheel', icon:'🎡', color:'#e03030' },
  { name:'Sic Bo', path:'/games/sic-bo', icon:'🎲', color:'#ff9900' },
  { name:'Poker', path:'/games/poker', icon:'♣️', color:'#9944ff' },
  { name:'Slots', path:'/games/slots', icon:'🎰', color:'#ff9900' },
]

const ROW_TAGS = [
  { label:'🔥 Trending', badge:'HOT', badgeClass:'sec-badge-red' },
  { label:'✈️ Crash Games', badge:'POPULAR', badgeClass:'sec-badge-blue' },
  { label:'⭐ Recommended', badge:'TOP', badgeClass:'sec-badge-green' },
  { label:'🎯 Popular Picks', badge:'', badgeClass:'' },
  { label:'🏆 Top Rated', badge:'', badgeClass:'' },
  { label:'💥 Live Casino', badge:'LIVE', badgeClass:'sec-badge-red' },
  { label:'🎲 Table Games', badge:'', badgeClass:'' },
  { label:'🎰 Slots & More', badge:'', badgeClass:'' },
]

// Auto-scroll row
function ScrollRow({ children, count }) {
  const ref = useRef(null)
  const anim = useRef(null)
  const paused = useRef(false)
  const pos = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const W = 138
    const total = count * W
    function tick() {
      if (!paused.current) {
        pos.current += 0.5
        if (pos.current >= total) pos.current = 0
        if (el) el.scrollLeft = pos.current
      }
      anim.current = requestAnimationFrame(tick)
    }
    anim.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(anim.current)
  }, [count])

  const BtnStyle = (left) => ({
    position:'absolute', [left?'left':'right']:0, top:'50%', transform:'translateY(-50%)',
    zIndex:10, width:'26px', height:'26px', borderRadius:'50%',
    background:'rgba(255,255,255,0.12)', border:'none', color:'white', fontSize:'14px',
    cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
  })

  return (
    <div style={{ position:'relative' }}>
      <button style={BtnStyle(true)} onClick={() => { paused.current=true; pos.current=Math.max(0,pos.current-280); if(ref.current) ref.current.scrollLeft=pos.current; setTimeout(()=>paused.current=false,1500) }}>‹</button>
      <div ref={ref} className="hscroll" style={{ paddingLeft:'30px', paddingRight:'30px' }}
        onMouseEnter={() => paused.current=true} onMouseLeave={() => paused.current=false}
        onTouchStart={() => paused.current=true} onTouchEnd={() => setTimeout(()=>paused.current=false,2000)}
      >{children}{children}</div>
      <button style={BtnStyle(false)} onClick={() => { paused.current=true; pos.current+=280; if(ref.current) ref.current.scrollLeft=pos.current; setTimeout(()=>paused.current=false,1500) }}>›</button>
    </div>
  )
}

// Banner slider
function BannerSlider({ onPlay, launching }) {
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => setIdx(i => (i+1) % BANNERS.length), 3500)
    return () => clearInterval(timerRef.current)
  }, [])

  const b = BANNERS[idx]

  return (
    <div style={{ position:'relative', borderRadius:'12px', overflow:'hidden', marginBottom:'14px', aspectRatio:'2.8/1', minHeight:'120px', background:b.bg, transition:'background 0.4s' }}>
      {/* Glow */}
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 80% 50%, ${b.accent}22 0%, transparent 70%)` }} />
      {/* Content */}
      <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', alignItems:'center', padding:'clamp(14px,4vw,40px)' }}>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'6px' }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:b.accent, animation:'pulse-live 1.4s infinite' }} />
            <span style={{ fontSize:'clamp(8px,1.5vw,11px)', color:b.accent, fontWeight:'800', letterSpacing:'2px', textTransform:'uppercase' }}>{b.tag}</span>
          </div>
          <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(16px,4.5vw,36px)', color:'white', lineHeight:1.1, marginBottom:'4px', textShadow:'0 2px 10px rgba(0,0,0,0.5)' }}>
            {b.icon} {b.title}
          </h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'clamp(9px,2vw,14px)', marginBottom:'clamp(10px,2vw,20px)' }}>{b.sub}</p>
          <button onClick={() => navigate(b.path)} style={{
            padding:'clamp(7px,1.5vw,13px) clamp(14px,3vw,28px)',
            background:`linear-gradient(135deg,${b.accent}cc,${b.accent})`,
            border:'none', borderRadius:'8px', color:'#fff',
            fontWeight:'800', fontSize:'clamp(10px,2vw,15px)', cursor:'pointer',
            boxShadow:`0 4px 18px ${b.accent}55`, whiteSpace:'nowrap',
          }}>{b.btn} →</button>
        </div>
        <div style={{ fontSize:'clamp(40px,12vw,90px)', opacity:0.25, flexShrink:0 }}>{b.icon}</div>
      </div>
      {/* Dots */}
      <div className="banner-dots">
        {BANNERS.map((_, i) => (
          <button key={i} className={`banner-dot${i===idx?' active':''}`} onClick={() => { setIdx(i); clearInterval(timerRef.current); timerRef.current=setInterval(()=>setIdx(j=>(j+1)%BANNERS.length),3500) }} />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const { user, balance } = useStore()
  const navigate = useNavigate()
  const [liveGames, setLiveGames] = useState([])
  const [launching, setLaunching] = useState(null)
  const [modal, setModal] = useState(null)
  const [activeCat, setActiveCat] = useState(0)

  useEffect(() => {
    api.get('/live-casino/games').then(r => setLiveGames(r.data.games || [])).catch(() => {})
  }, [])

  async function launchGame(game) {
    if (!user) { toast.error('Login karein pehle!'); navigate('/login'); return }
    setLaunching(game.game_uid)
    try {
      const res = await api.post('/live-casino/launch', { game_uid: game.game_uid, language: 'hi', currency_code: 'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Game launch failed') }
    setLaunching(null)
  }

  const rows = []
  for (let i = 0; i < liveGames.length; i += 20) rows.push(liveGames.slice(i, i+20))

  return (
    <div style={{ maxWidth:'1400px', margin:'0 auto' }}>

      {/* GAME MODAL */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.96)', zIndex:9999, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0a0a0f', flexShrink:0, borderBottom:'1px solid rgba(224,48,48,0.2)' }}>
            <span className="sigma-logo-text" style={{ fontSize:'16px' }}>SIGMA777</span>
            <button onClick={() => setModal(null)} style={{ padding:'7px 18px', background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.4)', borderRadius:'8px', color:'#ff6666', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>✕ Exit</button>
          </div>
          <iframe src={modal} style={{ flex:1, border:'none' }} allow="autoplay; fullscreen" title="Live Game" />
        </div>
      )}

      {/* WELCOME BAR */}
      {user && (
        <div style={{ padding:'10px 14px', background:'rgba(224,48,48,0.07)', border:'1px solid rgba(224,48,48,0.15)', borderRadius:'10px', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'11px', color:'var(--text-muted)', letterSpacing:'0.5px' }}>WELCOME BACK</div>
            <div style={{ fontSize:'16px', fontWeight:'700' }}>{user.username} 👑</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'11px', color:'var(--text-muted)' }}>BALANCE</div>
            <div style={{ color:'var(--primary)', fontWeight:'800', fontSize:'17px' }}>🪙 {Number(balance||0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* BANNER SLIDER */}
      <BannerSlider onPlay={launchGame} launching={launching} />

      {/* CATEGORY CHIPS */}
      <div className="cat-row">
        {CATEGORIES.map((c, i) => (
          <div key={i} className={`cat-chip${activeCat===i?' active':''}`} onClick={() => { setActiveCat(i); navigate(c.path) }}>
            <span className="cat-chip-icon">{c.icon}</span>
            <span className="cat-chip-label">{c.label}</span>
          </div>
        ))}
      </div>

      {/* FEATURED GAMES — 3 col grid */}
      <section style={{ marginBottom:'20px' }}>
        <div className="sec-header">
          <div className="sec-label">🎮 Featured Games <span className="sec-badge sec-badge-red">HOT</span></div>
          <Link to="/lobby" style={{ fontSize:'11px', color:'var(--text-muted)' }}>View All →</Link>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
          {FEATURED.map((g, i) => (
            <Link key={i} to={g.path} style={{ textDecoration:'none' }}>
              <div style={{ aspectRatio:'16/9', background:`linear-gradient(135deg,${g.color}33,#12121a)`, borderRadius:'10px', overflow:'hidden', cursor:'pointer', transition:'transform 0.2s', position:'relative', border:'1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}
              >
                {g.video ? (
                  <video src={g.video} autoPlay loop muted playsInline style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                ) : (
                  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'4px' }}>
                    <div style={{ fontSize:'clamp(22px,5vw,36px)' }}>{g.icon}</div>
                  </div>
                )}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'5px 8px', background:'linear-gradient(transparent,rgba(0,0,0,0.85))', fontSize:'clamp(9px,2vw,12px)', fontWeight:'700', color:'white' }}>{g.icon} {g.name}</div>
                {g.badge && <div style={{ position:'absolute', top:'5px', left:'5px', fontSize:'8px', fontWeight:'800', padding:'2px 5px', borderRadius:'3px', background:'rgba(224,48,48,0.85)', color:'#fff', letterSpacing:'0.5px' }}>{g.badge}</div>}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LIVE SPORTS EMBED */}
      {user && (
        <section style={{ marginBottom:'20px' }}>
          <div className="sec-header">
            <div className="sec-label">
              <span style={{ display:'inline-flex', alignItems:'center', gap:'5px' }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background:'#ff4444', display:'inline-block', animation:'pulse-live 1.4s infinite' }} />
                🏏 Live Sports Betting
              </span>
              <span className="sec-badge sec-badge-red">LIVE</span>
            </div>
          </div>
          <LiveSportsEmbed />
        </section>
      )}

      {/* LIVE CASINO GAME ROWS */}
      {rows.map((row, idx) => {
        const tag = ROW_TAGS[idx] || { label:`🎮 Games ${idx+1}`, badge:'', badgeClass:'' }
        return (
          <section key={idx} style={{ marginBottom:'18px' }}>
            <div className="sec-header">
              <div className="sec-label">
                {tag.label}
                {tag.badge && <span className={`sec-badge ${tag.badgeClass}`}>{tag.badge}</span>}
              </div>
            </div>
            <ScrollRow count={row.length}>
              {row.map((g, i) => {
                const busy = launching === g.game_uid
                return (
                  <div key={i} className="game-card" onClick={() => !busy && launchGame(g)} style={{ opacity:busy?0.7:1, cursor:busy?'wait':'pointer' }}>
                    {g.img
                      ? <img src={g.img} alt={g.name} className="game-card-thumb" onError={e => e.target.style.display='none'} />
                      : <div className="game-card-thumb-placeholder" style={{ background:'#1a1a28' }}>🎰</div>
                    }
                    <div className="game-card-name">{busy ? '⏳ Loading...' : g.name}</div>
                  </div>
                )
              })}
            </ScrollRow>
          </section>
        )
      })}

      {/* MORE GAMES */}
      <section style={{ marginBottom:'20px' }}>
        <div className="sec-header">
          <div className="sec-label">🎮 More Games</div>
          <Link to="/lobby" style={{ fontSize:'11px', color:'var(--text-muted)' }}>View All →</Link>
        </div>
        <div className="hscroll">
          {QUICK_GAMES.map((g, i) => (
            <Link key={i} to={g.path} style={{ textDecoration:'none', flexShrink:0 }}>
              <div className="game-card">
                <div className="game-card-thumb-placeholder" style={{ background:g.color+'22' }}>{g.icon}</div>
                <div className="game-card-name">{g.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HERO FOR GUESTS */}
      {!user && (
        <div style={{ textAlign:'center', padding:'32px 16px', background:'rgba(224,48,48,0.04)', borderRadius:'14px', border:'1px solid rgba(224,48,48,0.1)', marginTop:'10px', marginBottom:'16px' }}>
          <div className="sigma-logo-text" style={{ fontSize:'clamp(22px,6vw,42px)', marginBottom:'8px' }}>SIGMA777</div>
          <p style={{ color:'var(--text-secondary)', fontSize:'14px', marginBottom:'20px' }}>248+ Live Games • Instant Payouts • 24/7 Support</p>
          <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
            <Link to="/signup"><button className="btn-primary" style={{ padding:'12px 28px' }}>🎁 Get 1000 Free Coins</button></Link>
            <Link to="/login"><button style={{ padding:'12px 28px', background:'transparent', border:'1px solid #333', borderRadius:'8px', color:'#aaa', cursor:'pointer', fontSize:'14px' }}>Login</button></Link>
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
  if (err) return null
  if (loading) return <div style={{ height:'200px', background:'var(--bg-card)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--text-muted)', fontSize:'13px' }}>⏳ Loading Live Sports...</div>
  return (
    <div style={{ borderRadius:'12px', overflow:'hidden', border:'1px solid rgba(224,48,48,0.15)' }}>
      <iframe src={url} style={{ width:'100%', height:'420px', border:'none', display:'block' }} allow="autoplay; fullscreen" title="Live Sports" />
    </div>
  )
}
