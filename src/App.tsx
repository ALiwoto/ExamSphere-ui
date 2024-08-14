import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/loginPage';
import Dashboard from './pages/dashboardPage';
import apiClient from './apiClient';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('ExamSphere_accessToken');
      const refreshToken = localStorage.getItem('ExamSphere_refreshToken');

      if (accessToken && refreshToken) {
        try {
          const response = await apiClient.getCurrentUserInfo();
          console.log(response.full_name);
          setIsLoggedIn(true);
        } catch (error) {
          localStorage.removeItem('ExamSphere_accessToken');
          localStorage.removeItem('ExamSphere_refreshToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;