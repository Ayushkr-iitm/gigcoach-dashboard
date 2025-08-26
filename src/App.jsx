import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/*" element={<DashboardLayout />} />
      </Route>
    </Routes>
  );
}
export default App;