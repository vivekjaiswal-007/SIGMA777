import { openAuthModal } from '../utils/authModal.js'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

const ESPORTS_GAMES = [
  { name:'E-Cricket', sub:'E-SPORTS', emoji:'🏏', bg:'linear-gradient(135deg,#1a3a6a,#2a5ab0)', uid:'7004' },
  { name:'E-Cricket: X-Battle Bats', sub:'E-SPORTS', emoji:'🏏', bg:'linear-gradient(135deg,#6a4a00,#c4880a)', uid:'7004' },
  { name:'E-Soccer: Volta', sub:'E-SPORTS', emoji:'⚽', bg:'linear-gradient(135deg,#006a1a,#00c030)', uid:'7004' },
  { name:'E-Horse Racing', sub:'E-SPORTS', emoji:'🐎', bg:'linear-gradient(135deg,#4a006a,#9900cc)', uid:'7004' },
  { name:'E-Soccer: Penalty', sub:'E-SPORTS', emoji:'⚽', bg:'linear-gradient(135deg,#003a6a,#0077cc)', uid:'7004' },
  { name:'E-Fighting', sub:'E-SPORTS', emoji:'🥊', bg:'linear-gradient(135deg,#6a0000,#cc2200)', uid:'7004' },
  { name:'E-Tennis', sub:'E-SPORTS', emoji:'🎾', bg:'linear-gradient(135deg,#6a4a00,#d4a010)', uid:'7004' },
  { name:'E-Basketball', sub:'E-SPORTS', emoji:'🏀', bg:'linear-gradient(135deg,#6a3000,#cc6600)', uid:'7004' },
  { name:'E-Basketball: Blitz', sub:'E-SPORTS', emoji:'🏀', bg:'linear-gradient(135deg,#1a006a,#4400cc)', uid:'7004' },
  { name:'E-Soccer X-Battle FC', sub:'E-SPORTS', emoji:'⚽', bg:'linear-gradient(135deg,#006a60,#00ccaa)', uid:'7004' },
  { name:'E-Vaquejada', sub:'E-SPORTS', emoji:'🤠', bg:'linear-gradient(135deg,#2a3a6a,#4060bb)', uid:'7004' },
]

export default function ESports() {
  const { user } = useStore()
  const navigate = useNavigate()
  const [launching, setLaunching] = useState(null)
  const [modal, setModal] = useState(null)

  async function launch(game) {
    if (!user) { toast.error('Login karein pehle!'); openAuthModal('login'); return }
    setLaunching(game.name)
    try {
      const res = await api.post('/live-casino/launch', { game_uid: game.uid, language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunching(null)
  }

  return (
    <div style={{ maxWidth:'900px', margin:'0 auto' }}>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:9999, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0a0a0f', flexShrink:0, borderBottom:'1px solid rgba(224,48,48,0.2)' }}>
            <span className="sigma-logo-text" style={{ fontSize:'16px' }}>SIGMA777 — E-Sports</span>
            <button onClick={() => setModal(null)} style={{ padding:'7px 18px', background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.4)', borderRadius:'8px', color:'#ff6666', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>✕ Exit</button>
          </div>
          <iframe src={modal} style={{ flex:1, border:'none' }} allow="autoplay; fullscreen" title="E-Sports" />
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
        <button onClick={() => navigate(-1)} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text-secondary)', padding:'7px 12px', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>← Back</button>
        <div>
          <h1 style={{ fontSize:'20px', fontWeight:'800' }}>🕹️ E-Sports</h1>
          <p style={{ fontSize:'12px', color:'var(--text-muted)' }}>Virtual sports betting — E-Cricket, E-Soccer & more</p>
        </div>
      </div>

      {/* Game Grid — 3 col like Mahaling777 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
        {ESPORTS_GAMES.map((g, i) => {
          const busy = launching === g.name
          return (
            <div key={i} onClick={() => !busy && launch(g)} style={{ background:'var(--bg-card)', borderRadius:'12px', overflow:'hidden', cursor:busy?'wait':'pointer', transition:'transform 0.2s, box-shadow 0.2s', border:'1px solid rgba(255,255,255,0.06)', opacity:busy?0.7:1 }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}
            >
              {/* Thumb */}
              <div style={{ aspectRatio:'4/3', background:g.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', position:'relative' }}>
                <div style={{ fontSize:'clamp(28px,6vw,44px)' }}>{g.emoji}</div>
                <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, background:'linear-gradient(transparent 40%, rgba(0,0,0,0.6))', borderRadius:'0' }} />
                <div style={{ position:'absolute', top:'8px', left:'8px', right:'8px', fontSize:'clamp(10px,2.5vw,13px)', fontWeight:'900', color:'#fff', textTransform:'uppercase', letterSpacing:'0.5px', textShadow:'0 2px 8px rgba(0,0,0,0.8)', lineHeight:1.2, zIndex:2 }}>
                  {g.name}
                </div>
                {busy && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.6)', zIndex:3, fontSize:'24px' }}>⏳</div>}
              </div>
              {/* Label */}
              <div style={{ padding:'7px 10px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontSize:'10px', color:'var(--text-muted)', fontWeight:'600', letterSpacing:'0.5px', textTransform:'uppercase' }}>{g.sub}</span>
                <span style={{ fontSize:'9px', fontWeight:'800', padding:'2px 6px', borderRadius:'3px', background:'rgba(153,68,255,0.18)', color:'#9944ff', border:'1px solid rgba(153,68,255,0.3)' }}>VIRTUAL</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
