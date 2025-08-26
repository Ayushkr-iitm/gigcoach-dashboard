import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

const StatCard = ({ title, value, subtext }) => (
    <div className="stat-card">
        <p className="stat-card-label">{title}</p>
        <p className="stat-card-value">{`₹${value.toLocaleString('en-IN')}`}</p>
        {subtext && <p style={{color: '#6b7280', fontSize: '14px', margin: 0}}>{subtext}</p>}
    </div>
);

const Taxes = () => {
    const [taxData, setTaxData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const fetchTaxData = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/api/tax-estimate/${user.phone_number}`);
                    setTaxData(response.data);
                } catch (error) {
                    console.error("Failed to fetch tax data:", error);
                }
                setLoading(false);
            };
            fetchTaxData();
        }
    }, [user]);

    return (
        <>
            <header className="header">
                <h1>Tax Estimator</h1>
            </header>
            {loading ? <p>Calculating tax estimate...</p> : !taxData ? <p>Could not load tax data.</p> : (
                <>
                    <div className="stats-grid">
                        <StatCard title="Total Gross Income (FY)" value={taxData.grossIncome} />
                        <StatCard title="Business Deductions (Expenses)" value={taxData.totalDeductions} />
                        <StatCard title="Net Taxable Income" value={taxData.taxableIncome} />
                    </div>
                    <div className="stat-card" style={{borderColor: '#ef4444', borderWidth: '2px'}}>
                        <p className="stat-card-label" style={{color: '#ef4444'}}>Estimated Tax Due for this Year</p>
                        <p className="stat-card-value" style={{color: '#ef4444'}}>{`₹${taxData.estimatedTax.toLocaleString('en-IN')}`}</p>
                        <p style={{color: '#6b7280', fontSize: '14px', marginTop: '10px'}}>This is an estimate based on the new tax regime. Please consult a financial advisor for official tax advice.</p>
                    </div>
                </>
            )}
        </>
    );
};

export default Taxes;