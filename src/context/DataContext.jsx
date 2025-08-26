import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Corrected Path

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [initialLoad, setInitialLoad] = useState(true);
  const [dashboardData, setDashboardData] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loans, setLoans] = useState(null);

  const fetchData = async () => {
    if (!user) {
        setInitialLoad(false);
        return;
    };
    setInitialLoad(true);
    try {
      const userPhoneNumber = user.phone_number;
      const [dashRes, goalsRes, loansRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/forecast/${userPhoneNumber}`).catch(() => ({ data: { data: [] } })),
        axios.get(`http://localhost:3000/api/goals/${userPhoneNumber}`).catch(() => ({ data: [] })),
        axios.get(`http://localhost:3000/api/loans/${userPhoneNumber}`).catch(() => ({ data: { gigScore: 300, loanOptions: [] } }))
      ]);
      setDashboardData(dashRes.data.data);
      setGoals(goalsRes.data);
      setLoans(loansRes.data);
    } catch (error) {
      console.error("Failed to fetch all data", error);
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const addEarning = async (newEarning) => {
    await axios.post('http://localhost:3000/api/earnings', { ...newEarning, phone_number: user.phone_number });
    await fetchData();
  };

  const createGoal = async (newGoal) => {
    await axios.post('http://localhost:3000/api/goals', { ...newGoal, phone_number: user.phone_number });
    await fetchData();
  };

  const updateGoal = async (goalId, amountToAdd) => {
    await axios.put(`http://localhost:3000/api/goals/${goalId}`, { amountToAdd });
    await fetchData();
  };

  const editGoal = async (goalId, goalDetails) => {
    await axios.put(`http://localhost:3000/api/goals/${goalId}`, goalDetails);
    await fetchData(); // Refetch all data to update the UI
  };

  const deleteGoal = async (goalId) => {
    if (window.confirm("Are you sure you want to delete this goal?")) {
      await axios.delete(`http://localhost:3000/api/goals/${goalId}`);
      await fetchData();
    }
  };

  const value = { initialLoad, dashboardData, goals, loans, addEarning, createGoal, updateGoal, deleteGoal, editGoal };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  return useContext(DataContext);
};