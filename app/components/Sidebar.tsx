"use client";
import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav style={{ 
      width: '260px', backgroundColor: '#002B56', color: 'white', 
      height: '100vh', position: 'fixed', left: 0, top: 0, 
      display: 'flex', flexDirection: 'column', zIndex: 1000 
    }}>
      <div style={{ padding: '30px 20px', borderBottom: '1px solid #1e3a8a' }}>
        {/* LOGO PLACEHOLDER */}
        <div style={{ 
          width: '80px', height: '40px', backgroundColor: 'white', borderRadius: '4px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#002B56',
          fontWeight: 'bold', fontSize: '12px', marginBottom: '15px' 
        }}>
          ALX LOGO
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', lineHeight: '1.2', color: '#05F283' }}>
          Career Accelerator's <br/> OKR & KPI Tracker
        </div>
      </div>
      
      <ul style={{ listStyle: 'none', padding: '20px', flex: 1 }}>
        <li style={{ marginBottom: '15px' }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Executive Summary</Link>
        </li>
        <li style={{ marginBottom: '15px' }}>
          <Link href="/historical" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.7 }}>Historical Data</Link>
        </li>
      </ul>

      <div style={{ padding: '20px', fontSize: '10px', color: '#94a3b8', borderTop: '1px solid #1e3a8a' }}>
        v5.6 | Internal Use Only
      </div>
    </nav>
  );
}
