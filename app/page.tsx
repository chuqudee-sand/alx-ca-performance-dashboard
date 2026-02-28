"use client";

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (!API_URL) return;

    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching Master_Lake:", err));
  }, []);

  if (loading) return <div style={{ padding: '40px', color: '#002B56' }}>Loading Revenue Data...</div>;

  // DYNAMIC CALCULATIONS
  const totalProjected = data.reduce((acc, row) => {
    const val = parseFloat(row.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    return acc + val;
  }, 0);

  const goal = 6000000;
  const progressPercent = (totalProjected / goal) * 100;

  return (
    <div style={{ color: '#002B56', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>Executive Overview</h1>
        <p style={{ color: '#64748b', marginTop: '8px' }}>Live 2026 Revenue Pipeline</p>
      </header>

      {/* The $6M Progress Tracker Box */}
      <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '12px', borderTop: '6px solid #05F283', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
        <div style={{ fontWeight: '600', color: '#002B56', textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Progress to $6.0M Access Fee Goal</div>
        <div style={{ fontSize: '42px', fontWeight: 'bold', marginTop: '12px' }}>
          ${totalProjected.toLocaleString()} <span style={{ fontSize: '18px', color: '#94a3b8', fontWeight: 'normal' }}>/ $6,000,000</span>
        </div>
        {/* Visual Progress Bar */}
        <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '16px', borderRadius: '8px', marginTop: '20px', overflow: 'hidden' }}>
          <div style={{ width: `${progressPercent}%`, backgroundColor: '#05F283', height: '100%', transition: 'width 1s ease-in-out' }}></div>
        </div>
        <div style={{ marginTop: '12px', fontSize: '14px', fontWeight: 'bold', color: '#059669' }}>
          {progressPercent.toFixed(1)}% of Target Achieved
        </div>
      </div>

      {/* Grid of Country Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
        {data.slice(0, 12).map((item, idx) => (
          <div key={idx} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', borderTop: '4px solid #5648B7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.025em' }}>{item.Program} - {item.Country}</div>
            <div style={{ fontSize: '26px', fontWeight: 'bold', marginTop: '10px' }}>{item.Projected_Revenue}</div>
            
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748b' }}>Activation Health</span>
                <span style={{ fontWeight: 'bold', color: parseFloat(item.Activation_Health) < 50 ? '#ef4444' : '#059669' }}>{item.Activation_Health}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
