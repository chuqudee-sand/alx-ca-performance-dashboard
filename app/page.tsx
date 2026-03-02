"use client";
import { useState, useEffect } from 'react';

interface CountryData {
  name: string;
  realizedRev: number;
  health: number;
  count: number;
}

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

  if (loading) return <div style={{ padding: '40px', marginLeft: '240px', fontSize: '20px' }}>Fetching Data from all CA Program Trackers....</div>;

  const filteredData = sprint === 'All' ? data : data.filter(d => d.Sprint === sprint);

  const totals = filteredData.reduce((acc, row) => {
    const enrolled = parseInt(row.Current_Enrolled || 0);
    const activated = parseInt(row.Current_Activated || 0);
    const graduated = parseInt(row.Current_Graduated || 0);
    const program = (row.Program || '').toUpperCase();
    
    acc.enrolled += enrolled;
    acc.activated += activated;
    acc.graduated += graduated;
    
    const activeOnly = activated - graduated;
    let gradMultiplier = program.includes('PF') ? 3 : 2; 
    acc.revRealized += (activeOnly * 5) + (graduated * 5 * gradMultiplier);
    acc.revProjected += parseFloat(row.Projected_Revenue?.replace(/[^0-9.-]+/g,"") || 0);
    
    return acc;
  }, { enrolled: 0, activated: 0, graduated: 0, revRealized: 0, revProjected: 0 });

  const activationRate = (totals.activated / totals.enrolled) * 100 || 0;
  const projectedGrads = Math.floor(totals.activated * 0.5);
  const healthStatus = activationRate >= 80 ? {icon: '✅ Healthy', text: 'Healthy'} : activationRate >= 60 ? {icon: '⚠️ At Risk', text: 'At Risk'} : {icon: '🚨 Critical', text: 'Critical'};

  const countryMap = filteredData.reduce((acc: Record<string, CountryData>, row) => {
    const country = row.Country || 'Unknown';
    const activated = parseInt(row.Current_Activated || 0);
    const graduated = parseInt(row.Current_Graduated || 0);
    const program = (row.Program || '').toUpperCase();
    const health = parseFloat(row.Activation_Health || 0);

    let gradMult = program.includes('PF') ? 3 : 2;
    const rowRev = ((activated - graduated) * 5) + (graduated * 5 * gradMult);

    if (!acc[country]) {
      acc[country] = { name: country, realizedRev: 0, health: 0, count: 0 };
    }
    acc[country].realizedRev += rowRev;
    acc[country].health += health;
    acc[country].count += 1;
    return acc;
  }, {});

  const sortedByRealized = (Object.values(countryMap) as CountryData[]).sort((a, b) => b.realizedRev - a.realizedRev);
  
  const lowHealthCountries = (Object.values(countryMap) as CountryData[])
    .filter((c) => (c.health / c.count) < 70)
    .sort((a, b) => (a.health / a.count) - (b.health / b.count))
    .slice(0, 2)
    .map((c) => c.name);

  return (
    <div style={{ marginLeft: '220px', padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', color: '#002B56' }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px' }}>Executive Summary: {healthStatus.icon}</h1>
          <p style={{ color: '#64748b', fontSize: '16px', marginTop: '5px' }}>2026 OKR Tracking Platform</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select style={{ padding: '10px 15px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '16px' }} disabled>
            <option>2026</option>
          </select>
          <select 
            value={sprint} 
            onChange={(e) => setSprint(e.target.value)}
            style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: 'white', fontWeight: '600', fontSize: '16px' }}
          >
            <option value="All">All Sprints</option>
            <option value="Sprint 1">Sprint 1</option>
            <option value="Sprint 2">Sprint 2</option>
            <option value="Sprint 3">Sprint 3</option>
          </select>
        </div>
      </div>

      {/* SCORECARDS ROW 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '20px' }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '35px' }}>
        <Card 
          title="Projected Graduation" 
          value={projectedGrads.toLocaleString()} 
          subText="At 50% target Grad rate" 
        />
        <Card title="Current Total Revenue" value={`$${totals.revRealized.toLocaleString()}`} subText="Realized from Active/Grads" />
        <Card title="Projected Total Revenue" value={`$${totals.revProjected.toLocaleString()}`} subText="Full Access Fee Target" />
      </div>

      {/* PROGRESS BAR */}
      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', marginBottom: '35px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
          <span>Revenue Progress ($6M Goal)</span>
          <span>{((totals.revRealized / 6000000) * 100).toFixed(1)}%</span>
        </div>
        <div style={{ width: '100%', height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min((totals.revRealized / 6000000) * 100, 100)}%`, height: '100%', backgroundColor: '#05F283' }}></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '25px' }}>
        {/* STRATEGIC NARRATIVE */}
        <div style={{ backgroundColor: '#002B56', color: 'white', padding: '35px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#05F283', fontSize: '22px' }}>Strategic Narrative</h3>
          <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
            Our current overall activation health is <strong>{healthStatus.text}</strong>. 
            With a 50% graduation benchmark, we anticipate <strong>{projectedGrads.toLocaleString()} graduates</strong>.
          </p>
          <p style={{ fontSize: '18px', lineHeight: '1.6', marginTop: '15px' }}>
            The top regional contributor is currently <strong>{sortedByRealized[0]?.name || 'N/A'}</strong>.
          </p>
          {activationRate < 80 && (
            <div style={{ marginTop: '25px', padding: '20px', borderLeft: '6px solid #FF5347', backgroundColor: 'rgba(255,255,255,0.05)', fontSize: '16px', borderRadius: '0 10px 10px 0' }}>
              <strong>ADVISORY:</strong> Low activation triggers a risk to Month 2 revenue. Recommend deploying targeted nudges and <strong>community volunteers</strong>
              {lowHealthCountries.length > 0 ? ` for regions trending below 70% such as ${lowHealthCountries.join(' and ')}.` : ' for regions trending below 70%.'}
            </div>
          )}
        </div>

        {/* TOP COUNTRIES */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '15px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>Top 5 Contributing Countries</h3>
          {sortedByRealized.slice(0, 5).map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: i === 4 ? 'none' : '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '16px', fontWeight: '500' }}>{c.name}</span>
              <span style={{ fontWeight: 'bold', color: '#002B56', fontSize: '16px' }}>${c.realizedRev.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, subText, valueColor }: any) {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: valueColor || '#002B56' }}>{value}</div>
      {subText && <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>{subText}</div>}
    </div>
  );
}
