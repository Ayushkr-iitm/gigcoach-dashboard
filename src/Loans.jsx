import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import Modal from './components/Modal';
import './index.css'; // Use the main stylesheet

// A card for displaying a single loan option
const LoanOptionCard = ({ loan }) => (
    <div className="stat-card" style={{ borderLeft: `5px solid ${loan.eligible ? '#4f46e5' : '#d1d5db'}`, opacity: loan.eligible ? 1 : 0.6 }}>
        <div style={{width: '100%'}}>
            <h3 style={{ color: loan.eligible ? '#4f46e5' : '#6b7280', fontSize: '18px', fontWeight: 600, marginTop: 0 }}>{loan.name}</h3>
            <p style={{ fontSize: '24px', fontWeight: 700, margin: '4px 0' }}>{loan.amount}</p>
            <div style={{ fontSize: '16px', color: '#6b7280', marginTop: '10px' }}>
                <p style={{ margin: 0 }}>Interest: {loan.interest}</p>
                <p style={{ margin: '4px 0 0 0' }}>Requires GigScore: {loan.minScore}+</p>
            </div>
            <button className={loan.eligible ? 'btn-primary' : 'btn-secondary'} style={{ marginTop: '20px', width: '100%', fontSize: '16px' }} disabled={!loan.eligible}>
                {loan.eligible ? 'Apply Now' : 'Not Eligible'}
            </button>
        </div>
    </div>
);

const Loans = () => {
    const [loanOptionsData, setLoanOptionsData] = useState(null);
    const [activeLoans, setActiveLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLoan, setNewLoan] = useState({ lender_name: '', total_amount: '', outstanding_amount: '', interest_rate: '', due_date: '' });
    const { user } = useAuth();

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [optionsRes, activeLoansRes] = await Promise.all([
                axios.get(`http://localhost:3000/api/loans/${user.phone_number}`),
                axios.get(`http://localhost:3000/api/user-loans/${user.phone_number}`)
            ]);
            setLoanOptionsData(optionsRes.data);
            setActiveLoans(activeLoansRes.data);
        } catch (error) {
            console.error("Failed to fetch loan data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleInputChange = (e) => setNewLoan({ ...newLoan, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/user-loans', { ...newLoan, phone_number: user.phone_number });
            setIsModalOpen(false);
            setNewLoan({ lender_name: '', total_amount: '', outstanding_amount: '', interest_rate: '', due_date: '' });
            fetchData();
        } catch (error) {
            alert('Failed to add loan.');
        }
    };

    return (
        <>
            <header className="header">
                <h1>Loan Center</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Existing Loan</button>
            </header>

            {/* Section for Active Loans */}
            <div className="stat-card" style={{marginBottom: '32px'}}>
                <h3 style={{fontSize: '20px', fontWeight: 600, marginTop: 0}}>Your Active Loans</h3>
                {loading ? <p>Loading...</p> : activeLoans.length > 0 ? (
                    <ul style={{listStyle: 'none', padding: 0, margin: '16px 0 0 0'}}>
                       {activeLoans.map(loan => (
                           <li key={loan.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f3f4f6'}}>
                               <div>
                                   <p style={{fontWeight: 600, margin: 0}}>{loan.lender_name}</p>
                                   <p style={{fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0'}}>Due: {new Date(loan.due_date).toLocaleDateString()}</p>
                               </div>
                               <p style={{fontWeight: 600, margin: 0, fontSize: '18px'}}>₹{parseFloat(loan.outstanding_amount).toLocaleString('en-IN')}</p>
                           </li>
                       ))}
                    </ul>
                ) : <p style={{color: '#6b7280', marginTop: '16px'}}>You have no active loans logged.</p>}
            </div>
            
            {/* Section for Loan Options */}
            {loading ? <p>Loading options...</p> : loanOptionsData && (
                <>
                    <div className="stat-card" style={{ marginBottom: '32px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <h3 style={{fontSize: '18px'}}>Your Current GigScore</h3>
                        <p style={{ fontSize: '52px', color: '#4f46e5', margin: '8px 0' }}>{loanOptionsData.gigScore}</p>
                    </div>
                    <h2 style={{fontSize: '24px', fontWeight: 600}}>Available Loan Products</h2>
                    <div className="stats-grid">
                        {loanOptionsData.loanOptions.map(loan => <LoanOptionCard key={loan.name} loan={loan} />)}
                    </div>
                </>
            )}
            
            <Modal title="Add an Existing Loan" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group"><label>Lender Name</label><input type="text" name="lender_name" value={newLoan.lender_name} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Total Loan Amount (₹)</label><input type="number" name="total_amount" value={newLoan.total_amount} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Outstanding Amount (₹)</label><input type="number" name="outstanding_amount" value={newLoan.outstanding_amount} onChange={handleInputChange} required /></div>
                    <div className="form-group"><label>Interest Rate (%)</label><input type="number" step="0.01" name="interest_rate" value={newLoan.interest_rate} onChange={handleInputChange} /></div>
                    <div className="form-group"><label>Next Due Date</label><input type="date" name="due_date" value={newLoan.due_date} onChange={handleInputChange} /></div>
                    <div className="form-actions"><button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="btn-primary">Save Loan</button></div>
                </form>
            </Modal>
        </>
    );
};

export default Loans;