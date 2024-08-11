import React, { useState } from 'react';
import styled from 'styled-components';
import backgroundImage from '../assets/login_bg1.jpg';
import apiClient  from '../apiClient';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

const LoginForm = styled.form`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: #1877f2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #166fe5;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffcdd2;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 1rem;
  text-align: center;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiClient.apiV1UserLoginPost({
        user_id: username,
        password: password,
      })
      console.log(response.data.result);
      // Handle successful login here
    } catch (error) {
      setLoginError('Login failed. Please check your username and password.');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <h2>Welcome!</h2>
        </div>
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Log In</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;