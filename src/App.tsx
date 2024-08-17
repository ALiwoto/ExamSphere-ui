import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CurrentAppTranslation } from './translations/appTranslation';
import apiClient from './apiClient';
import Login from './pages/loginPage';
import CreateUserPage from './pages/createUserPage';
import Dashboard from './pages/dashboardPage';
import SearchUserPage from './pages/searchUserPage';
import UserInfoPage from './pages/userInfoPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(apiClient.isLoggedIn());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (apiClient.isLoggedIn()) {
        try {
          const response = await apiClient.getCurrentUserInfo();
          console.log(`logged in as ${response.user_id} | ${response.full_name}`);
          setIsLoggedIn(true);
        } catch (error) {
          apiClient.clearTokens();
          setIsLoggedIn(false);
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>{CurrentAppTranslation.LoadingText}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route 
          path="/createUser" 
          element={apiClient.canCreateNewUsers() ? <CreateUserPage/> : <Navigate to="/dashboard" />}
        />
        <Route 
          path="/searchUser" 
          element={apiClient.canSearchUser() ? <SearchUserPage/> : <Navigate to="/dashboard" />}
        />
        <Route 
          path="/userInfo" 
          element={apiClient.canSearchUser() ? <UserInfoPage/> : <Navigate to="/dashboard" />}
        />
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;