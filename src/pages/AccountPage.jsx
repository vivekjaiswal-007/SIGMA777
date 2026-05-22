import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

export default function AccountPage() {
  const { user, balance, logout } = useStore()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null)

  // Deposit state
  const [depositAmount, setDepositAmount] = useState(500)
  const [utrId, setUtrId] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotName, setScreenshotName] = useState('')
  const [qrCodes, setQrCodes] = useState([])
  const [qrLoading, setQrLoading] = useState(false)
  const [selectedQR, setSelectedQR] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState(500)
  const [withdrawUPI, setWithdrawUPI] = useState('')
  const [withdrawName, setWithdrawName] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawHistory, setWithdrawHistory] = useState([])

  // Bet history
  const [bets, setBets] = useState([])

  useEffect(() => {
    api.get('/bets/history?limit=20').then(r => setBets(r.data?.bets || [])).catch(() => {})
    api.get('/wallet/withdrawals').then(r => setWithdrawHistory(r.data?.requests || [])).catch(() => {})
  }, [])

  if (!user) { navigate('/login'); return null }

  const generateQR = async () => {
    if (depositAmount < 100) return toast.error('Minimum deposit ₹100')
    setQrLoading(true); setSelectedQR(null); setQrCodes([])
    try {
      const { data } = await api.get(`/wallet/qr-all?amount=${depositAmount}&_t=${Date.now()}`)
      setQrCodes(data.qrCodes || [])
      if (data.qrCodes?.length > 0) setSelectedQR(0)
      toast.success('QR generated!')
    } catch {
      const nonce = Date.now()
      const upiStr = `upi://pay?pa=sigma777@upi&pn=SIGMA777&am=${depositAmount}&cu=INR&tn=RB${nonce}`
      setQrCodes([{ upiId:'sigma777@upi', name:'SIGMA777 Casino', amount:depositAmount, coins:depositAmount, txnRef:`RB${nonce}`, qrUrl:`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiStr)}&margin=10` }])
      setSelectedQR(0)
    }
    setQrLoading(false)
  }

  const submitDeposit = async () => {
    if (!utrId.trim()) return toast.error('Enter UTR/Transaction ID')
    if (!screenshot) return toast.error('Upload payment screenshot')
    setSubmitLoading(true)
    try {
      const fd = new FormData()
      fd.append('amount', depositAmount); fd.append('utrId', utrId.trim()); fd.append('screenshot', screenshot)
      await api.post('/wallet/deposit-request', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Deposit request submitted!')
      setUtrId(''); setScreenshot(null); setScreenshotName(''); setQrCodes([]); setSelectedQR(null)
    } catch(e) { toast.error(e?.response?.data?.message || 'Failed') }
    setSubmitLoading(false)
  }

  const submitWithdraw = async () => {
    if (withdrawAmount < 100) return toast.error('Minimum ₹100')
    if (!withdrawUPI.trim()) return toast.error('Enter UPI ID')
    if (withdrawAmount > balance) return toast.error('Insufficient balance')
    setWithdrawing(true)
    try {
      const { data } = await api.post('/wallet/withdraw', { amount: withdrawAmount, upiId: withdrawUPI, upiName: withdrawName })
      toast.success(data.message)
      setWithdrawHistory(p => [{ type:'withdraw_pending', amount:withdrawAmount, withdrawStatus:'pending', upiId:withdrawUPI, createdAt:new Date() }, ...p])
      setWithdrawAmount(500); setWithdrawUPI(''); setWithdrawName('')
    } catch(e) { toast.error(e?.response?.data?.message || 'Failed') }
    setWithdrawing(false)
  }

  const IS = { width:'100%', padding:'11px 14px', background:'#f5f5f5', border:'1px solid #ddd', borderRadius:'8px', color:'#111', fontSize:'15px', outline:'none' }

  const menuItems = [
    { key:'deposit', label:'Deposit & Withdrawal' },
    { key:'bets', label:'Bet History' },
    { key:'bank', label:'Bank Transfer' },
    { key:'pl', label:'Profit & Loss' },
    { key:'bonus', label:'Bonus History' },
    { key:'activity', label:'Activity Log' },
    { key:'statements', label:'Account Statements' },
    { key:'settings', label:'Account Settings' },
  ]

  return (
    <div style={{ background:'#f0f0f0', minHeight:'100vh', paddingBottom:'80px' }}>

      {/* Back bar */}
      <div style={{ background:'#0a2e14', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', color:'#fff', fontSize:'15px', fontWeight:'700', cursor:'pointer' }}>‹ BACK</button>
        <button style={{ background:'none', border:'none', color:'#fff', fontSize:'20px', cursor:'pointer' }}>🔔</button>
      </div>

      {/* User card */}
      <div style={{ background:'#1e7d32', margin:'14px', borderRadius:'12px', padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'#fff', fontSize:'19px', fontWeight:'900', textTransform:'uppercase', letterSpacing:'1px' }}>{user.username}</span>
        <div style={{ width:'42px', height:'42px', borderRadius:'50%', border:'2px solid rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </div>
      </div>

      {/* Balance info */}
      <div style={{ background:'#fff', margin:'0 14px 14px', borderRadius:'12px', overflow:'hidden' }}>
        {[
          { label:'Available Balance', value: Number(balance||0).toFixed(2), color:'#111' },
          { label:'Wallet Balance', value:'0.00', color:'#111' },
          { label:'Winning', value:`+${Number(balance||0).toFixed(2)}`, color:'#1e7d32' },
          { label:'Exposure', value:'0.00', color:'#e53935' },
        ].map((item, i, arr) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 18px', borderBottom: i < arr.length-1 ? '1px solid #f0f0f0' : 'none' }}>
            <span style={{ fontSize:'14px', color:'#555' }}>{item.label}</span>
            <span style={{ fontSize:'15px', fontWeight:'700', color:item.color }}>{item.value}</span>
          </div>
        ))}
      </div>

      {/* Menu items */}
      <div style={{ margin:'0 14px', display:'flex', flexDirection:'column', gap:'8px' }}>
        {menuItems.map((item) => (
          <div key={item.key}>
            <button onClick={() => setExpanded(expanded === item.key ? null : item.key)}
              style={{ width:'100%', padding:'15px 18px', background:'#fff', border:'1px solid #e0e0e0', borderRadius: expanded===item.key ? '10px 10px 0 0' : '10px', display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', fontSize:'14px', fontWeight:'600', color:'#111' }}>
              <span>{item.label}</span>
              <span style={{ color:'#999', fontSize:'18px', transform: expanded===item.key ? 'rotate(90deg)':'none', transition:'transform 0.2s' }}>›</span>
            </button>

            {/* DEPOSIT & WITHDRAWAL */}
            {expanded === 'deposit' && item.key === 'deposit' && (
              <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'16px' }}>
                {/* Tabs */}
                <div style={{ display:'flex', marginBottom:'16px', borderBottom:'2px solid #eee' }}>
                  {['Deposit','Withdraw','History'].map((t,i) => {
                    const [dTab, setDTab] = [useState('Deposit'), null]
                    return null // handled below
                  })}
                </div>
                <DepositWithdraw
                  depositAmount={depositAmount} setDepositAmount={setDepositAmount}
                  utrId={utrId} setUtrId={setUtrId}
                  screenshot={screenshot} setScreenshot={setScreenshot}
                  screenshotName={screenshotName} setScreenshotName={setScreenshotName}
                  qrCodes={qrCodes} qrLoading={qrLoading} selectedQR={selectedQR} setSelectedQR={setSelectedQR}
                  generateQR={generateQR} submitDeposit={submitDeposit} submitLoading={submitLoading}
                  withdrawAmount={withdrawAmount} setWithdrawAmount={setWithdrawAmount}
                  withdrawUPI={withdrawUPI} setWithdrawUPI={setWithdrawUPI}
                  withdrawName={withdrawName} setWithdrawName={setWithdrawName}
                  withdrawing={withdrawing} submitWithdraw={submitWithdraw}
                  withdrawHistory={withdrawHistory}
                />
              </div>
            )}

            {/* BET HISTORY */}
            {expanded === 'bets' && item.key === 'bets' && (
              <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'12px' }}>
                {bets.length === 0 ? (
                  <p style={{ textAlign:'center', color:'#999', padding:'20px', fontSize:'13px' }}>No bet history yet</p>
                ) : bets.slice(0,20).map((bet, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 4px', borderBottom:'1px solid #f5f5f5', fontSize:'13px' }}>
                    <div>
                      <div style={{ fontWeight:'600', color:'#111' }}>{bet.game}</div>
                      <div style={{ color:'#999', fontSize:'11px' }}>{new Date(bet.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ color: bet.result==='win' ? '#1e7d32' : '#e53935', fontWeight:'700' }}>
                        {bet.result==='win' ? `+${bet.payout}` : `-${bet.amount}`} 🪙
                      </div>
                      <div style={{ fontSize:'11px', color:'#999' }}>{bet.result?.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* OTHER ITEMS — coming soon */}
            {expanded === item.key && !['deposit','bets'].includes(item.key) && (
              <div style={{ background:'#fff', border:'1px solid #e0e0e0', borderTop:'none', borderRadius:'0 0 10px 10px', padding:'20px', textAlign:'center', color:'#999', fontSize:'13px' }}>
                Coming Soon
              </div>
            )}
          </div>
        ))}

        <button onClick={() => { logout(); navigate('/') }}
          style={{ width:'100%', padding:'15px', background:'#e53935', border:'none', borderRadius:'10px', color:'#fff', fontSize:'16px', fontWeight:'900', cursor:'pointer', letterSpacing:'1px', marginTop:'4px' }}>
          LOGOUT
        </button>
      </div>
    </div>
  )
}

function DepositWithdraw({ depositAmount, setDepositAmount, utrId, setUtrId, screenshot, setScreenshot, screenshotName, setScreenshotName, qrCodes, qrLoading, selectedQR, setSelectedQR, generateQR, submitDeposit, submitLoading, withdrawAmount, setWithdrawAmount, withdrawUPI, setWithdrawUPI, withdrawName, setWithdrawName, withdrawing, submitWithdraw, withdrawHistory }) {
  const [tab, setTab] = useState('deposit')
  const IS = { width:'100%', padding:'11px 14px', background:'#f8f8f8', border:'1px solid #ddd', borderRadius:'8px', color:'#111', fontSize:'15px', outline:'none', marginBottom:'10px' }
  const QUICK = [200,500,1000,2000,5000]

  return (
    <div>
      {/* Tabs */}
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {['deposit','withdraw','history'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:'9px', background: tab===t ? '#1e7d32' : '#f0f0f0', border:'none', borderRadius:'8px', color: tab===t ? '#fff' : '#555', fontWeight:'700', fontSize:'13px', cursor:'pointer', textTransform:'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* DEPOSIT */}
      {tab === 'deposit' && (
        <div>
          <label style={{ fontSize:'12px', color:'#666', fontWeight:'600', display:'block', marginBottom:'6px' }}>AMOUNT (₹)</label>
          <input type="number" value={depositAmount} onChange={e => setDepositAmount(Number(e.target.value))} style={IS} />
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
            {QUICK.map(a => (
              <button key={a} onClick={() => setDepositAmount(a)} style={{ padding:'6px 12px', background: depositAmount===a ? '#1e7d32' : '#eee', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:'700', color: depositAmount===a ? '#fff' : '#333', cursor:'pointer' }}>₹{a}</button>
            ))}
          </div>
          <button onClick={generateQR} disabled={qrLoading} style={{ width:'100%', padding:'12px', background:'#1e7d32', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'700', fontSize:'14px', cursor:'pointer', marginBottom:'12px' }}>
            {qrLoading ? '⏳ Generating...' : '📱 Generate QR Code'}
          </button>

          {qrCodes.length > 0 && selectedQR !== null && (
            <div style={{ textAlign:'center', background:'#f8f8f8', borderRadius:'10px', padding:'16px', marginBottom:'12px' }}>
              <img src={qrCodes[selectedQR]?.qrUrl} alt="QR" style={{ width:'200px', height:'200px', borderRadius:'8px' }} />
              <div style={{ marginTop:'8px', fontSize:'13px', color:'#555' }}>
                <strong>UPI:</strong> {qrCodes[selectedQR]?.upiId}<br/>
                <strong>Amount:</strong> ₹{qrCodes[selectedQR]?.amount}<br/>
                <strong>Ref:</strong> {qrCodes[selectedQR]?.txnRef}
              </div>
              <a href={`upi://pay?pa=${qrCodes[selectedQR]?.upiId}&pn=SIGMA777&am=${qrCodes[selectedQR]?.amount}&cu=INR`}
                style={{ display:'block', marginTop:'10px', padding:'10px', background:'#1e7d32', borderRadius:'8px', color:'#fff', fontWeight:'700', fontSize:'13px', textDecoration:'none' }}>
                📲 Open UPI App
              </a>
            </div>
          )}

          <label style={{ fontSize:'12px', color:'#666', fontWeight:'600', display:'block', marginBottom:'6px' }}>UTR / TRANSACTION ID</label>
          <input type="text" value={utrId} onChange={e => setUtrId(e.target.value)} placeholder="Enter 12-digit UTR" style={IS} />

          <label style={{ fontSize:'12px', color:'#666', fontWeight:'600', display:'block', marginBottom:'6px' }}>SCREENSHOT</label>
          <input type="file" accept="image/*" onChange={e => { const f = e.target.files[0]; if(f){ setScreenshot(f); setScreenshotName(f.name) }}} style={{ marginBottom:'12px', fontSize:'13px', color:'#555' }} />
          {screenshotName && <div style={{ fontSize:'12px', color:'#1e7d32', marginBottom:'10px' }}>✅ {screenshotName}</div>}

          <button onClick={submitDeposit} disabled={submitLoading} style={{ width:'100%', padding:'13px', background:'#e53935', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'900', fontSize:'14px', cursor:'pointer' }}>
            {submitLoading ? '⏳ Submitting...' : '✅ SUBMIT DEPOSIT'}
          </button>
        </div>
      )}

      {/* WITHDRAW */}
      {tab === 'withdraw' && (
        <div>
          <label style={{ fontSize:'12px', color:'#666', fontWeight:'600', display:'block', marginBottom:'6px' }}>AMOUNT (₹) — Balance: 🪙 {withdrawAmount}</label>
          <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(Number(e.target.value))} style={IS} />
          <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
            {QUICK.map(a => (
              <button key={a} onClick={() => setWithdrawAmount(a)} style={{ padding:'6px 12px', background: withdrawAmount===a ? '#e53935' : '#eee', border:'none', borderRadius:'6px', fontSize:'12px', fontWeight:'700', color: withdrawAmount===a ? '#fff' : '#333', cursor:'pointer' }}>₹{a}</button>
            ))}
          </div>
          <label style={{ fontSize:'12px', color:'#666', fontWeight:'600', display:'block', marginBottom:'6px' }}>UPI ID</label>
          <input type="text" value={withdrawUPI} onChange={e => setWithdrawUPI(e.target.value)} placeholder="yourname@upi" style={IS} />
          <label style={{ fontSize:'12px', color:'#666', fontWeight:'600', display:'block', marginBottom:'6px' }}>ACCOUNT HOLDER NAME</label>
          <input type="text" value={withdrawName} onChange={e => setWithdrawName(e.target.value)} placeholder="Full Name" style={IS} />
          <button onClick={submitWithdraw} disabled={withdrawing} style={{ width:'100%', padding:'13px', background:'#e53935', border:'none', borderRadius:'8px', color:'#fff', fontWeight:'900', fontSize:'14px', cursor:'pointer' }}>
            {withdrawing ? '⏳ Processing...' : '💸 WITHDRAW'}
          </button>
        </div>
      )}

      {/* HISTORY */}
      {tab === 'history' && (
        <div>
          {withdrawHistory.length === 0 ? (
            <p style={{ textAlign:'center', color:'#999', padding:'20px', fontSize:'13px' }}>No withdrawal history</p>
          ) : withdrawHistory.map((w, i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px', background:'#f8f8f8', borderRadius:'8px', marginBottom:'8px', fontSize:'13px' }}>
              <div>
                <div style={{ fontWeight:'600' }}>₹{w.amount} → {w.upiId}</div>
                <div style={{ color:'#999', fontSize:'11px' }}>{new Date(w.createdAt).toLocaleDateString()}</div>
              </div>
              <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:'700', background: w.withdrawStatus==='approved' ? '#e8f5e9' : w.withdrawStatus==='rejected' ? '#ffebee' : '#fff3e0', color: w.withdrawStatus==='approved' ? '#1e7d32' : w.withdrawStatus==='rejected' ? '#e53935' : '#f57c00' }}>
                {w.withdrawStatus?.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
