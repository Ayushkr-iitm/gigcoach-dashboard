import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './components/Modal';
import { useAuth } from './context/AuthContext';
import { useData } from './context/DataContext';
import './index.css';

// A single card for displaying a goal
const GoalCard = ({ goal, onAddSavings, onDelete, onEdit }) => {
    const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
    return (
      // FIX: Added minHeight to make cards larger
      <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', display: 'flex', minHeight: '160px' }}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '18px', fontWeight: 600 }}>{goal.goal_name}</h3>
          {/* FIX: Smaller buttons */}
          <div style={{display: 'flex', gap: '6px'}}>
            <button style={{ padding: '4px 8px', fontSize: '12px' }} className="btn-secondary" onClick={() => onEdit(goal)}>Edit</button>
            <button style={{ padding: '4px 8px', fontSize: '12px' }} className="btn-secondary" onClick={() => onAddSavings(goal)}>Add Savings</button>
            <button style={{ padding: '4px 8px', fontSize: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer' }} onClick={() => onDelete(goal.id)}>Delete</button>
          </div>
        </div>
        
        {/* FIX: Added the missing amount and progress bar back */}
        <div style={{marginTop: 'auto', width: '100%'}}>
            <p style={{ fontSize: '24px', margin: '0 0 10px 0', fontWeight: 700 }}>
              ₹{parseFloat(goal.current_amount).toLocaleString('en-IN')} / 
              <span style={{ color: '#6b7280', fontSize: '20px' }}> ₹{parseFloat(goal.target_amount).toLocaleString('en-IN')}</span>
            </p>
            <div style={{ width: '100%', backgroundColor: '#e5e7eb', borderRadius: '10px' }}>
              <div style={{
                width: `${progress}%`,
                backgroundColor: '#4f46e5',
                height: '10px',
                borderRadius: '10px',
                transition: 'width 0.5s ease-in-out'
              }}></div>
            </div>
            <p style={{ alignSelf: 'flex-end', margin: '5px 0 0 0', fontSize: '14px', color: '#6b7280', width: '100%', textAlign: 'right' }}>{Math.round(progress)}% Complete</p>
        </div>
      </div>
    );
};


const Goals = () => {
    const { goals, initialLoad, createGoal, updateGoal, deleteGoal, editGoal } = useData();
    const { user } = useAuth();
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [amountToAdd, setAmountToAdd] = useState('');
    const [newGoal, setNewGoal] = useState({ goal_name: '', target_amount: '', target_date: '' });
    const [editingGoal, setEditingGoal] = useState(null);

    const handleCreateInputChange = (e) => setNewGoal({ ...newGoal, [e.target.name]: e.target.value });
    const handleCreateSubmit = (e) => {
        e.preventDefault();
        createGoal(newGoal);
        setCreateModalOpen(false);
        setNewGoal({ goal_name: '', target_amount: '', target_date: '' });
    };

    const openUpdateModal = (goal) => {
        setSelectedGoal(goal);
        setAmountToAdd('');
        setUpdateModalOpen(true);
    };

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        if (!selectedGoal) return;
        updateGoal(selectedGoal.id, amountToAdd);
        setUpdateModalOpen(false);
    };

    const openEditModal = (goal) => {
        setEditingGoal({ ...goal, target_amount: parseFloat(goal.target_amount) });
        setEditModalOpen(true);
    };

    const handleEditInputChange = (e) => {
        setEditingGoal({ ...editingGoal, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        editGoal(editingGoal.id, {
            goal_name: editingGoal.goal_name,
            target_amount: editingGoal.target_amount
        });
        setEditModalOpen(false);
    };

    return (
        <>
            <header className="header">
                <h1>Financial Goals</h1>
                <button className="btn-primary" onClick={() => setCreateModalOpen(true)}>+ Create New Goal</button>
            </header>

            <div className="stats-grid">
                {initialLoad ? <p>Loading goals...</p> : goals.length > 0 ? (
                    goals.map(goal => <GoalCard key={goal.id} goal={goal} onAddSavings={openUpdateModal} onDelete={deleteGoal} onEdit={openEditModal} />)
                ) : <div className="stat-card"><p>You haven't set any goals yet.</p></div>}
            </div>
            
            <Modal title="Create a New Goal" isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)}>
                <form onSubmit={handleCreateSubmit}>
                    <div className="form-group"><label>Goal Name</label><input type="text" name="goal_name" value={newGoal.goal_name} onChange={handleCreateInputChange} required /></div>
                    <div className="form-group"><label>Target Amount (₹)</label><input type="number" name="target_amount" value={newGoal.target_amount} onChange={handleCreateInputChange} required /></div>
                    <div className="form-group"><label>Target Date</label><input type="date" name="target_date" value={newGoal.target_date} onChange={handleCreateInputChange} /></div>
                    <div className="form-actions"><button type="button" className="btn-secondary" onClick={() => setCreateModalOpen(false)}>Cancel</button><button type="submit" className="btn-primary">Save Goal</button></div>
                </form>
            </Modal>

            <Modal title={`Add Savings to "${selectedGoal?.goal_name}"`} isOpen={isUpdateModalOpen} onClose={() => setUpdateModalOpen(false)}>
                <form onSubmit={handleUpdateSubmit}>
                    <div className="form-group"><label>Amount to Add (₹)</label><input type="number" name="amountToAdd" value={amountToAdd} onChange={(e) => setAmountToAdd(e.target.value)} required /></div>
                    <div className="form-actions"><button type="button" className="btn-secondary" onClick={() => setUpdateModalOpen(false)}>Cancel</button><button type="submit" className="btn-primary">Add Savings</button></div>
                </form>
            </Modal>

            <Modal title="Edit Goal" isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
                {editingGoal && (
                    <form onSubmit={handleEditSubmit}>
                        <div className="form-group">
                            <label>Goal Name</label>
                            <input type="text" name="goal_name" value={editingGoal.goal_name} onChange={handleEditInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>Target Amount (₹)</label>
                            <input type="number" name="target_amount" value={editingGoal.target_amount} onChange={handleEditInputChange} required />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setEditModalOpen(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">Save Changes</button>
                        </div>
                    </form>
                )}
            </Modal>
        </>
    );
};
export default Goals;