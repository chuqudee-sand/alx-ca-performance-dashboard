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

  if (loading) return <div style={{ padding: '40px', marginLeft: '240px' }}>Loading Revenue Intelligence...</div>;

  // --- DATA FILTERING ---
  const filteredData = sprint === 'All' ? data : data.filter(d => d.Sprint === sprint);

  // --- REVENUE & KPI CALCULATIONS ---
  const totals = filteredData.reduce((acc, row) => {
    const enrolled = parseInt(row.Current_Enrolled || 0);
    const activated = parseInt(row.Current_Activated || 0);
    const graduated = parseInt(row.Current_Graduated || 0);
    const program = (row.Program || '').toUpperCase();
    
    acc.enrolled += enrolled;
    acc.activated += activated;
    acc.graduated += graduated;
    
    // Program-Aware Revenue Logic
    const activeOnly = activated - graduated;
    const monthlyRate = 5;
    
    // VA & AiCE = 2 months | PF = 3 months
    let gradMultiplier = 2; 
    if (program.includes('PF')) gradMultiplier = 3; 
    
    acc.revRealized += (activeOnly * monthlyRate) + (graduated * monthlyRate * gradMultiplier);
    acc.revProjected += parseFloat(row.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    
    return acc;
  }, { enrolled: 0, activated: 0, graduated: 0, revRealized: 0, revProjected: 0 });

  const activationRate = (totals.activated / totals.enrolled) * 100 || 0;
  const projectedGrads = Math.floor(totals.activated * 0.5);
  const healthStatus = activationRate >= 80 ? {icon: '✅', text: 'Healthy'} : activationRate >= 60 ? {icon: '⚠️', text: 'At Risk'} : {icon: '🚨', text: 'Critical'};

  // --- COUNTRY GROUPING (Aggregating all programs per country) ---
  const countryMap = filteredData.reduce((acc, row) => {
    const country = row.Country;
    const rev = parseFloat(row.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    const enrolled = parseInt(row.Current_Enrolled || 0);
    const activated = parseInt(row.Current_Activated || 0);
    const health = parseFloat(row.Activation_Health || 0);

    if (!acc[country]) acc[country] = { name: country, totalRev: 0, enrolled: 0, health: 0, count: 0 };
    acc[country].totalRev += rev;
    acc[country].enrolled += enrolled;
    acc[country].health += health;
    acc[country].count += 1;
    return acc;
  }, {});

  const sortedCountries = Object.values(countryMap).sort((a: any, b: any) => b.totalRev - a.totalRev);
  const topCountry = sortedCountries[0] as any;
  
  // Logic for small but high-health countries
  const starPerformer = Object.values(countryMap).find((c: any) => c.enrolled < 100 && (c.health / c.count) > 85) as any;

  return (
    <div style={{ marginLeft: '240px', padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', color: '#002B56' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '26px' }}>Executive Summary {healthStatus.icon}</h1>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Career Accelerator Strategic OKRs</p>
        </div>
        <select 
          value={sprint} 
          onChange={(e) => setSprint(e.target.value)}
          style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: 'white', fontWeight: 'bold' }}
        >
          <option value="All">All Sprints</option>
          <option value="Sprint 1">Sprint 1</option>
          <option value="Sprint 2">Sprint 2</option>
          <option value="Sprint 3">Sprint 3</option>
        </select>
      </div>

      {/* SCORECARDS ROW 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '15px' }}>
        <Card title="Paid Enrolled" value={totals.enrolled.toLocaleString()} />
        <Card title="Activated" value={totals.activated.toLocaleString()} />
        <Card 
          title="Activation Rate" 
          value={`${activationRate.toFixed(1)}%`} 
          subText={healthStatus.text}
          valueColor={activationRate < 80 ? '#ef4444' : '#059669'}
        />
        <Card title="Current Graduates" value={totals.graduated.toLocaleString()} />
      </div>

      {/* SCORECARDS ROW 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <Card 
          title="Projected Graduation" 
          value={projectedGrads.toLocaleString()} 
          subText="At 50% target Grad rate" 
        />
        <Card title="Current Total Revenue" value={`$${totals.revRealized.toLocaleString()}`} subText="Realized via Active/Grad status" />
        <Card title="Projected Total Revenue" value={`$${totals.revProjected.toLocaleString()}`} subText="Access Fee Target" />
      </div>

      {/* PROGRESS BAR */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px', fontWeight: 'bold' }}>
          <span>Revenue Progress ($6M Global Goal)</span>
          <span>{((totals.revRealized / 6000000) * 100).toFixed(1)}%</span>
        </div>
        <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min((totals.revRealized / 6000000) * 100, 100)}%`, height: '100%', backgroundColor: '#05F283' }}></div>
        </div>
      </div>

      {/* INSIGHTS & RANKING */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '20px' }}>
        <div style={{ backgroundColor: '#002B56', color: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#05F283', fontSize: '18px' }}>Strategic Narrative</h3>
          <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>
            Overall activation health is <strong>{healthStatus.text}</strong>. 
            Based on a 50% graduation benchmark, we anticipate <strong>{projectedGrads.toLocaleString()} graduates</strong> contributing to the total Access Fee realization.
          </p>
          <p style={{ fontSize: '15px', lineHeight: '1.6' }}>
            <strong>{topCountry?.name}</strong> stands as the primary revenue engine. 
            {starPerformer && ` Notably, ${starPerformer.name} shows high efficiency with ${Math.round(starPerformer.health / starPerformer.count)}% activation health despite smaller enrollment scale.`}
          </p>
          {activationRate < 80 && (
            <div style={{ marginTop: '20px', padding: '15px', borderLeft: '4px solid #FF5347', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '14px', borderRadius: '0 8px 8px 0' }}>
              <span style={{ color: '#FF5347', fontWeight: 'bold' }}>ADVISORY:</span> Low activation triggers a risk to Month 2 revenue. Recommend deploying targeted nudges and community volunteers to support learners in regions trending below 70%.
            </div>
          )}
        </div>

        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Top 5 Contributing Countries</h3>
          {sortedCountries.slice(0, 5).map((c: any, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === 4 ? 'none' : '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{c.name}</span>
              <span style={{ fontWeight: 'bold', color: '#002B56' }}>${c.totalRev.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, subText, valueColor }: any) {
  return (
    <div style={{ backgroundColor: 'white', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.025em' }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: valueColor || '#002B56' }}>{value}</div>
      {subText && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{subText}</div>}
    </div>
  );
}
