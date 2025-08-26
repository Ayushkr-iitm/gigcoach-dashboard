import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Dashboard from './Dashboard';
import Goals from './Goals';
import Loans from './Loans';
import Profile from './Profile';
import GigScore from './GigScore';
import Expenses from './Expenses'; 
import Taxes from './Taxes'; // <--
// --- FIX: Added 'CalculatorIcon' to the import list ---
import { HomeIcon, TrophyIcon, BanknotesIcon, UserCircleIcon, ChatBubbleLeftRightIcon, ArrowLeftOnRectangleIcon, CalculatorIcon, ScaleIcon } from '@heroicons/react/24/solid';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Goals', href: '/goals', icon: TrophyIcon },
    { name: 'Loans', href: '/loans', icon: BanknotesIcon },
    { name: 'Expenses', href: '/expenses', icon: CalculatorIcon },
    { name: 'Taxes', href: '/taxes', icon: ScaleIcon },
    { name: 'Profile', href: '/profile', icon: UserCircleIcon },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-header">GigCoach AI</h2>
        <nav className="sidebar-nav">
          {navLinks.map((item) => (
            <NavLink key={item.name} end to={item.href} className={({ isActive }) => `flex items-center ${isActive ? 'active' : ''}`}>
              <item.icon style={{ height: '22px', width: '22px', marginRight: '16px' }} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div>
            <a href={`https://wa.me/14155238886`} target="_blank" rel="noopener noreferrer" className="whatsapp-button">
                <ChatBubbleLeftRightIcon style={{height: '22px', width: '22px', marginRight: '12px'}}/>
                <span>WhatsApp Chatbot</span>
            </a>
            <button onClick={handleLogout} className="logout-button">
                <ArrowLeftOnRectangleIcon style={{height: '22px', width: '22px', marginRight: '16px'}}/>
                <span>Logout</span>
            </button>
        </div>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/loans" element={<Loans />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/taxes" element={<Taxes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/gigscore" element={<GigScore />} />
        </Routes>
      </main>
    </div>
  );
};
export default DashboardLayout;