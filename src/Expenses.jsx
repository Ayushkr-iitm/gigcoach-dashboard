import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import Modal from './components/Modal';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Expenses = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({ category: 'Fuel', amount: '', expense_date: '', description: '' });
    const { user } = useAuth();

    const fetchExpenses = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/api/expenses/${user.phone_number}`);
            setExpenses(response.data);
        } catch (error) {
            console.error("Failed to fetch expenses:", error);
            setExpenses([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchExpenses();
    }, [user]);

    const handleInputChange = (e) => setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/expenses', { ...newExpense, phone_number: user.phone_number });
            setIsModalOpen(false);
            setNewExpense({ category: 'Fuel', amount: '', expense_date: '', description: '' });
            fetchExpenses();
        } catch (error) {
            alert('Failed to add expense.');
        }
    };

    // Prepare data for the pie chart
    const expenseCategories = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(expenseCategories),
        datasets: [{
            label: 'Expenses by Category',
            data: Object.values(expenseCategories),
            backgroundColor: ['#4f46e5', '#f97316', '#10b981', '#ef4444', '#3b82f6', '#facc15'],
        }],
    };

    return (
        <>
            <header className="header">
                <h1>Expense Tracker</h1>
                <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Expense</button>
            </header>

            <div style={{ display: 'flex', gap: '24px' }}>
                <div className="stat-card" style={{flex: 1.5}}>
                    <h3 style={{fontSize: '20px', fontWeight: 600}}>Recent Expenses</h3>
                    <ul style={{listStyle: 'none', padding: 0, marginTop: '20px'}}>
                        {loading ? <p>Loading...</p> : expenses.length > 0 ? expenses.slice(0, 5).map(exp => (
                            <li key={exp.id} style={{display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6'}}>
                                <div>
                                    <p style={{fontWeight: 600, margin: 0}}>{exp.category}</p>
                                    <p style={{fontSize: '14px', color: '#6b7280', margin: 0}}>{exp.description}</p>
                                </div>
                                <p style={{fontWeight: 600, margin: 0}}>- ₹{parseFloat(exp.amount).toLocaleString('en-IN')}</p>
                            </li>
                        )) : <p>No expenses logged yet.</p>}
                    </ul>
                </div>
                <div className="stat-card" style={{flex: 1}}>
                    <h3 style={{fontSize: '20px', fontWeight: 600, textAlign: 'center'}}>Expense Breakdown</h3>
                    {expenses.length > 0 ? <Pie data={chartData} /> : <p style={{textAlign: 'center', marginTop: '20px'}}>No data for chart.</p>}
                </div>
            </div>

            <Modal title="Add a New Expense" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Amount (₹)</label>
                        <input type="number" name="amount" value={newExpense.amount} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input type="date" name="expense_date" value={newExpense.expense_date} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={newExpense.category} onChange={handleInputChange} style={{width: '100%', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px'}}>
                            <option>Fuel</option>
                            <option>Maintenance</option>
                            <option>Food</option>
                            <option>Supplies</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description (Optional)</label>
                        <input type="text" name="description" value={newExpense.description} onChange={handleInputChange} />
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">Save Expense</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};
export default Expenses;