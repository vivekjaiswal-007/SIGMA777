import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function PlayerBattle() {
  const navigate = useNavigate()
  return (
    <div style={{ maxWidth:'600px', margin:'0 auto', textAlign:'center', padding:'60px 20px' }}>
      <button onClick={() => navigate(-1)} style={{ display:'block', marginBottom:'32px', background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'8px', color:'var(--text-secondary)', padding:'7px 14px', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>← Back</button>
      <div style={{ fontSize:'72px', marginBottom:'20px' }}>⚔️</div>
      <h1 style={{ fontFamily:'Cinzel,serif', fontSize:'28px', fontWeight:'900', marginBottom:'10px' }}>
        <span className="sigma-logo-text">Player Battle</span>
      </h1>
      <p style={{ color:'var(--text-secondary)', fontSize:'15px', marginBottom:'28px', lineHeight:1.6 }}>
        Challenge other players head-to-head.<br/>This feature is coming soon!
      </p>
      <div style={{ display:'inline-block', padding:'10px 24px', background:'rgba(255,153,0,0.1)', border:'1px solid rgba(255,153,0,0.3)', borderRadius:'20px', color:'#ff9900', fontSize:'13px', fontWeight:'700', letterSpacing:'1px' }}>
        🚧 COMING SOON
      </div>
    </div>
  )
}
