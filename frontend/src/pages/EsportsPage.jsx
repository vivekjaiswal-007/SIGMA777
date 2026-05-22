import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

const ESPORTS = [
  { name:'E-Cricket', sub:'E-SPORTS', color:'linear-gradient(135deg,#1a3a6a,#2255aa)', icon:'🏏' },
  { name:'E-Cricket: X-Battle Bats', sub:'E-SPORTS', color:'linear-gradient(135deg,#6a4a00,#cc8800)', icon:'🏏' },
  { name:'E-Soccer Volta', sub:'E-SPORTS', color:'linear-gradient(135deg,#0a4a1a,#119933)', icon:'⚽' },
  { name:'E-Horse Racing', sub:'E-SPORTS', color:'linear-gradient(135deg,#4a1a5a,#882299)', icon:'🏇' },
  { name:'E-Soccer Penalty', sub:'E-SPORTS', color:'linear-gradient(135deg,#1a3a6a,#2255aa)', icon:'⚽' },
  { name:'E-Fighting', sub:'E-SPORTS', color:'linear-gradient(135deg,#5a1010,#cc2222)', icon:'🥊' },
  { name:'E-Tennis', sub:'E-SPORTS', color:'linear-gradient(135deg,#6a4a00,#cc8800)', icon:'🎾' },
  { name:'E-Basketball', sub:'E-SPORTS', color:'linear-gradient(135deg,#6a3010,#cc5511)', icon:'🏀' },
  { name:'E-Basketball Blitz', sub:'E-SPORTS', color:'linear-gradient(135deg,#1a1a5a,#3344cc)', icon:'🏀' },
  { name:'E-Soccer X-Battle FC', sub:'E-SPORTS', color:'linear-gradient(135deg,#1a3a6a,#2255aa)', icon:'⚽' },
  { name:'E-Vaquejada', sub:'E-SPORTS', color:'linear-gradient(135deg,#3a3a1a,#888822)', icon:'🤠' },
]

export default function EsportsPage() {
  const navigate = useNavigate()
  const { user } = useStore()
  const [launching, setLaunching] = useState(null)
  const [modal, setModal] = useState(null)

  async function launch(name) {
    if (!user) { toast.error('Login karein pehle!'); navigate('/login'); return }
    setLaunching(name)
    try {
      const res = await api.post('/live-casino/launch', { game_uid:'7004', language:'hi', currency_code:'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunching(null)
  }

  return (
    <div style={{ maxWidth:'1400px', margin:'0 auto' }}>

      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:9999, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0a0a0f', borderBottom:'1px solid rgba(224,48,48,0.2)', flexShrink:0 }}>
            <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:'700', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' }}>‹ BACK</button>
            <span className="sigma-logo-text" style={{ fontSize:'15px' }}>SIGMA777</span>
            <button onClick={() => setModal(null)} style={{ padding:'6px 14px', background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.4)', borderRadius:'7px', color:'#ff6666', cursor:'pointer', fontWeight:'700', fontSize:'12px' }}>✕ Exit</button>
          </div>
          <iframe src={modal} style={{ flex:1, border:'none' }} allow="autoplay; fullscreen" title="E-Sports" />
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
        <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:'700', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', flexShrink:0 }}>‹ BACK</button>
        <div>
          <h2 style={{ fontSize:'16px', fontWeight:'800', letterSpacing:'0.5px' }}>🎮 E-SPORTS</h2>
          <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>Virtual sports betting — cricket, soccer, basketball & more</p>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px' }}>
        {ESPORTS.map((g, i) => (
          <div key={i} onClick={() => launch(g.name)}
            style={{ borderRadius:'12px', overflow:'hidden', cursor: launching===g.name?'wait':'pointer', opacity: launching===g.name?0.7:1, transition:'transform 0.18s', position:'relative', border:'1px solid rgba(255,255,255,0.06)' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform='none'}
          >
            {/* Thumb */}
            <div style={{ aspectRatio:'1/1', background:g.color, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', position:'relative' }}>
              <div style={{ fontSize:'clamp(28px,8vw,48px)' }}>{g.icon}</div>
              <div style={{ fontSize:'clamp(9px,2.5vw,12px)', fontWeight:'800', color:'#fff', textAlign:'center', padding:'0 8px', textTransform:'uppercase', letterSpacing:'0.5px', lineHeight:1.2, textShadow:'0 1px 6px rgba(0,0,0,0.6)' }}>{g.name}</div>
              {/* NEW badge on first 3 */}
              {i < 3 && <div style={{ position:'absolute', top:'7px', right:'7px', fontSize:'8px', fontWeight:'800', padding:'2px 5px', borderRadius:'3px', background:'rgba(224,48,48,0.9)', color:'#fff', letterSpacing:'0.5px' }}>NEW</div>}
              {launching === g.name && (
                <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', color:'#fff', fontWeight:'700' }}>⏳ Loading...</div>
              )}
            </div>
            {/* Label */}
            <div style={{ background:'#131320', padding:'7px 8px' }}>
              <div style={{ fontSize:'clamp(9px,2.5vw,11px)', fontWeight:'700', color:'#ddd', textTransform:'uppercase', lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{g.name}</div>
              <div style={{ fontSize:'9px', color:'var(--text-muted)', letterSpacing:'0.5px', marginTop:'2px' }}>{g.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
