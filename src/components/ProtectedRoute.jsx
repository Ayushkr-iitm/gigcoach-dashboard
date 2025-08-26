import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div>Application Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;