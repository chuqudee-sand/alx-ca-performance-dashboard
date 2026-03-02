"use client";
import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, 
  LineChart, Line, ComposedChart 
} from 'recharts';

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

  if (loading) return <div style={{ padding: '40px', marginLeft: '260px', fontSize: '20px', color: '#002B56' }}>Fetching Data from all CA Program Trackers....</div>;

  // --- FILTERING LOGIC ---
  const programFilteredData = programFilter === 'All' 
    ? data 
    : data.filter(d => (d.Program || '').toUpperCase().includes(programFilter.toUpperCase()));

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

  // --- CHART DATA PREPARATION ---
  const sprintGroups = programFilteredData.reduce((acc: any, row) => {
    const s = row.Sprint || 'Unknown Sprint';
    if (!acc[s]) acc[s] = { Sprint: s, Enrolled: 0, Activated: 0, Graduated: 0, CSAT_Sum: 0, NPS_Sum: 0, count: 0 };
    acc[s].Enrolled += parseInt(row.Current_Enrolled || '0');
    acc[s].Activated += parseInt(row.Current_Activated || '0');
    acc[s].Graduated += parseInt(row.Current_Graduated || '0');
    acc[s].CSAT_Sum += parseFloat(row.CSAT || '0');
    acc[s].NPS_Sum += parseFloat(row.NPS || '0');
    acc[s].count += 1;
    return acc;
  }, {});

  const sprintData = Object.values(sprintGroups).map((d: any) => ({
    ...d,
    GradRate: d.Activated > 0 ? parseFloat(((d.Graduated / d.Activated) * 100).toFixed(1)) : 0,
    CSAT: d.count > 0 ? parseFloat((d.CSAT_Sum / d.count).toFixed(1)) : 0,
    NPS: d.count > 0 ? parseFloat((d.NPS_Sum / d.count).toFixed(1)) : 0,
  })).sort((a: any, b: any) => a.Sprint.localeCompare(b.Sprint));

  const countryGroups = programFilteredData.reduce((acc: any, row) => {
    const c = row.Country || 'Unknown';
    if (!acc[c]) acc[c] = { Country: c, Enrolled: 0, Activated: 0, Graduated: 0 };
    acc[c].Enrolled += parseInt(row.Current_Enrolled || '0');
    acc[c].Activated += parseInt(row.Current_Activated || '0');
    acc[c].Graduated += parseInt(row.Current_Graduated || '0');
    return acc;
  }, {});

  const countryDataByPop = Object.values(countryGroups)
    .sort((a: any, b: any) => b.Enrolled - a.Enrolled)
    .slice(0, 8); 

  const countryDataByGrad = Object.values(countryGroups)
    .map((d: any) => ({
      Country: d.Country,
      GradRate: d.Activated > 0 ? parseFloat(((d.Graduated / d.Activated) * 100).toFixed(1)) : 0
    }))
    .sort((a: any, b: any) => b.GradRate - a.GradRate)
    .slice(0, 8);

  return (
    <div style={{ marginLeft: '260px', padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif', color: '#002B56' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <Card title="Total Paid Enrolled" value={totals.enrolled.toLocaleString()} />
        <Card title="Total Activated" value={totals.activated.toLocaleString()} />
        <Card title="Activation Rate" value={`${activationRate.toFixed(1)}%`} valueColor={activationRate < 80 ? '#ef4444' : '#059669'} />
        <Card title="Graduated Learners" value={totals.graduated.toLocaleString()} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <div style={chartBox}>
          <h3 style={chartTitle}>1. Activation vs Graduation (By Sprint)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={sprintData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="Sprint" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Bar dataKey="Activated" fill="#002B56" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Graduated" fill="#05F283" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h3 style={chartTitle}>2. Graduation Rates by Sprint</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={sprintData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="Sprint" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} domain={[0, 100]} unit="%" />
              <RechartsTooltip cursor={{fill: '#f1f5f9'}} formatter={(val: number) => `${val}%`} />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Line type="monotone" dataKey="GradRate" name="Graduation Rate %" stroke="#5648B7" strokeWidth={3} dot={{r: 5}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        <div style={chartBox}>
          <h3 style={chartTitle}>3. Graduation Rate by Country (Top 8)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryDataByGrad}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="Country" tick={{fontSize: 11}} />
              <YAxis tick={{fontSize: 12}} domain={[0, 100]} unit="%" />
              <RechartsTooltip cursor={{fill: '#f1f5f9'}} formatter={(val: number) => `${val}%`} />
              <Bar dataKey="GradRate" name="Completion Rate %" fill="#5648B7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h3 style={chartTitle}>4. Performance Trajectory across Sprints</h3>
          <ResponsiveContainer width="100%" height={250}>
            {/* FIXED: Changed AreaChart to LineChart to match the <Line> tags inside */}
            <LineChart data={sprintData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="Sprint" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Line type="monotone" dataKey="Enrolled" stroke="#002B56" strokeWidth={3} />
              <Line type="monotone" dataKey="Activated" stroke="#FF5347" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={chartBox}>
          <h3 style={chartTitle}>5. Enrollment Population Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={countryDataByPop} layout="vertical" margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis type="number" tick={{fontSize: 12}} />
              <YAxis dataKey="Country" type="category" tick={{fontSize: 11}} />
              <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
              <Bar dataKey="Enrolled" fill="#05F283" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h3 style={chartTitle}>6. CSAT & NPS Scores by Sprint</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={sprintData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="Sprint" tick={{fontSize: 12}} />
              <YAxis tick={{fontSize: 12}} />
              <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
              <Legend wrapperStyle={{fontSize: '12px'}} />
              <Bar dataKey="NPS" fill="#FF5347" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="CSAT" stroke="#002B56" strokeWidth={3} dot={{r: 5}} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

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
  margin: '0 0 20px 0', 
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
