"use client";
import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav style={{ 
      width: '260px', 
      backgroundColor: '#002B56', 
      color: 'white', 
      height: '100vh', 
      position: 'fixed', 
      left: 0, 
      top: 0, 
      display: 'flex', 
      flexDirection: 'column', 
      zIndex: 1000,
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* LOGO & TITLE SECTION */}
      <div style={{ padding: '35px 25px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ marginBottom: '20px' }}>
          {/* logo is pulled from root/public/avatar.png */}
          <img 
            src="/avatar.png" 
            alt="ALX Logo" 
            style={{ 
              width: '130px', 
              height: 'auto', 
              display: 'block'
            }} 
          />
        </div>
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          lineHeight: '1.3', 
          color: '#05F283',
          letterSpacing: '-0.02em'
        }}>
          Career Accelerator's <br/> OKR & KPI Tracker
        </div>
      </div>
      
      {/* NAVIGATION LINKS */}
      <ul style={{ listStyle: 'none', padding: '30px 25px', flex: 1, margin: 0 }}>
        <li style={{ marginBottom: '25px' }}>
          <Link href="/" style={{ 
            color: 'white', 
            textDecoration: 'none', 
            fontSize: '18px', 
            fontWeight: '600',
            display: 'block'
          }}>
            Executive Summary
          </Link>
        </li>
        <li style={{ marginBottom: '25px' }}>
          <Link href="/historical" style={{ 
            color: 'rgba(255,255,255,0.5)', 
            textDecoration: 'none', 
            fontSize: '18px', 
            fontWeight: '500',
            display: 'block'
          }}>
            Historical Data
          </Link>
        </li>
      </ul>

      {/* FOOTER INFO */}
      <div style={{ 
        padding: '25px', 
        fontSize: '12px', 
        color: '#94a3b8', 
        borderTop: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(0,0,0,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>ALX AFRICA</div>
        <div>v5.6 | System Architecture</div>
      </div>
    </nav>
  );
}
