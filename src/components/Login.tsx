import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import backgroundImage from '../assets/login_bg1.jpg';
import apiClient from '../apiClient';
import { ApiHandlersAPIErrorCode } from '../api';

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
  width: 90%;
  max-width: 350px;
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

const CaptchaContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const CaptchaImage = styled.img`
  width: 150px;
  height: 50px;
  margin-right: 10px;
  width: 40%;
  max-width: 110px;
`;

const ReloadButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
`;

const CaptchaInput = styled(Input)`
  width: 100%;
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [isCaptchaIncorrect, setIsCaptchaIncorrect] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiClient.loginWithPass({
        user_id: username,
        password: password,
        captcha_id: apiClient.lastCaptchaId,
        captcha_answer: captchaAnswer,
        client_rid: apiClient.clientRId,
      })
      console.log(response.full_name);
      // Handle successful login here
    } catch (error: any) {
      let errorCode = error.response?.data?.error.code;
      if (!errorCode) {
        setLoginError('Unknown error occurred. Please try again later.');
        // this might also be a network failure...hence why it's better we don't
        // try to reload the captcha or other things here *automatically*.
        return;
      }

      switch (error.response?.data?.error.code) {
        case ApiHandlersAPIErrorCode.ErrCodeInvalidCaptcha:
          setLoginError('Invalid CAPTCHA. Please try again.');
          reloadCaptcha();
          setIsCaptchaIncorrect(true);
          break;
        case ApiHandlersAPIErrorCode.ErrCodeInvalidUsernamePass:
          setLoginError('Invalid username or password.');
          reloadCaptcha();
          break;
        default:
          setLoginError(`An error occurred (${error.response?.data?.error.code}). Please try again later.`);
          break;
      }
    }
  };

  const reloadCaptcha = async () => {
    setCaptchaImage(await apiClient.getCaptchaImage());
  };

  useEffect(() => {
    apiClient.getCaptchaImage().then((value) => {
      setCaptchaImage(value);
    });
  }, []);

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        width: '100%', 
        marginBottom: '10px'
      }}>
        <h2>Welcome to ExamSphere!</h2>
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
        <CaptchaContainer style={{ border: isCaptchaIncorrect ? '2px solid red' : 'none' }}>
          <CaptchaImage src={captchaImage} alt="CAPTCHA" />
          <ReloadButton type="button" onClick={reloadCaptcha}>↻</ReloadButton>
          <CaptchaInput
            type="text"
            placeholder="Enter CAPTCHA"
            value={captchaAnswer}
            onChange={(e) => {
              setCaptchaAnswer(e.target.value);
              setIsCaptchaIncorrect(false); // Reset error state
            }}
            required
          />
        </CaptchaContainer>
        <Button type="submit">Log In</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;