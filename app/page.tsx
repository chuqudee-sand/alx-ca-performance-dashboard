"use client";
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState<any[]>([]);
  const [sprint, setSprint] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (!API_URL) return;
    fetch(API_URL).then(res => res.json()).then(json => {
      setData(json);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', marginLeft: '260px' }}>Loading Career Accelerator Data...</div>;

  // --- LOGIC & FILTERING ---
  const filteredData = sprint === 'All' ? data : data.filter(d => d.Sprint === sprint);

  const totals = filteredData.reduce((acc, row) => {
    acc.enrolled += parseInt(row.Current_Enrolled || 0);
    acc.activated += parseInt(row.Current_Activated || 0);
    acc.revProjected += parseFloat(row.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    acc.revCurrent += parseFloat(row.Current_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    acc.projectedGrads += parseInt(row.Projected_Grads || 0);
    return acc;
  }, { enrolled: 0, activated: 0, revProjected: 0, revCurrent: 0, projectedGrads: 0 });

  const activationRate = (totals.activated / totals.enrolled) * 100 || 0;
  const healthIcon = activationRate >= 80 ? '✅ Healthy' : activationRate >= 60 ? '⚠️ At Risk' : '🚨 Critical';

  // --- NARRATIVE LOGIC ---
  const topCountry = [...filteredData].sort((a,b) => parseFloat(b.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0) - parseFloat(a.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0))[0];
  const lowEnrollHighHealth = filteredData.filter(d => parseInt(d.Current_Enrolled) < 100 && parseFloat(d.Activation_Health) > 85);

  return (
    <div style={{ marginLeft: '260px', padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', color: '#002B56' }}>
      
      {/* HEADER & FILTERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px' }}>Executive Summary {healthIcon}</h1>
          <p style={{ color: '#64748b' }}>2026 Academic Year Performance</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} disabled><option>2026</option></select>
          <select 
            value={sprint} 
            onChange={(e) => setSprint(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer' }}
          >
            <option value="All">All Sprints</option>
            <option value="Sprint 1">Sprint 1</option>
            <option value="Sprint 2">Sprint 2</option>
            <option value="Sprint 3">Sprint 3</option>
          </select>
        </div>
      </div>

      {/* 1. KEY SCORECARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>ENROLLMENT & ACTIVATION</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{totals.enrolled.toLocaleString()} / {totals.activated.toLocaleString()}</div>
          <div style={{ fontSize: '14px', color: activationRate < 80 ? '#ef4444' : '#059669', fontWeight: 'bold' }}>{activationRate.toFixed(1)}% Activation Rate</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>REVENUE REALIZATION</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>${totals.revCurrent.toLocaleString()}</div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Projected Target: ${totals.revProjected.toLocaleString()}</div>
        </div>
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>GRADUATION PIPELINE</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>{totals.projectedGrads.toLocaleString()}</div>
          <div style={{ fontSize: '14px', color: '#64748b' }}>Expected at 50% Grad Rate: {(totals.activated * 0.5).toFixed(0)}</div>
        </div>
      </div>

      {/* 3. PROGRESS BAR */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', fontWeight: 'bold' }}>
          <span>Overall Revenue Progress ($6M Goal)</span>
          <span>{((totals.revProjected / 6000000) * 100).toFixed(1)}%</span>
        </div>
        <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${(totals.revProjected / 6000000) * 100}%`, height: '100%', backgroundColor: '#05F283' }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* 6. AUTOMATED SUMMARY TEXT BOX */}
        <div style={{ backgroundColor: '#002B56', color: 'white', padding: '30px', borderRadius: '12px', lineHeight: '1.6' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#05F283' }}>Strategic Insights</h3>
          <p>
            Our current overall activation health is <strong>{healthIcon.split(' ')[1]}</strong>. 
            At a standard 50% graduation benchmark, we anticipate <strong>{(totals.activated * 0.5).toLocaleString()} successful graduates</strong>.
          </p>
          <p>
            The top revenue contributor is currently <strong>{topCountry?.Country} ({topCountry?.Program})</strong>. 
            {lowEnrollHighHealth.length > 0 && ` Noteworthy: ${lowEnrollHighHealth[0].Country} shows exceptional health despite low enrollment.`}
          </p>
          {activationRate < 80 && (
            <div style={{ marginTop: '15px', padding: '10px', borderLeft: '4px solid #FF5347', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <strong>Action Needed:</strong> Low activation health detected. Deploy nudges and volunteer mentors to underperforming cohorts immediately.
            </div>
          )}
        </div>

        {/* 4. COUNTRY RANKING (Simplified List) */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Top Country Contributions</h3>
          {[...filteredData].sort((a,b) => parseFloat(b.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0) - parseFloat(a.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0)).slice(0,5).map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '14px' }}>{c.Country}</span>
              <span style={{ fontWeight: 'bold' }}>{c.Projected_Revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
