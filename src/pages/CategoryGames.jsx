import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import { filterGames } from '../utils/gameFilter.js'
import { openAuthModal } from '../utils/authModal.js'
import toast from 'react-hot-toast'

export default function CategoryGames() {
  const { category } = useParams()
  const navigate = useNavigate()
  const { user } = useStore()
  const [allGames, setAllGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [launching, setLaunching] = useState(null)

  useEffect(() => {
    api.get('/live-casino/games')
      .then(r => setAllGames(r.data.games || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const rows = filterGames(allGames)
  const row = rows.find(r => r.label.toLowerCase() === decodeURIComponent(category).toLowerCase())
  const games = row?.games || []

  async function launchGame(g) {
    if (!user) { openAuthModal('login'); return }
    setLaunching(g.game_uid)
    try {
      const res = await api.post('/live-casino/launch', { game_uid: g.game_uid, language: 'hi', currency_code: 'INR' })
      if (res.data.success && res.data.gameUrl) setModal(res.data.gameUrl)
      else toast.error(res.data.message || 'Launch failed')
    } catch { toast.error('Launch failed') }
    setLaunching(null)
  }

  return (
    <div style={{ maxWidth:'1400px', margin:'0 auto' }}>

      {/* Game modal */}
      {modal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.97)', zIndex:9999, display:'flex', flexDirection:'column' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#0a0a0f', flexShrink:0, borderBottom:'1px solid rgba(34,139,34,0.3)' }}>
            <span style={{ fontFamily:'Cinzel,serif', fontWeight:'900', fontSize:'16px', color:'#4caf50' }}>SIGMA<span style={{ color:'#ffe066' }}>777</span></span>
            <button onClick={() => setModal(null)} style={{ padding:'7px 18px', background:'rgba(255,68,68,0.15)', border:'1px solid rgba(255,68,68,0.4)', borderRadius:'8px', color:'#ff6666', cursor:'pointer', fontWeight:'700', fontSize:'13px' }}>✕ Exit</button>
          </div>
          <iframe src={modal} style={{ flex:1, border:'none' }} allow="autoplay; fullscreen" title="Live Game" />
        </div>
      )}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
        <button onClick={() => navigate(-1)} style={{ background:'#1a1a1a', border:'1px solid #2a2a2a', borderRadius:'8px', color:'#ccc', padding:'7px 12px', cursor:'pointer', fontSize:'13px', fontWeight:'600' }}>← Back</button>
        <div>
          <h1 style={{ fontSize:'18px', fontWeight:'900', color:'#fff', textTransform:'uppercase' }}>{decodeURIComponent(category)}</h1>
          <p style={{ fontSize:'11px', color:'var(--text-muted)' }}>{games.length} games</p>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>⏳ Loading...</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px' }}>
          {games.map((g, i) => {
            const busy = launching === g.game_uid
            return (
              <div key={i} className="game-card" onClick={() => !busy && launchGame(g)}
                style={{ width:'100%', opacity:busy?0.6:1, cursor:busy?'wait':'pointer' }}>
                {g.img
                  ? <img src={g.img} alt={g.name} className="game-card-thumb" style={{ height:'110px' }}
                      onError={e=>{e.target.style.display='none';e.target.nextSibling&&(e.target.nextSibling.style.display='flex')}}/>
                  : null}
                <div className="game-card-thumb-placeholder" style={{ background:'#1a1a2a', fontSize:'24px', height:'110px', display:g.img?'none':'flex' }}>🎰</div>
                <div className="game-card-name" style={{ fontSize:'10px', padding:'5px 6px 7px' }}>{busy?'⏳':g.name}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
