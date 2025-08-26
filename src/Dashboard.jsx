import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import EarningsChart from './components/EarningsChart';
import Modal from './components/Modal';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value }) => (
    <div className="stat-card">
        <p className="stat-card-label">{title}</p>
        <p className="stat-card-value">{value}</p>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { dashboardData, loans, initialLoad, addEarning } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEarning, setNewEarning] = useState({ amount: '', date: '' });

    const handleInputChange = (e) => {
        setNewEarning({ ...newEarning, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addEarning(newEarning);
            setIsModalOpen(false);
            setNewEarning({ amount: '', date: '' });
        } catch (error) {
            alert("Failed to add new earning.");
        }
    };

    if (initialLoad) {
        return <><header className="header"><h1>Dashboard</h1></header><p>Loading...</p></>;
    }

    const totalEarnings = dashboardData.reduce((sum, record) => sum + parseFloat(record.amount), 0);
    const avgIncome = dashboardData.length > 0 ? `₹${Math.round(totalEarnings / dashboardData.length).toLocaleString('en-IN')}` : '₹0';
    const forecastValue = `₹15,295`; // Placeholder forecast

    return (
        <>
            <header className="header">
                <h1>Dashboard</h1>
                <div>
                  <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Earning</button>
                </div>
            </header>
            <div className="stats-grid">
                <StatCard title="Avg Monthly Income" value={avgIncome} />
                <StatCard title="AI Forecast (Next Month)" value={forecastValue} />
                <Link to="/gigscore" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <StatCard title="Current GigScore" value={loans ? loans.gigScore : '...'} />
                </Link>
            </div>
            <div className="chart-container">
                {dashboardData.length > 0 ? <EarningsChart chartData={dashboardData} /> : <div style={{textAlign: 'center', paddingTop: '20px'}}><p>No earnings data yet. Click "+ Add Earning" to start!</p></div>}
            </div>

            <Modal title="Add a New Earning" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="amount">Amount (₹)</label>
                        <input type="number" id="amount" name="amount" value={newEarning.amount} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" name="date" value={newEarning.date} onChange={handleInputChange} required />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Earning</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};
export default Dashboard;