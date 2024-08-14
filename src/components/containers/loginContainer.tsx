import styled from 'styled-components';
import backgroundImage from '../../assets/bg/login_bg1.jpg';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${backgroundImage});
  background-size: cover;
  background-position: center;
`;

export default LoginContainer;