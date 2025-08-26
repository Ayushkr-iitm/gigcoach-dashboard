import React from 'react';
import { useData } from './context/DataContext';

const GigScore = () => {
  const { loans, initialLoad } = useData();

  if (initialLoad) {
    return <><header className="header"><h1>GigScore Insights</h1></header><p>Calculating score...</p></>;
  }
  if (!loans) {
    return <><header className="header"><h1>GigScore Insights</h1></header><p>Could not load score data.</p></>;
  }

  return (
    <>
      <header className="header">
        <h1>GigScore Insights</h1>
      </header>
      <div style={{ display: 'flex', gap: '24px' }}>
        <div className="stat-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#6b7280' }}>Your Current GigScore</h3>
          <p style={{ fontSize: '96px', fontWeight: 'bold', color: '#4f46e5', margin: '20px 0' }}>
            {loans.gigScore}
          </p>
          <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center' }}>
            This score determines your financial health and access to better credit products.
          </p>
        </div>
        <div className="stat-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600 }}>How to Improve Your Score</h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '16px', color: '#4b5563', flexGrow: 1, marginTop: '20px' }}>
            <li style={{ marginBottom: '12px' }}><strong>Maintain Consistent Earnings</strong></li>
            <li style={{ marginBottom: '12px' }}><strong>Build a Longer History</strong></li>
            <li style={{ marginBottom: '12px' }}><strong>Increase Average Income</strong></li>
            <li style={{ marginBottom: '12px' }}><strong>Set and Achieve Savings Goals</strong></li>
          </ul>
        </div>
      </div>
    </>
  );
};
export default GigScore;