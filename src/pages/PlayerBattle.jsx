import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PlayerBattle() {
  const navigate = useNavigate()
  return (
    <div style={{ maxWidth:'600px', margin:'0 auto', textAlign:'center', padding:'40px 20px' }}>
      <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'var(--primary)', fontWeight:'700', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', marginBottom:'30px' }}>‹ BACK</button>
      <div style={{ fontSize:'72px', marginBottom:'20px' }}>⚔️</div>
      <h2 style={{ fontFamily:'Cinzel,serif', fontSize:'28px', fontWeight:'900', marginBottom:'12px' }}>
        <span className="sigma-logo-text">PLAYER BATTLE</span>
      </h2>
      <p style={{ color:'var(--text-secondary)', fontSize:'14px', marginBottom:'28px', lineHeight:1.6 }}>
        Challenge other players head-to-head in real-time battles.<br/>
        Coming soon — stay tuned!
      </p>
      <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', padding:'12px 24px', background:'rgba(224,48,48,0.08)', border:'1px solid rgba(224,48,48,0.2)', borderRadius:'12px', color:'var(--primary)', fontSize:'14px', fontWeight:'700' }}>
        🔔 Notify Me When Live
      </div>
    </div>
  )
}
