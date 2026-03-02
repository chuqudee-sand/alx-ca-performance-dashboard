"use client";
import { useState, useEffect } from 'react';

interface RowData {
  Sprint: string;
  Program: string;
  Country: string;
  Current_Enrolled: string;
  Current_Activated: string;
  Current_Graduated: string;
  CSAT?: string;
  NPS?: string;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<RowData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [yearFilter, setYearFilter] = useState('2026');
  const [sprintFilter, setSprintFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_APPS_SCRIPT_URL;
    if (!API_URL) return;
    fetch(API_URL).then(res => res.json()).then(json => {
      setData(json);
      setLoading(false);
    });
  }, []);

  if (loading) return <div style={{ padding: '40px', marginLeft: '240px', fontSize: '20px', color: '#002B56' }}>Loading Analytics Engine...</div>;

  // --- FILTERING LOGIC ---
  // 1. Program Filter controls EVERYTHING (Charts + Scorecards)
  const programFilteredData = programFilter === 'All' 
    ? data 
    : data.filter(d => (d.Program || '').toUpperCase().includes(programFilter.toUpperCase()));

  // 2. Sprint Filter controls ONLY SCORECARDS (Applied on top of Program filter)
  const scorecardData = sprintFilter === 'All'
    ? programFilteredData
    : programFilteredData.filter(d => d.Sprint === sprintFilter);

  // --- SCORECARD CALCULATIONS ---
  const totals = scorecardData.reduce((acc, row) => {
    acc.enrolled += parseInt(row.Current_Enrolled || '0');
    acc.activated += parseInt(row.Current_Activated || '0');
    acc.graduated += parseInt(row.Current_Graduated || '0');
    return acc;
  }, { enrolled: 0, activated: 0, graduated: 0 });

  const activationRate = totals.enrolled > 0 ? (totals.activated / totals.enrolled) * 100 : 0;

  // --- CHART 3: Grad/Completion by Country (Using Program-Filtered Data) ---
  const countryData = programFilteredData.reduce((acc: any, row) => {
    const c = row.Country || 'Unknown';
    if (!acc[c]) acc[c] = { enrolled: 0, graduated: 0 };
    acc[c].enrolled += parseInt(row.Current_Enrolled || '0');
    acc[c].graduated += parseInt(row.Current_Graduated || '0');
    return acc;
  }, {});
  
  const sortedCountries = Object.entries(countryData)
    .map(([name, vals]: any) => ({ 
      name, 
      rate: vals.enrolled > 0 ? (vals.graduated / vals.enrolled) * 100 : 0 
    }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 6);

  // --- CHART 6: CSAT & NPS by Sprint (Placeholder logic using 0s) ---
  const sprintStats = programFilteredData.reduce((acc: any, row) => {
    const s = row.Sprint || 'Unknown';
    if (!acc[s]) acc[s] = { count: 0, csat: 0, nps: 0 };
    acc[s].count += 1;
    acc[s].csat += parseFloat(row.CSAT || '0');
    acc[s].nps += parseFloat(row.NPS || '0');
    return acc;
  }, {});

  return (
    <div style={{ marginLeft: '260px', padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', color: '#002B56' }}>
      
      {/* HEADER & FILTERS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px' }}>Analytics & Performance</h1>
          <p style={{ color: '#64748b', fontSize: '16px', marginTop: '5px' }}>Historical Data & Cohort Analysis</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <select disabled style={filterStyle}>
            <option>Year: 2026</option>
          </select>
          <select value={sprintFilter} onChange={(e) => setSprintFilter(e.target.value)} style={filterStyle}>
            <option value="All">Scorecards: All Sprints</option>
            <option value="Sprint 1">Sprint 1</option>
            <option value="Sprint 2">Sprint 2</option>
            <option value="Sprint 3">Sprint 3</option>
          </select>
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} style={{...filterStyle, backgroundColor: '#002B56', color: 'white'}}>
            <option value="All">Global: All Programs</option>
            <option value="AICE">AiCE</option>
            <option value="PF">PF</option>
            <option value="VA">VA</option>
          </select>
        </div>
      </div>

      {/* SCORECARDS (Controlled by Sprint & Program) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <Card title="Total Paid Enrolled" value={totals.enrolled.toLocaleString()} />
        <Card title="Total Activated" value={totals.activated.toLocaleString()} />
        <Card 
          title="Activation Rate" 
          value={`${activationRate.toFixed(1)}%`} 
          valueColor={activationRate < 80 ? '#ef4444' : '#059669'} 
        />
        <Card title="Graduated Learners" value={totals.graduated.toLocaleString()} />
      </div>

      {/* CHARTS GRID SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        
        {/* CHART 1: Activation vs Graduation (Visual Placeholder) */}
        <div style={chartBox}>
          <h3 style={chartTitle}>1. Activation vs Graduation by Cohort</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', paddingTop: '20px' }}>
            {['Cohort A', 'Cohort B', 'Cohort C'].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '5px', alignItems: 'flex-end', height: '100%' }}>
                <div style={{ width: '40px', height: `${80 - (i*10)}%`, backgroundColor: '#002B56', borderRadius: '4px 4px 0 0' }}></div>
                <div style={{ width: '40px', height: `${50 - (i*5)}%`, backgroundColor: '#05F283', borderRadius: '4px 4px 0 0' }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px', fontSize: '12px', color: '#64748b' }}>
             <span><span style={{ color: '#002B56' }}>■</span> Activated</span>
             <span><span style={{ color: '#05F283' }}>■</span> Graduated</span>
          </div>
        </div>

        {/* CHART 3: Graduation Rate by Country */}
        <div style={chartBox}>
          <h3 style={chartTitle}>3. Graduation / Completion Rate by Country</h3>
          <div style={{ marginTop: '15px' }}>
            {sortedCountries.map((c, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                  <span>{c.name}</span>
                  <span style={{ fontWeight: 'bold' }}>{c.rate.toFixed(1)}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}>
                  <div style={{ width: `${c.rate}%`, height: '100%', backgroundColor: '#5648B7', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '30px' }}>
        
        {/* CHART 4: Program Performance */}
        <div style={chartBox}>
          <h3 style={chartTitle}>4. Program Performance (Sprints)</h3>
          <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
             Line Chart: Trajectory over Time
          </div>
        </div>

        {/* CHART 5: Map Visual */}
        <div style={chartBox}>
          <h3 style={chartTitle}>5. Enrollment Population Map</h3>
          <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontStyle: 'italic', backgroundColor: '#e2e8f0', borderRadius: '8px' }}>
             [Geographic Map Placeholder]
          </div>
        </div>

        {/* CHART 6: CSAT & NPS */}
        <div style={chartBox}>
          <h3 style={chartTitle}>6. CSAT & NPS by Sprint</h3>
          {Object.entries(sprintStats).map(([sprint, stats]: any, i) => (
             <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
               <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{sprint}</span>
               <span style={{ fontSize: '14px', color: '#002B56' }}>CSAT: {(stats.count > 0 ? stats.csat/stats.count : 0).toFixed(1)}</span>
               <span style={{ fontSize: '14px', color: '#059669' }}>NPS: {(stats.count > 0 ? stats.nps/stats.count : 0).toFixed(1)}</span>
             </div>
          ))}
        </div>

      </div>
    </div>
  );
}

// --- STYLING CONSTANTS ---
const filterStyle = {
  padding: '10px 15px', 
  borderRadius: '8px', 
  border: '1px solid #cbd5e1', 
  cursor: 'pointer', 
  backgroundColor: 'white', 
  fontWeight: '600', 
  fontSize: '14px'
};

const chartBox = {
  backgroundColor: 'white', 
  padding: '25px', 
  borderRadius: '15px', 
  border: '1px solid #e2e8f0', 
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const chartTitle = {
  margin: '0 0 15px 0', 
  fontSize: '16px', 
  borderBottom: '2px solid #f1f5f9', 
  paddingBottom: '10px',
  color: '#002B56'
};

function Card({ title, value, valueColor }: any) {
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', borderTop: `4px solid ${valueColor || '#002B56'}`, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.05em' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: valueColor || '#002B56' }}>{value}</div>
    </div>
  );
}
