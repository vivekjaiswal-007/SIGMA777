import { openAuthModal } from '../utils/authModal.js'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, api } from '../store/useStore'
import toast from 'react-hot-toast'

/* ── Deposit & Withdrawal ── */
function DepositWithdraw({ balance }) {
  const [tab, setTab] = useState('deposit')
  const [depositAmount, setDepositAmount] = useState(500)
  const [utrId, setUtrId] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [screenshotName, setScreenshotName] = useState('')
  const [qrCodes, setQrCodes] = useState([])
  const [qrLoading, setQrLoading] = useState(false)
  const [selectedQR, setSelectedQR] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(500)
  const [withdrawUPI, setWithdrawUPI] = useState('')
  const [withdrawName, setWithdrawName] = useState('')
  const [withdrawing, setWithdrawing] = useState(false)
  const [withdrawHistory, setWithdrawHistory] = useState([])

  useEffect(() => {
    api.get('/wallet/withdrawals').then(r => setWithdrawHistory(r.data?.requests || [])).catch(() => {})
  }, [])

  const IS = { width:'100%', padding:'11px 14px', background:'#f8f8f8', border:'1px solid #ddd', borderRadius:'8px', color:'#111', fontSize:'15px', outline:'none', marginBottom:'10px', boxSizing:'border-box' }
  const QUICK = [200,500,1000,2000,5000]

  const [showWarning, setShowWarning] = useState(false)

  const generateQR = async () => {
    if (depositAmount < 100) return toast.error('Minimum deposit ₹100')
    setShowWarning(true)
  }

  const proceedQR = async () => {
    setShowWarning(false)
    setQrLoading(true); setSelectedQR(null); setQrCodes([])
    try {
      const { data } = await api.get(`/wallet/qr-all?amount=${depositAmount}&_t=${Date.now()}`)
      setQrCodes(data.qrCodes || [])
      if (data.qrCodes?.length > 0) setSelectedQR(0)
      toast.success('QR generated!')
    } catch {
      const nonce = Date.now()
      const upiStr = `upi://pay?pa=sigma777@upi&pn=SIGMA777&am=${depositAmount}&cu=INR&tn=RB${nonce}`
      setQrCodes([{ upiId:'sigma777@upi', name:'SIGMA777', amount:depositAmount, txnRef:`RB${nonce}`, qrUrl:`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiStr)}&margin=10` }])
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
      await api.post('/wallet/deposit-request', fd, { headers: { 'Content-Type':'multipart/form-data' } })
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
      const { data } = await api.post('/wallet/withdraw', { amount:withdrawAmount, upiId:withdrawUPI, upiName:withdrawName })
      toast.success(data.message)
      setWithdrawHistory(p => [{ amount:withdrawAmount, withdrawStatus:'pending', upiId:withdrawUPI, createdAt:new Date() }, ...p])
      setWithdrawAmount(500); setWithdrawUPI(''); setWithdrawName('')
    } catch(e) { toast.error(e?.response?.data?.message || 'Failed') }
    setWithdrawing(false)
  }

  return (
    <div style={{ padding:'14px' }}>
      <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
        {[['deposit','💳 UPI'],['crypto','🪙 Crypto'],['withdraw','Withdraw'],['history','History']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)} style={{ flex:1, padding:'10px', background:tab===k?'#1e7d32':'#f0f0f0', border:'none', borderRadius:'8px', color:tab===k?'#fff':'#555', fontWeight:'700', fontSize:'12px', cursor:'pointer' }}>{l}</button>
        ))}
      </div>

      {tab==='deposit' && (
        <div>
          {/* Warning Popup */}
          {showWarning && (
            <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px' }}>
              <div style={{ background:'#fff',borderRadius:'16px',padding:'28px 24px',maxWidth:'320px',width:'100%',textAlign:'center' }}>
                <div style={{ fontSize:'40px',marginBottom:'12px' }}>⚠️</div>
                <h3 style={{ color:'#e53935',fontWeight:'900',fontSize:'17px',marginBottom:'10px' }}>Important Notice</h3>
                <p style={{ color:'#444',fontSize:'13px',lineHeight:1.7,marginBottom:'20px' }}>
                  Please do <strong>not</strong> make any fake or invalid payments. Fake payment attempts waste both your time and ours, and may result in your account being permanently suspended.
                </p>
                <div style={{ display:'flex',gap:'10px' }}>
                  <button onClick={()=>setShowWarning(false)} style={{ flex:1,padding:'11px',background:'#f0f0f0',border:'none',borderRadius:'8px',color:'#555',fontWeight:'700',fontSize:'13px',cursor:'pointer' }}>Cancel</button>
                  <button onClick={proceedQR} style={{ flex:1,padding:'11px',background:'#1e7d32',border:'none',borderRadius:'8px',color:'#fff',fontWeight:'700',fontSize:'13px',cursor:'pointer' }}>I Agree</button>
                </div>
              </div>
            </div>
          )}

          <label style={{ fontSize:'12px',color:'#666',fontWeight:'700',display:'block',marginBottom:'6px' }}>AMOUNT (₹)</label>
          <input type="number" value={depositAmount} onChange={e=>setDepositAmount(Number(e.target.value))} style={IS}/>
          <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px' }}>
            {QUICK.map(a=><button key={a} onClick={()=>setDepositAmount(a)} style={{ padding:'6px 12px',background:depositAmount===a?'#1e7d32':'#eee',border:'none',borderRadius:'6px',fontSize:'12px',fontWeight:'700',color:depositAmount===a?'#fff':'#333',cursor:'pointer' }}>₹{a}</button>)}
          </div>
          <button onClick={generateQR} disabled={qrLoading} style={{ width:'100%',padding:'12px',background:'#1e7d32',border:'none',borderRadius:'8px',color:'#fff',fontWeight:'700',fontSize:'14px',cursor:'pointer',marginBottom:'16px' }}>
            {qrLoading?'⏳ Generating...':'📱 Generate QR Code'}
          </button>

          {qrCodes.length>0 && selectedQR!==null && (
            <div style={{ textAlign:'center',background:'#f8f8f8',borderRadius:'10px',padding:'16px',marginBottom:'16px',border:'1px solid #ddd' }}>
              <img src={qrCodes[selectedQR]?.qrUrl} alt="QR" style={{ width:'200px',height:'200px',borderRadius:'8px' }}/>
              <div style={{ marginTop:'8px',fontSize:'13px',color:'#555',lineHeight:1.6 }}>
                <strong>UPI:</strong> {qrCodes[selectedQR]?.upiId}<br/>
                <strong>Amount:</strong> ₹{qrCodes[selectedQR]?.amount}<br/>
                <strong>Ref:</strong> {qrCodes[selectedQR]?.txnRef}
              </div>
              <a href={`upi://pay?pa=${qrCodes[selectedQR]?.upiId}&pn=SIGMA777&am=${qrCodes[selectedQR]?.amount}&cu=INR`}
                style={{ display:'block',marginTop:'10px',padding:'10px',background:'#1e7d32',borderRadius:'8px',color:'#fff',fontWeight:'700',fontSize:'13px',textDecoration:'none' }}>
                📲 Open UPI App
              </a>
            </div>
          )}

          {/* Instructions */}
          <div style={{ background:'#f0f7f0',border:'1px solid #c8e6c9',borderRadius:'10px',padding:'14px',marginBottom:'12px' }}>
            <div style={{ fontWeight:'800',color:'#1e7d32',fontSize:'13px',marginBottom:'10px',letterSpacing:'0.3px' }}>📋 HOW TO DEPOSIT</div>
            {[
              { n:'1', text:'Scan the QR code above and complete the payment. Take a screenshot of your payment confirmation immediately.' },
              { n:'2', text:'Click the WhatsApp icon on the screen to open our support chat directly.' },
              { n:'3', text:'Send your payment screenshot on WhatsApp and wait up to 5 minutes. Your coins will be credited once payment is verified.' },
            ].map(step=>(
              <div key={step.n} style={{ display:'flex',gap:'10px',marginBottom:'10px',alignItems:'flex-start' }}>
                <div style={{ width:'24px',height:'24px',borderRadius:'50%',background:'#1e7d32',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'12px',fontWeight:'900',flexShrink:0 }}>{step.n}</div>
                <p style={{ fontSize:'13px',color:'#333',lineHeight:1.6,margin:0 }}>{step.text}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp Button */}
          <a href="https://wa.me/584167724805" target="_blank" rel="noopener noreferrer"
            style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:'10px',width:'100%',padding:'14px',background:'#25D366',border:'none',borderRadius:'10px',color:'#fff',fontWeight:'800',fontSize:'15px',textDecoration:'none',boxShadow:'0 4px 14px rgba(37,211,102,0.4)' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="white">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.823 1.777 6.845L2 30l7.379-1.752A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 01-5.89-1.607l-.422-.252-4.378 1.04 1.077-4.267-.277-.438A11.554 11.554 0 014.4 16C4.4 9.593 9.593 4.4 16 4.4S27.6 9.593 27.6 16 22.407 27.6 16 27.6zm6.34-8.64c-.347-.174-2.055-1.013-2.374-1.129-.319-.116-.551-.174-.783.174-.232.347-.9 1.129-1.103 1.361-.203.232-.406.26-.753.087-.347-.174-1.464-.54-2.789-1.72-1.031-.919-1.727-2.054-1.93-2.4-.203-.348-.022-.535.152-.708.157-.155.347-.406.521-.608.174-.203.232-.348.347-.58.116-.232.058-.435-.029-.608-.087-.174-.783-1.888-1.073-2.587-.283-.68-.57-.587-.783-.598l-.666-.012c-.232 0-.608.087-.927.435-.319.347-1.218 1.19-1.218 2.903s1.247 3.365 1.42 3.597c.174.232 2.453 3.745 5.943 5.252.831.359 1.479.573 1.985.733.834.265 1.594.228 2.194.138.669-.1 2.055-.84 2.346-1.651.29-.812.29-1.508.203-1.651-.086-.145-.318-.232-.666-.406z"/>
            </svg>
            Send Screenshot on WhatsApp
          </a>
        </div>
      )}

      {tab==='crypto' && (
        <div>
          {/* Warning */}
          <div style={{ background:'#fff3cd', border:'1px solid #ffc107', borderRadius:'10px', padding:'12px 14px', marginBottom:'14px', display:'flex', gap:'10px', alignItems:'flex-start' }}>
            <span style={{ fontSize:'20px' }}>⚠️</span>
            <p style={{ fontSize:'12px', color:'#856404', lineHeight:1.6, margin:0 }}>
              Please do <strong>not</strong> make any fake payments. Fake transactions will result in permanent account suspension.
            </p>
          </div>

          {/* USDT TRC20 wallet */}
          <div style={{ background:'#f8f8f8', border:'1px solid #ddd', borderRadius:'12px', padding:'16px', marginBottom:'14px', textAlign:'center' }}>
            {/* USDT Logo */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'#26a17b', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <span style={{ color:'#fff', fontWeight:'900', fontSize:'14px' }}>₮</span>
              </div>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontWeight:'900', fontSize:'15px', color:'#111' }}>USDT</div>
                <div style={{ fontSize:'11px', color:'#26a17b', fontWeight:'700' }}>TRC20 Network</div>
              </div>
            </div>

            {/* QR Code */}
            <div style={{ background:'#fff', borderRadius:'10px', padding:'12px', display:'inline-block', marginBottom:'12px', border:'1px solid #eee' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=TRC20:TRjX9PGyPoDTMzxwikw69hayDRcHHqEC2q&margin=8`}
                alt="USDT TRC20 QR"
                style={{ width:'160px', height:'160px', display:'block' }}
              />
            </div>

            {/* Wallet Address */}
            <div style={{ marginBottom:'8px' }}>
              <div style={{ fontSize:'11px', color:'#666', fontWeight:'700', marginBottom:'4px', textTransform:'uppercase', letterSpacing:'0.5px' }}>Wallet Address</div>
              <div style={{ background:'#fff', border:'1px solid #ddd', borderRadius:'8px', padding:'10px 12px', fontSize:'12px', color:'#111', wordBreak:'break-all', fontFamily:'monospace', textAlign:'left', lineHeight:1.5 }}>
                TRjX9PGyPoDTMzxwikw69hayDRcHHqEC2q
              </div>
              <button
                onClick={() => { navigator.clipboard?.writeText('TRjX9PGyPoDTMzxwikw69hayDRcHHqEC2q'); toast.success('Address copied!') }}
                style={{ marginTop:'8px', padding:'8px 16px', background:'#26a17b', border:'none', borderRadius:'6px', color:'#fff', fontWeight:'700', fontSize:'12px', cursor:'pointer' }}>
                📋 Copy Address
              </button>
            </div>

            <div style={{ fontSize:'11px', color:'#e53935', fontWeight:'700', marginTop:'8px' }}>
              ⚠️ Only send USDT on TRC20 network
            </div>
          </div>

          {/* Instructions */}
          <div style={{ background:'#f0f7f0', border:'1px solid #c8e6c9', borderRadius:'10px', padding:'14px', marginBottom:'12px' }}>
            <div style={{ fontWeight:'800', color:'#1e7d32', fontSize:'13px', marginBottom:'10px' }}>📋 HOW TO DEPOSIT CRYPTO</div>
            {[
              { n:'1', text:'Copy the USDT TRC20 wallet address above or scan the QR code.' },
              { n:'2', text:'Send your USDT (TRC20) from your wallet or exchange. Take a screenshot of the transaction.' },
              { n:'3', text:'Click the WhatsApp button below, send your transaction screenshot & TxID. Wait 5-10 minutes for confirmation.' },
            ].map(step => (
              <div key={step.n} style={{ display:'flex', gap:'10px', marginBottom:'10px', alignItems:'flex-start' }}>
                <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:'#1e7d32', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:'900', flexShrink:0 }}>{step.n}</div>
                <p style={{ fontSize:'13px', color:'#333', lineHeight:1.6, margin:0 }}>{step.text}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp Button */}
          <a href="https://wa.me/584167724805" target="_blank" rel="noopener noreferrer"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', width:'100%', padding:'14px', background:'#25D366', border:'none', borderRadius:'10px', color:'#fff', fontWeight:'800', fontSize:'15px', textDecoration:'none', boxShadow:'0 4px 14px rgba(37,211,102,0.4)' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="white">
              <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.648 4.823 1.777 6.845L2 30l7.379-1.752A13.93 13.93 0 0016 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm6.34 19.36c-.347-.174-2.055-1.013-2.374-1.129-.319-.116-.551-.174-.783.174-.232.347-.9 1.129-1.103 1.361-.203.232-.406.26-.753.087-.347-.174-1.464-.54-2.789-1.72-1.031-.919-1.727-2.054-1.93-2.4-.203-.348-.022-.535.152-.708.157-.155.347-.406.521-.608.174-.203.232-.348.347-.58.116-.232.058-.435-.029-.608-.087-.174-.783-1.888-1.073-2.587-.283-.68-.57-.587-.783-.598l-.666-.012c-.232 0-.608.087-.927.435-.319.347-1.218 1.19-1.218 2.903s1.247 3.365 1.42 3.597c.174.232 2.453 3.745 5.943 5.252.831.359 1.479.573 1.985.733.834.265 1.594.228 2.194.138.669-.1 2.055-.84 2.346-1.651.29-.812.29-1.508.203-1.651-.086-.145-.318-.232-.666-.406z"/>
            </svg>
            Send TxID on WhatsApp
          </a>
        </div>
      )}

      {tab==='withdraw' && (
        <div>
          <label style={{ fontSize:'12px',color:'#666',fontWeight:'700',display:'block',marginBottom:'6px' }}>AMOUNT (₹) — Balance: {Number(balance||0).toFixed(2)}</label>
          <input type="number" value={withdrawAmount} onChange={e=>setWithdrawAmount(Number(e.target.value))} style={IS}/>
          <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px' }}>
            {QUICK.map(a=><button key={a} onClick={()=>setWithdrawAmount(a)} style={{ padding:'6px 12px',background:withdrawAmount===a?'#e53935':'#eee',border:'none',borderRadius:'6px',fontSize:'12px',fontWeight:'700',color:withdrawAmount===a?'#fff':'#333',cursor:'pointer' }}>₹{a}</button>)}
          </div>
          <label style={{ fontSize:'12px',color:'#666',fontWeight:'700',display:'block',marginBottom:'6px' }}>UPI ID</label>
          <input type="text" value={withdrawUPI} onChange={e=>setWithdrawUPI(e.target.value)} placeholder="yourname@upi" style={IS}/>
          <label style={{ fontSize:'12px',color:'#666',fontWeight:'700',display:'block',marginBottom:'6px' }}>ACCOUNT HOLDER NAME</label>
          <input type="text" value={withdrawName} onChange={e=>setWithdrawName(e.target.value)} placeholder="Full Name" style={IS}/>
          <button onClick={submitWithdraw} disabled={withdrawing} style={{ width:'100%',padding:'13px',background:'#e53935',border:'none',borderRadius:'8px',color:'#fff',fontWeight:'900',fontSize:'14px',cursor:'pointer' }}>
            {withdrawing?'⏳ Processing...':'💸 WITHDRAW'}
          </button>
        </div>
      )}

      {tab==='history' && (
        <div>
          {withdrawHistory.length===0
            ? <p style={{ textAlign:'center',color:'#999',padding:'20px',fontSize:'13px' }}>No history yet</p>
            : withdrawHistory.map((w,i)=>(
              <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8f8f8',borderRadius:'8px',marginBottom:'8px' }}>
                <div>
                  <div style={{ fontWeight:'600',fontSize:'14px' }}>₹{w.amount}</div>
                  <div style={{ color:'#999',fontSize:'11px' }}>{w.upiId} • {new Date(w.createdAt).toLocaleDateString()}</div>
                </div>
                <span style={{ padding:'3px 10px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',background:w.withdrawStatus==='approved'?'#e8f5e9':w.withdrawStatus==='rejected'?'#ffebee':'#fff3e0',color:w.withdrawStatus==='approved'?'#1e7d32':w.withdrawStatus==='rejected'?'#e53935':'#f57c00' }}>
                  {w.withdrawStatus?.toUpperCase()}
                </span>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

/* ── Bet History ── */
function BetHistory() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/bets/history?limit=50').then(r=>setBets(r.data?.bets||[])).catch(()=>{}).finally(()=>setLoading(false))
  }, [])
  if (loading) return <div style={{ padding:'20px',textAlign:'center',color:'#999' }}>Loading...</div>
  if (bets.length===0) return <div style={{ padding:'20px',textAlign:'center',color:'#999',fontSize:'13px' }}>No bet history yet</div>
  return (
    <div style={{ padding:'12px' }}>
      {bets.map((bet,i)=>(
        <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'11px',background:'#f8f8f8',borderRadius:'8px',marginBottom:'7px' }}>
          <div>
            <div style={{ fontWeight:'600',fontSize:'13px',color:'#111' }}>{bet.game}</div>
            <div style={{ color:'#999',fontSize:'11px' }}>{new Date(bet.createdAt).toLocaleDateString()}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ color:bet.result==='win'?'#1e7d32':'#e53935',fontWeight:'700',fontSize:'13px' }}>
              {bet.result==='win'?`+${bet.payout}`:`-${bet.amount}`} 🪙
            </div>
            <div style={{ fontSize:'11px',color:'#999' }}>{bet.result?.toUpperCase()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Profit & Loss ── */
function ProfitLoss() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    api.get('/bets/history?limit=200').then(r=>setBets(r.data?.bets||[])).catch(()=>{}).finally(()=>setLoading(false))
  }, [])
  if (loading) return <div style={{ padding:'20px',textAlign:'center',color:'#999' }}>Loading...</div>
  const won = bets.filter(b=>b.result==='win')
  const lost = bets.filter(b=>b.result==='loss'||b.result==='lose')
  const totalWon = won.reduce((s,b)=>s+(b.payout||0),0)
  const totalLost = lost.reduce((s,b)=>s+(b.amount||0),0)
  const net = totalWon - totalLost
  return (
    <div style={{ padding:'14px' }}>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px',marginBottom:'14px' }}>
        {[
          { label:'Total Won', value:`+${totalWon.toFixed(0)} 🪙`, color:'#1e7d32', bg:'#e8f5e9' },
          { label:'Total Lost', value:`-${totalLost.toFixed(0)} 🪙`, color:'#e53935', bg:'#ffebee' },
          { label:'Net P&L', value:`${net>=0?'+':''}${net.toFixed(0)} 🪙`, color:net>=0?'#1e7d32':'#e53935', bg:net>=0?'#e8f5e9':'#ffebee' },
          { label:'Total Bets', value:`${bets.length}`, color:'#333', bg:'#f5f5f5' },
        ].map((s,i)=>(
          <div key={i} style={{ background:s.bg,borderRadius:'10px',padding:'14px',textAlign:'center' }}>
            <div style={{ fontSize:'11px',color:'#666',fontWeight:'600',marginBottom:'6px' }}>{s.label}</div>
            <div style={{ fontSize:'18px',fontWeight:'900',color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      {bets.length===0
        ? <p style={{ textAlign:'center',color:'#999',fontSize:'13px' }}>No data yet</p>
        : bets.slice(0,30).map((bet,i)=>(
          <div key={i} style={{ display:'flex',justifyContent:'space-between',padding:'10px',background:bet.result==='win'?'#f0fff4':'#fff5f5',borderRadius:'8px',marginBottom:'6px',borderLeft:`3px solid ${bet.result==='win'?'#1e7d32':'#e53935'}` }}>
            <div>
              <div style={{ fontWeight:'600',fontSize:'13px' }}>{bet.game}</div>
              <div style={{ color:'#999',fontSize:'11px' }}>{new Date(bet.createdAt).toLocaleDateString()}</div>
            </div>
            <div style={{ textAlign:'right',fontWeight:'800',fontSize:'14px',color:bet.result==='win'?'#1e7d32':'#e53935' }}>
              {bet.result==='win'?`+${bet.payout}`:`-${bet.amount}`} 🪙
            </div>
          </div>
        ))
      }
    </div>
  )
}

/* ── Account Statements ── */
function AccountStatements() {
  const [deposits, setDeposits] = useState([])
  const [withdrawals, setWithdrawals] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    Promise.all([
      api.get('/wallet/deposits').catch(()=>({ data:{ deposits:[] } })),
      api.get('/wallet/withdrawals').catch(()=>({ data:{ requests:[] } }))
    ]).then(([d,w])=>{
      setDeposits(d.data?.deposits||[])
      setWithdrawals(w.data?.requests||[])
    }).finally(()=>setLoading(false))
  }, [])
  if (loading) return <div style={{ padding:'20px',textAlign:'center',color:'#999' }}>Loading...</div>
  const all = [
    ...deposits.map(d=>({ ...d, type:'deposit', label:'Deposit', color:'#1e7d32', sign:'+' })),
    ...withdrawals.map(w=>({ ...w, type:'withdraw', label:'Withdrawal', color:'#e53935', sign:'-' }))
  ].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
  if (all.length===0) return <p style={{ textAlign:'center',color:'#999',padding:'20px',fontSize:'13px' }}>No transactions yet</p>
  return (
    <div style={{ padding:'12px' }}>
      {all.map((tx,i)=>(
        <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px',background:'#f8f8f8',borderRadius:'8px',marginBottom:'7px',borderLeft:`3px solid ${tx.color}` }}>
          <div>
            <div style={{ fontWeight:'700',fontSize:'13px',color:tx.color }}>{tx.label}</div>
            <div style={{ color:'#999',fontSize:'11px' }}>{new Date(tx.createdAt).toLocaleDateString()} • {tx.utrId||tx.upiId||''}</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontWeight:'800',fontSize:'14px',color:tx.color }}>{tx.sign}₹{tx.amount}</div>
            <div style={{ fontSize:'10px',color:'#999' }}>{(tx.status||tx.withdrawStatus||'pending').toUpperCase()}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ── Change Password ── */
function ChangePassword() {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [show, setShow] = useState({ old:false, new:false, confirm:false })
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!oldPass || !newPass || !confirmPass) return toast.error('Fill all fields')
    if (newPass !== confirmPass) return toast.error('Passwords do not match')
    if (newPass.length < 6) return toast.error('Minimum 6 characters')
    setLoading(true)
    try {
      await api.post('/auth/change-password', { oldPassword:oldPass, newPassword:newPass })
      toast.success('Password changed!')
      setOldPass(''); setNewPass(''); setConfirmPass('')
    } catch(e) { toast.error(e?.response?.data?.message || 'Failed') }
    setLoading(false)
  }

  const FI = (placeholder, val, setVal, key) => (
    <div style={{ position:'relative', marginBottom:'12px' }}>
      <input type={show[key]?'text':'password'} value={val} onChange={e=>setVal(e.target.value)} placeholder={placeholder}
        style={{ width:'100%',padding:'13px 44px 13px 14px',background:'#1a1a1a',border:'1px solid #333',borderRadius:'8px',color:'#fff',fontSize:'15px',outline:'none',boxSizing:'border-box' }}/>
      <button type="button" onClick={()=>setShow(s=>({...s,[key]:!s[key]}))}
        style={{ position:'absolute',right:'12px',top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'#888',cursor:'pointer',fontSize:'16px' }}>
        {show[key]?'🙈':'👁️'}
      </button>
    </div>
  )

  return (
    <div style={{ padding:'20px', background:'#111', borderRadius:'0 0 10px 10px' }}>
      <h3 style={{ color:'#fff',textAlign:'center',marginBottom:'20px',fontSize:'18px',fontWeight:'700' }}>Change Password</h3>
      {FI('New Password', newPass, setNewPass, 'new')}
      {FI('Confirm Password', confirmPass, setConfirmPass, 'confirm')}
      {FI('Old Password', oldPass, setOldPass, 'old')}
      <button onClick={submit} disabled={loading}
        style={{ width:'100%',padding:'14px',background:'#fff',border:'none',borderRadius:'8px',color:'#111',fontWeight:'900',fontSize:'14px',cursor:'pointer',letterSpacing:'0.5px',marginTop:'8px' }}>
        {loading?'⏳ Changing...':'CHANGE PASSWORD'}
      </button>
    </div>
  )
}

/* ── Main AccountPage ── */
export default function AccountPage() {
  const { user, balance, logout } = useStore()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(null)

  if (!user) { openAuthModal('login'); return null }

  const toggle = (key) => setExpanded(expanded===key ? null : key)

  const menuItems = [
    { key:'deposit', label:'Deposit & Withdrawal', content:<DepositWithdraw balance={balance}/> },
    { key:'bets', label:'Bet History', content:<BetHistory/> },
    { key:'pl', label:'Profit & Loss', content:<ProfitLoss/> },
    { key:'statements', label:'Account Statements', content:<AccountStatements/> },
    { key:'settings', label:'Account Settings', content:<ChangePassword/> },
  ]

  return (
    <div style={{ background:'#f0f0f0', minHeight:'100vh', paddingBottom:'80px' }}>
      <div style={{ background:'#0a2e14', padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 }}>
        <button onClick={()=>navigate(-1)} style={{ background:'none',border:'none',color:'#fff',fontSize:'15px',fontWeight:'700',cursor:'pointer' }}>‹ BACK</button>
        <button style={{ background:'none',border:'none',color:'#fff',fontSize:'20px',cursor:'pointer' }}>🔔</button>
      </div>

      <div style={{ background:'#1e7d32', margin:'14px', borderRadius:'12px', padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'#fff',fontSize:'19px',fontWeight:'900',textTransform:'uppercase',letterSpacing:'1px' }}>{user.username}</span>
        <div style={{ width:'42px',height:'42px',borderRadius:'50%',border:'2px solid rgba(255,255,255,0.5)',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
        </div>
      </div>

      <div style={{ background:'#fff', margin:'0 14px 14px', borderRadius:'12px', overflow:'hidden' }}>
        {[
          { label:'Available Balance', value:Number(balance||0).toFixed(2), color:'#111' },
          { label:'Wallet Balance', value:'0.00', color:'#111' },
          { label:'Winning', value:`+${Number(balance||0).toFixed(2)}`, color:'#1e7d32' },
          { label:'Exposure', value:'0.00', color:'#e53935' },
        ].map((item,i,arr)=>(
          <div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 18px',borderBottom:i<arr.length-1?'1px solid #f0f0f0':'none' }}>
            <span style={{ fontSize:'14px',color:'#555' }}>{item.label}</span>
            <span style={{ fontSize:'15px',fontWeight:'700',color:item.color }}>{item.value}</span>
          </div>
        ))}
      </div>

      <div style={{ margin:'0 14px', display:'flex', flexDirection:'column', gap:'8px' }}>
        {menuItems.map(item=>(
          <div key={item.key} style={{ borderRadius:'10px', overflow:'hidden', border:'1px solid #e0e0e0' }}>
            <button onClick={()=>toggle(item.key)}
              style={{ width:'100%',padding:'15px 18px',background:'#fff',border:'none',display:'flex',alignItems:'center',justifyContent:'space-between',cursor:'pointer',fontSize:'14px',fontWeight:'600',color:'#111' }}>
              <span>{item.label}</span>
              <span style={{ color:'#999',fontSize:'18px',transform:expanded===item.key?'rotate(90deg)':'none',transition:'transform 0.2s',display:'inline-block' }}>›</span>
            </button>
            {expanded===item.key && (
              <div style={{ borderTop:'1px solid #f0f0f0', background: item.key==='settings'?'#111':'#fafafa' }}>
                {item.content}
              </div>
            )}
          </div>
        ))}

        <button onClick={()=>{logout();navigate('/')}}
          style={{ width:'100%',padding:'15px',background:'#e53935',border:'none',borderRadius:'10px',color:'#fff',fontSize:'16px',fontWeight:'900',cursor:'pointer',letterSpacing:'1px',marginTop:'4px' }}>
          LOGOUT
        </button>
      </div>
    </div>
  )
}
