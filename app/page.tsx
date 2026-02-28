return (
  <div style={{ color: '#002B56' }}>
    <header style={{ marginBottom: '40px' }}>
      <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>Executive Overview</h1>
      <p style={{ color: '#64748b', marginTop: '8px' }}>Live 2026 Revenue Pipeline</p>
    </header>

    {/* The $6M Progress Tracker Box */}
    <div style={{ backgroundColor: 'white', padding: '32px', borderRadius: '8px', borderTop: '4px solid #05F283', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
      <div style={{ fontWeight: '500' }}>Progress to $6.0M Access Fee Goal</div>
      <div style={{ fontSize: '36px', fontWeight: 'bold', marginTop: '8px' }}>
        ${totalProjected.toLocaleString()} / $6.0M
      </div>
      {/* Visual Progress Bar */}
      <div style={{ width: '100%', backgroundColor: '#e2e8f0', height: '12px', borderRadius: '6px', marginTop: '16px', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, backgroundColor: '#05F283', height: '100%' }}></div>
      </div>
    </div>

    {/* Grid of Country Cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
      {data.slice(0, 9).map((item, idx) => (
        <div key={idx} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', borderTop: '4px solid #5648B7', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>{item.Program} - {item.Country}</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>{item.Projected_Revenue}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px' }}>
            <span>Activation Health</span>
            <span style={{ fontWeight: 'bold' }}>{item.Activation_Health}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);
