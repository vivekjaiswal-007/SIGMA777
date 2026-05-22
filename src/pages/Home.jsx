import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

const BANNERS = [
  { bg:'linear-gradient(135deg,#0a0020 0%,#1a0040 50%,#0a0020 100%)', accent:'#9944ff', tag:'TRENDING', title:'Aviator', sub:'Crash & Win Big — Up to 100x Multiplier!', icon:'✈️', btn:'Play Now', path:'/games/aviator' },
  { bg:'linear-gradient(135deg,#1a0000 0%,#3a0010 50%,#1a0000 100%)', accent:'#ff4444', tag:'LIVE NOW 🔴', title:'Live Cricket', sub:'IPL • T20 • PSL • Real Money Betting', icon:'🏏', btn:'Bet Now', path:'/live-casino' },
  { bg:'linear-gradient(135deg,#001a00 0%,#003a10 50%,#001a00 100%)', accent:'#00d084', tag:'GREY GAMING', title:'GreyJet', sub:'The Ultimate Crash Game Experience', icon:'🚀', btn:'Play Now', path:'/games/crash-rocket' },
  { bg:'linear-gradient(135deg,#0a1020 0%,#102040 50%,#0a1020 100%)', accent:'#4488ff', tag:'POPULAR', title:'Teen Patti', sub:"India's Favourite Card Game", icon:'♠️', btn:'Play Now', path:'/games/teen-patti' },
  { bg:'linear-gradient(135deg,#1a0a00 0%,#3a2000 50%,#1a0a00 100%)', accent:'#ff9900', tag:'NEW LAUNCH', title:'Mines', sub:'Find Diamonds, Avoid Mines — Big Wins!', icon:'💎', btn:'Play Now', path:'/games/mines' },
]

