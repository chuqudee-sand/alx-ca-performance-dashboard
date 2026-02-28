"use client";
import Link from 'next/link';

export default function Sidebar() {
  return (
    <nav style={{ backgroundColor: '#002B56', color: 'white', width: '256px', height: '100vh', position: 'fixed', left: 0, top: 0, padding: '24px' }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#05F283', marginBottom: '40px' }}>CA Command</div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ marginBottom: '16px' }}><Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Executive Overview</Link></li>
        <li style={{ marginBottom: '16px' }}><Link href="/historical" style={{ color: 'white', textDecoration: 'none' }}>Historical Data</Link></li>
      </ul>
    </nav>
  );
}
