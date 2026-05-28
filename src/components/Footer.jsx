import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ marginTop: '0', borderTop: '1px solid #2a1e00' }}>

      {/* Safety Section */}
      <div style={{ padding: '24px 20px', background: '#2a1e00', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <img
          src="https://res.cloudinary.com/dnzfce2wa/image/upload/v1778083623/secure.e824a057_nzw6zi.png"
          alt="Secure"
          style={{ height: '48px', objectFit: 'contain' }}
        />
        <div>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#00d084', marginBottom: '4px' }}>🔒 100% Safe</div>
          <div style={{ fontSize: '12px', color: '#666', maxWidth: '360px', lineHeight: 1.5 }}>
            Your data is safe with encrypted protection. Enjoy a secure and private connection.
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, #2a1e00, transparent)' }} />

      {/* Main Footer */}
      <div style={{ padding: '28px 20px', background: '#221400' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', justifyContent: 'center' }}>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: '20px', fontWeight: '900', color: '#c9a84c', textShadow: '0 0 12px rgba(201,168,76,0.4)' }}>
            MAHADEV<span style={{ fontSize: '13px', verticalAlign: 'super' }}>247</span>
          </span>
        </div>

        <p style={{ color: '#555', fontSize: '12px', lineHeight: '1.7', textAlign: 'center', maxWidth: '680px', margin: '0 auto 20px' }}>
          MAHADEV247 provides a smooth and secure betting experience with a variety of reliable payment options. Whether you're placing bets on casino games or sports, our platform ensures quick and hassle-free transactions. Enjoy the convenience of seamless deposits and withdrawals, and focus on the thrill of the game.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          {[
            { label: 'Terms & Conditions', path: '/terms' },
            { label: 'Privacy Policy',     path: '/privacy' },
            { label: 'Responsible Gaming', path: '/responsible' },
            { label: 'Contact Us',         path: '/contact' },
          ].map(link => (
            <Link key={link.path} to={link.path}
              style={{ color: '#444', fontSize: '11px', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = '#c9a84c'}
              onMouseLeave={e => e.target.style.color = '#444'}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', color: '#333', fontSize: '11px', borderTop: '1px solid #1a1200', paddingTop: '16px' }}>
          © Copyright 2024. All Rights Reserved. Powered by <span style={{ color: '#c9a84c' }}>MAHADEV247</span>.
        </div>
      </div>
    </footer>
  )
}