const CATS = [
  { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M18 8v10l6 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="10" cy="14" r="2" fill="#ff4444"/><circle cx="26" cy="14" r="2" fill="#ff4444"/></svg>, label:'IN-PLAY', badge:null, route:'inplay' },
  { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="10" width="28" height="18" rx="3" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M12 10V8a2 2 0 012-2h8a2 2 0 012 2v2" stroke="#fff" strokeWidth="1.5"/><circle cx="18" cy="19" r="3" stroke="#fff" strokeWidth="1.5"/><path d="M4 15h28" stroke="#fff" strokeWidth="1" strokeDasharray="2 2"/></svg>, label:'SPORTSBOOK', badge:null, route:'sportsbook' },
  { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4L6 10v8c0 7 5 13 12 15 7-2 12-8 12-15v-8L18 4z" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M13 18l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>, label:'VIRTUAL', badge:null, route:'virtual' },
  { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="14" width="28" height="16" rx="3" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M12 22h2M20 20v4M24 20v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="16" cy="22" r="1" fill="#fff"/><path d="M10 14V10a8 8 0 0116 0v4" stroke="#fff" strokeWidth="1.5"/></svg>, label:'E-SPORTS', badge:'NEW', route:'esports' },
  { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><polygon points="18,4 22,14 32,14 24,21 27,31 18,25 9,31 12,21 4,14 14,14" stroke="#fff" strokeWidth="1.5" fill="none"/></svg>, label:'SPECIAL\nMARKET', badge:'NEW', route:'special' },
  { icon: <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="12" cy="18" r="7" stroke="#fff" strokeWidth="1.5" fill="none"/><circle cx="24" cy="18" r="7" stroke="#fff" strokeWidth="1.5" fill="none"/><path d="M18 11v14" stroke="#fff" strokeWidth="1.5"/></svg>, label:'PLAYER\nBATTLE', badge:null, route:'battle' },
]

const TRENDING_GAMES = [
  { name:'Teen Patti', path:'/games/teen-patti', icon:'♠️', color:'#e03030', img:null },
  { name:'Aviator', path:'/games/aviator', icon:'✈️', color:'#9944ff', img:null },
  { name:'Roulette', path:'/games/roulette', icon:'🎡', color:'#00d084', img:null },
  { name:'Dragon Tiger', path:'/games/dragon-tiger', icon:'🐉', color:'#ff4444', img:null },
  { name:'Andar Bahar', path:'/games/andar-bahar', icon:'🎯', color:'#ff9900', img:null },
  { name:'Mines', path:'/games/mines', icon:'💎', color:'#00d084', img:null },
  { name:'Plinko', path:'/games/plinko', icon:'⚡', color:'#ff4488', img:null },
  { name:'Blackjack', path:'/games/blackjack', icon:'🃏', color:'#4488ff', img:null },
  { name:'Color Pred.', path:'/games/color-prediction', icon:'🎨', color:'#ff4488', img:null },
  { name:'Crash Rocket', path:'/games/crash-rocket', icon:'🚀', color:'#9944ff', img:null },
]

const ROW_TAGS = [
  { label:'🔥 Trending', badge:'HOT', bc:'#e03030' },
  { label:'✈️ Crash Games', badge:'POPULAR', bc:'#4488ff' },
  { label:'⭐ Top Picks', badge:'TOP', bc:'#00d084' },
  { label:'🎯 Recommended', badge:'', bc:'' },
  { label:'🏆 Top Rated', badge:'', bc:'' },
  { label:'💥 Live Casino', badge:'LIVE', bc:'#e03030' },
  { label:'🎲 Table Games', badge:'', bc:'' },
  { label:'🎰 Slots & More', badge:'', bc:'' },
]

function BannerSlider() {
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()
  const timer = useRef(null)

  useEffect(() => {
    timer.current = setInterval(() => setIdx(i => (i + 1) % BANNERS.length), 3800)
    return () => clearInterval(timer.current)
  }, [])

  const go = (i) => { setIdx(i); clearInterval(timer.current); timer.current = setInterval(() => setIdx(j => (j + 1) % BANNERS.length), 3800) }
  const b = BANNERS[idx]

  return (
    <div style={{ position:'relative', width:'100%', aspectRatio:'16/9', borderRadius:'12px', overflow:'hidden', marginBottom:'14px', background:b.bg, transition:'background 0.5s', maxHeight:'340px' }}>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at 75% 50%, ${b.accent}30 0%, transparent 65%)` }} />
      {/* Decorative big icon */}
      <div style={{ position:'absolute', right:'-2%', top:'50%', transform:'translateY(-50%)', fontSize:'clamp(60px,18vw,140px)', opacity:0.18, userSelect:'none' }}>{b.icon}</div>
      {/* Content */}
      <div style={{ position:'relative', zIndex:2, height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', padding:'clamp(16px,5vw,52px)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'7px', marginBottom:'clamp(6px,1.5vw,14px)' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:b.accent, display:'inline-block', animation:'pulse-live 1.4s infinite' }} />
          <span style={{ fontSize:'clamp(9px,2vw,13px)', color:b.accent, fontWeight:'800', letterSpacing:'2.5px', textTransform:'uppercase' }}>{b.tag}</span>
        </div>
        <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'clamp(20px,6vw,52px)', color:'white', lineHeight:1.05, marginBottom:'clamp(6px,1.5vw,14px)', textShadow:'0 2px 16px rgba(0,0,0,0.6)', fontWeight:'900' }}>
          {b.icon} {b.title}
        </h2>
        <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'clamp(10px,2.2vw,17px)', marginBottom:'clamp(14px,3vw,28px)', maxWidth:'60%' }}>{b.sub}</p>
        <button onClick={() => navigate(b.path)} style={{ alignSelf:'flex-start', padding:'clamp(9px,2vw,16px) clamp(18px,4vw,36px)', background:`linear-gradient(135deg,${b.accent}cc,${b.accent})`, border:'none', borderRadius:'9px', color:'#fff', fontWeight:'800', fontSize:'clamp(11px,2.2vw,17px)', cursor:'pointer', boxShadow:`0 4px 20px ${b.accent}55`, whiteSpace:'nowrap', letterSpacing:'0.5px' }}>
          {b.btn} →
        </button>
      </div>
      {/* Dots */}
      <div style={{ position:'absolute', bottom:'10px', left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px', zIndex:3 }}>
        {BANNERS.map((_, i) => (
          <button key={i} onClick={() => go(i)} style={{ width: i===idx?'18px':'6px', height:'6px', borderRadius:'3px', background: i===idx?b.accent:'rgba(255,255,255,0.3)', border:'none', cursor:'pointer', padding:0, transition:'all 0.25s' }} />
        ))}
      </div>
      {/* Prev/Next */}
      <button onClick={() => go((idx-1+BANNERS.length)%BANNERS.length)} style={{ position:'absolute', left:'10px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 }}>‹</button>
      <button onClick={() => go((idx+1)%BANNERS.length)} style={{ position:'absolute', right:'10px', top:'50%', transform:'translateY(-50%)', width:'28px', height:'28px', borderRadius:'50%', background:'rgba(0,0,0,0.4)', border:'1px solid rgba(255,255,255,0.15)', color:'white', fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:3 }}>›</button>
    </div>
  )
}

function ScrollRow({ children, count }) {
  const ref = useRef(null)
  const anim = useRef(null)
  const paused = useRef(false)
  const pos = useRef(0)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const W = 138; const total = count * W
    function tick() { if (!paused.current) { pos.current += 0.5; if (pos.current >= total) pos.current = 0; if (el) el.scrollLeft = pos.current } anim.current = requestAnimationFrame(tick) }
    anim.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(anim.current)
  }, [count])
  return (
    <div style={{ position:'relative' }}>
      <button onClick={() => { paused.current=true; pos.current=Math.max(0,pos.current-280); if(ref.current) ref.current.scrollLeft=pos.current; setTimeout(()=>paused.current=false,1500) }} style={{ position:'absolute', left:0, top:'50%', transform:'translateY(-50%)', zIndex:10, width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'none', color:'white', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>
      <div ref={ref} className="hscroll" style={{ paddingLeft:'30px', paddingRight:'30px' }} onMouseEnter={()=>paused.current=true} onMouseLeave={()=>paused.current=false} onTouchStart={()=>paused.current=true} onTouchEnd={()=>setTimeout(()=>paused.current=false,2000)}>
        {children}{children}
      </div>
      <button onClick={() => { paused.current=true; pos.current+=280; if(ref.current) ref.current.scrollLeft=pos.current; setTimeout(()=>paused.current=false,1500) }} style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', zIndex:10, width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.12)', border:'none', color:'white', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>›</button>
    </div>
  )
}

export default function Home() {
  const { user, balance } = useStore()
  const navigate = useNavigate()
  const [liveGames, setLiveGames] = useState([])
  const [launching, setLaunching] = useState(null)
  const [modal, setModal] = useState(null)

  useEffect(() => {
    api.get('/live-casino/games').then(r => setLiveGames(r.data.games || [])).catch(() => {})
  }, [])

  async function launchLive(label) {
    if (!user) { toast.error('Login karein pehle!'); navigate('/login'); return }
    setLaunching(label)
    try {
      const res = await api.post('/live-casino/launch', { game_uid:'7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunching(null)
  }

  function handleCat(route) {
    switch(route) {
      case 'inplay': launchLive('inplay'); break
      case 'sportsbook': launchLive('sportsbook'); break
      case 'virtual': navigate('/live-casino'); break
      case 'esports': navigate('/esports'); break
      case 'special': launchLive('special'); break
      case 'battle': navigate('/player-battle'); break
      default: break
    }
  }

  const rows = []
  for (let i = 0; i < liveGames.length; i += 20) rows.push(liveGames.slice(i, i + 20))

  return (
    <div style={{ maxWidth:'1400px', margin:'0 auto' }}>

      {/* MODAL */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:9999, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0a0a0f', borderBottom:'1px solid rgba(224,48,48,0.2)', flexShrink:0 }}>
            <span className="sigma-logo-text" style={{ fontSize:'16px' }}>SIGMA777</span>
            <button onClick={() => setModal(null)} style={{ padding:'7px 18px', background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.4)', borderRadius:'8px', color:'#ff6666', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>✕ Exit</button>
          </div>
          <iframe src={modal} style={{ flex:1, border:'none' }} allow="autoplay; fullscreen" title="Live Game" />
        </div>
      )}

      {/* WELCOME BAR */}
      {user && (
        <div style={{ padding:'9px 13px', background:'rgba(224,48,48,0.07)', border:'1px solid rgba(224,48,48,0.15)', borderRadius:'10px', marginBottom:'12px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:'10px', color:'var(--text-muted)', letterSpacing:'1px' }}>WELCOME BACK</div>
            <div style={{ fontSize:'15px', fontWeight:'700' }}>{user.username} 👑</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:'10px', color:'var(--text-muted)' }}>BALANCE</div>
            <div style={{ color:'var(--primary)', fontWeight:'800', fontSize:'16px' }}>🪙 {Number(balance||0).toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* BANNER 16:9 */}
      <BannerSlider />

      {/* MARQUEE TABS — Aviator | Grey Gaming | Sunrisers... */}
      <div style={{ display:'flex', gap:'0', borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:'14px', overflowX:'auto', scrollbarWidth:'none' }}>
        {['✈️ Aviator','🎮 Grey Gaming','🏏 Live Cricket','🎯 Teen Patti','💎 Mines'].map((t,i) => (
          <button key={i} style={{ flexShrink:0, padding:'8px 14px', background:'transparent', border:'none', borderBottom: i===0?'2px solid var(--primary)':'2px solid transparent', color: i===0?'#fff':'var(--text-muted)', fontSize:'12px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap', display:'flex', alignItems:'center', gap:'5px' }}
            onClick={() => {
              const paths = ['/games/aviator','/games/crash-rocket','/live-casino','/games/teen-patti','/games/mines']
              navigate(paths[i])
            }}
          >{t}</button>
        ))}
      </div>

      {/* 6 CATEGORY BUTTONS — 3x2 grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'18px' }}>
        {CATS.map((c, i) => (
          <button key={i} onClick={() => handleCat(c.route)} disabled={!!launching}
            style={{ position:'relative', background:'var(--bg-card)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'12px', padding:'16px 8px 12px', display:'flex', flexDirection:'column', alignItems:'center', gap:'8px', cursor:'pointer', transition:'all 0.2s', opacity: launching?0.7:1 }}
            onMouseEnter={e => { e.currentTarget.style.background='var(--bg-hover)'; e.currentTarget.style.borderColor='rgba(224,48,48,0.3)' }}
            onMouseLeave={e => { e.currentTarget.style.background='var(--bg-card)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.07)' }}
          >
            {c.badge && (
              <div style={{ position:'absolute', top:'6px', right:'6px', fontSize:'8px', fontWeight:'800', padding:'2px 5px', borderRadius:'3px', background:'rgba(224,48,48,0.85)', color:'#fff', letterSpacing:'0.5px' }}>
                {c.badge}
              </div>
            )}
            <div style={{ opacity:0.9 }}>{c.icon}</div>
            <div style={{ fontSize:'clamp(9px,2.5vw,11px)', fontWeight:'700', color:'#ddd', textAlign:'center', letterSpacing:'0.5px', lineHeight:1.3, whiteSpace:'pre-line' }}>{c.label}</div>
            {launching === c.route && <div style={{ fontSize:'9px', color:'var(--primary)' }}>Loading...</div>}
          </button>
        ))}
      </div>

      {/* TRENDING SECTION */}
      <section style={{ marginBottom:'18px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <span style={{ fontSize:'13px', fontWeight:'700' }}>🔥 TRENDING</span>
            <span style={{ fontSize:'8px', fontWeight:'800', padding:'2px 6px', borderRadius:'3px', background:'rgba(224,48,48,0.2)', color:'var(--primary)', border:'1px solid rgba(224,48,48,0.3)', letterSpacing:'0.5px' }}>HOT</span>
          </div>
          <div style={{ display:'flex', gap:'6px' }}>
            <button id="tprev" style={{ width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'none', color:'white', fontSize:'14px', cursor:'pointer' }}>‹</button>
            <button id="tnext" style={{ width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', border:'none', color:'white', fontSize:'14px', cursor:'pointer' }}>›</button>
          </div>
        </div>
        <TrendingRow games={TRENDING_GAMES} />
      </section>

      {/* LIVE CASINO ROWS */}
      {rows.map((row, idx) => {
        const tag = ROW_TAGS[idx] || { label:`🎮 Games ${idx+1}`, badge:'', bc:'' }
        return (
          <section key={idx} style={{ marginBottom:'16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'9px' }}>
              <span style={{ fontSize:'13px', fontWeight:'700' }}>{tag.label}</span>
              {tag.badge && <span style={{ fontSize:'8px', fontWeight:'800', padding:'2px 6px', borderRadius:'3px', background:tag.bc+'22', color:tag.bc, border:`1px solid ${tag.bc}44`, letterSpacing:'0.5px' }}>{tag.badge}</span>}
            </div>
            <ScrollRow count={row.length}>
              {row.map((g, i) => {
                const busy = launching === g.game_uid
                return (
                  <div key={i} className="game-card" onClick={() => { if (!busy) { if (!user) { toast.error('Login karein!'); navigate('/login'); return } setLaunching(g.game_uid); api.post('/live-casino/launch',{game_uid:g.game_uid,language:'hi',currency_code:'INR'}).then(r=>{ if(r.data.success&&r.data.gameUrl) setModal(r.data.gameUrl); else toast.error('Launch failed') }).catch(()=>toast.error('Failed')).finally(()=>setLaunching(null)) } }} style={{ opacity:busy?0.7:1, cursor:busy?'wait':'pointer' }}>
                    {g.img ? <img src={g.img} alt={g.name} className="game-card-thumb" onError={e=>e.target.style.display='none'} /> : <div className="game-card-thumb-placeholder" style={{ background:'#1a1a28' }}>🎰</div>}
                    <div className="game-card-name">{busy?'⏳...':g.name}</div>
                  </div>
                )
              })}
            </ScrollRow>
          </section>
        )
      })}

      {/* GUEST CTA */}
      {!user && (
        <div style={{ textAlign:'center', padding:'28px 16px', background:'rgba(224,48,48,0.04)', borderRadius:'14px', border:'1px solid rgba(224,48,48,0.1)', marginTop:'8px', marginBottom:'16px' }}>
          <div className="sigma-logo-text" style={{ fontSize:'clamp(22px,6vw,40px)', marginBottom:'8px' }}>SIGMA777</div>
          <p style={{ color:'var(--text-secondary)', fontSize:'13px', marginBottom:'18px' }}>248+ Live Games • Instant Payouts • 24/7 Support</p>
          <div style={{ display:'flex', gap:'10px', justifyContent:'center' }}>
            <Link to="/signup"><button className="btn-primary" style={{ padding:'11px 26px' }}>🎁 Get 1000 Free Coins</button></Link>
            <Link to="/login"><button style={{ padding:'11px 26px', background:'transparent', border:'1px solid #333', borderRadius:'8px', color:'#aaa', cursor:'pointer', fontSize:'14px' }}>Login</button></Link>
          </div>
        </div>
      )}
    </div>
  )
}

function TrendingRow({ games }) {
  const ref = useRef(null)
  return (
    <div style={{ position:'relative' }}>
      <div ref={ref} className="hscroll">
        {games.map((g, i) => (
          <Link key={i} to={g.path} style={{ textDecoration:'none', flexShrink:0 }}>
            <div className="game-card">
              <div className="game-card-thumb-placeholder" style={{ background:g.color+'22' }}>{g.icon}</div>
              <div className="game-card-name">{g.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
