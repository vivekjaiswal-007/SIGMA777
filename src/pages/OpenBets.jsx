import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import { openAuthModal } from '../utils/authModal.js'

export default function OpenBets() {
  const { user } = useStore()
  const navigate = useNavigate()
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { openAuthModal('login'); return }
    api.get('/bets/history?status=pending&limit=50')
      .then(r => {
        const all = r.data?.bets || []
        const open = all.filter(b => b.status === 'pending' || !b.status || b.result === 'pending')
        setBets(open)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (!user) return null

  return (
    <div style={{ maxWidth:'600px', margin:'0 auto' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
        <h1 style={{ fontSize:'18px', fontWeight:'900', color:'#fff' }}>📋 Open Bets</h1>
        <span style={{ background:'rgba(224,48,48,0.18)', color:'#e03030', border:'1px solid rgba(224,48,48,0.3)', fontSize:'11px', fontWeight:'800', padding:'2px 8px', borderRadius:'20px' }}>
          {bets.length} Active
        </span>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'60px', color:'var(--text-muted)' }}>
          <div className="spinner" style={{ margin:'0 auto 12px' }} />
          <p>Loading open bets...</p>
        </div>
      ) : bets.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px', background:'var(--bg-card)', borderRadius:'14px', border:'1px solid var(--border)' }}>
          <div style={{ fontSize:'48px', marginBottom:'14px' }}>📭</div>
          <h3 style={{ color:'#fff', fontWeight:'700', marginBottom:'8px' }}>No Open Bets</h3>
          <p style={{ color:'var(--text-muted)', fontSize:'13px', marginBottom:'20px' }}>You have no active bets right now.</p>
          <button onClick={() => navigate('/')} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#1e7d32,#4caf50)', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'700', cursor:'pointer' }}>
            Play Now
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {bets.map((bet, i) => (
            <div key={i} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:'12px', padding:'14px 16px', borderLeft:'3px solid #ff9900' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                <div>
                  <div style={{ fontWeight:'700', fontSize:'14px', color:'#fff' }}>{bet.game || 'Game'}</div>
                  <div style={{ fontSize:'11px', color:'var(--text-muted)', marginTop:'2px' }}>
                    {new Date(bet.createdAt).toLocaleString()}
                  </div>
                </div>
                <span style={{ background:'rgba(255,153,0,0.15)', color:'#ff9900', border:'1px solid rgba(255,153,0,0.3)', fontSize:'10px', fontWeight:'800', padding:'3px 8px', borderRadius:'20px', whiteSpace:'nowrap' }}>
                  🔄 OPEN
                </span>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', padding:'8px 10px' }}>
                  <div style={{ fontSize:'10px', color:'var(--text-muted)', marginBottom:'2px' }}>BET AMOUNT</div>
                  <div style={{ fontSize:'15px', fontWeight:'800', color:'#ffe066' }}>🪙 {bet.amount}</div>
                </div>
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'8px', padding:'8px 10px' }}>
                  <div style={{ fontSize:'10px', color:'var(--text-muted)', marginBottom:'2px' }}>POTENTIAL WIN</div>
                  <div style={{ fontSize:'15px', fontWeight:'800', color:'#4caf50' }}>🪙 {bet.payout || bet.potentialPayout || '—'}</div>
                </div>
              </div>

              {/* Bet details if available */}
              {bet.betData && (
                <div style={{ marginTop:'8px', fontSize:'11px', color:'var(--text-muted)', background:'rgba(255,255,255,0.03)', borderRadius:'6px', padding:'6px 10px' }}>
                  {typeof bet.betData === 'object' ? Object.entries(bet.betData).map(([k,v]) => (
                    <span key={k} style={{ marginRight:'12px' }}><strong>{k}:</strong> {String(v)}</span>
                  )) : String(bet.betData)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
