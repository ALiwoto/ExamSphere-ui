import styled from 'styled-components';
import MenuItem from './menuItem';
import MenuButton from './menuButton';

const SideMenuContainer = styled.div<{ open: boolean }>`
  position: fixed;
  top: 0;
  right: ${props => props.open ? '0' : `calc(-1 * min(100%, 340px))`};
  width: 100%;
  max-width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

interface SideMenuProps {
    open: boolean;
    toggleMenu: () => void;

    children?: React.ReactNode;
}

const SideMenu: React.FC<SideMenuProps> = ({...props}) => {
    return (
        <SideMenuContainer open={props?.open ?? false}>
          <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
          <MenuItem label='Profile'>
            <MenuItem label='Edit Profile'></MenuItem>
            <MenuItem label='Change Password'></MenuItem>
          </MenuItem>
          <MenuItem label='Settings'></MenuItem>
          <MenuItem label='Help'></MenuItem>
          <MenuItem label='Logout'></MenuItem>
        </SideMenuContainer>
    );
};

export default SideMenu;
