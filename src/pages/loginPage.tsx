import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import apiClient from '../apiClient';
import { APIErrorCode } from '../api';

/* *********** components import *********** */
import LoginContainer from '../components/containers/loginContainer';
import ReloadButton from '../components/buttons/reloadButton';
import LoginInput from '../components/inputs/loginInput';
import CaptchaImage from '../components/images/captchaImage';
import SubmitButton from '../components/buttons/submitButton';
import ErrorLabel from '../components/labels/errorLabel';
import CaptchaInput from '../components/inputs/captchaInput';
import LoginForm from '../components/forms/loginForm';
/********************************************/

const CaptchaContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [isCaptchaIncorrect, setIsCaptchaIncorrect] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await apiClient.loginWithPass({
        user_id: username,
        password: password,
        captcha_id: apiClient.lastCaptchaId,
        captcha_answer: captchaAnswer,
        client_rid: apiClient.clientRId,
      })
      
      console.log(`logged in as ${result.user_id} | ${result.full_name}`);
      setIsLoggedIn(true);
      navigate('/dashboard');
      window.location.reload();
    } catch (error: any) {
      let errorCode = error.response?.data?.error.code;
      if (!errorCode) {
        setLoginError('Unknown error occurred. Please try again later.');
        // this might also be a network failure...hence why it's better we don't
        // try to reload the captcha or other things here *automatically*.
        return;
      }

      switch (error.response?.data?.error.code) {
        case APIErrorCode.ErrCodeInvalidCaptcha:
          setLoginError('Invalid CAPTCHA. Please try again.');
          reloadCaptcha();
          setIsCaptchaIncorrect(true);
          break;
        case APIErrorCode.ErrCodeInvalidUsernamePass:
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

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

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
        {loginError && <ErrorLabel>{loginError}</ErrorLabel>}
        <LoginInput
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <LoginInput style={{ justifyContent: 'center' }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <CaptchaContainer style={{ border: isCaptchaIncorrect ? '2px solid red' : 'none' }}>
          <CaptchaImage src={captchaImage} alt="CAPTCHA" />
          <ReloadButton type="button" onClick={reloadCaptcha} />
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
        <SubmitButton type="submit">Log In</SubmitButton>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;