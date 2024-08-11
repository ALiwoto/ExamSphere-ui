import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';

const Dashboard = () => <div>Dashboard</div>; // Placeholder component

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        try {
          const response = await axios.get('https://example.com/user/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setIsLoggedIn(true);
        } catch (error) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
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