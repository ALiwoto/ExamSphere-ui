import styled from 'styled-components';
import MenuItem from './menuItem';
import MenuButton from './menuButton';
import apiClient from '../../apiClient';
import { CurrentAppTranslation } from '../../translations/appTranslation';

const SideMenuContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: ${props => props.$isOpen ? '0' : `calc(-1 * min(100%, 300px))`};
  width: 100%;
  max-width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  transition: right 0.5s ease-in-out;
  display: flex;
  flex-direction: column;
  padding: 20px;
  z-index: 1000;
`;

interface SideMenuProps {
    isOpen: boolean;
    toggleMenu: () => void;

    children?: React.ReactNode;
}

const SideMenu: React.FC<SideMenuProps> = ({...props}) => {
    if (apiClient.isOwner()) {
        return (
            <SideMenuContainer $isOpen={props?.isOpen ?? false}>
              <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
              <MenuItem label={CurrentAppTranslation.ProfileText}>
                <MenuItem label={CurrentAppTranslation.EditProfileText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.ChangePasswordText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.ManageUsersText}>
                <MenuItem 
                    label={CurrentAppTranslation.AddUserText}
                    href='/createUser'
                >
                </MenuItem>
                <MenuItem label={CurrentAppTranslation.EditUserInfoText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.ChangeUserPasswordText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.ManageExamsText}>
                <MenuItem label={CurrentAppTranslation.AddExamText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.EditExamText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.SettingsText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.HelpText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.LogoutText}
                onClick={() => {
                    apiClient.logout();
                    window.location.href = '/';
                }}
              ></MenuItem>
            </SideMenuContainer>
        );
    }

    if (apiClient.isAdmin()) {
        return (
            <SideMenuContainer $isOpen={props?.isOpen ?? false}>
              <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
              <MenuItem label={CurrentAppTranslation.ProfileText}>
                <MenuItem label={CurrentAppTranslation.EditProfileText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.ChangePasswordText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.ManageUsersText}>
                <MenuItem 
                    label={CurrentAppTranslation.AddUserText}
                    href='/createUser'
                >
                </MenuItem>
                <MenuItem label={CurrentAppTranslation.EditUserInfoText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.ChangeUserPasswordText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.ManageExamsText}>
                <MenuItem label={CurrentAppTranslation.AddExamText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.EditExamText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.SettingsText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.HelpText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.LogoutText}
                onClick={() => {
                    apiClient.logout();
                    window.location.href = '/';
                }}
              ></MenuItem>
            </SideMenuContainer>
        );
    }

    if (apiClient.isTeacher()) {
        return (
            <SideMenuContainer $isOpen={props?.isOpen ?? false}>
              <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
              <MenuItem label={CurrentAppTranslation.ProfileText}>
                <MenuItem label={CurrentAppTranslation.EditProfileText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.ChangePasswordText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.ManageUsersText}>
                <MenuItem 
                    label={CurrentAppTranslation.AddUserText}
                    href='/createUser'
                >
                </MenuItem>
                <MenuItem label={CurrentAppTranslation.EditUserInfoText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.ChangeUserPasswordText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.ManageExamsText}>
                <MenuItem label={CurrentAppTranslation.AddExamText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.EditExamText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.SettingsText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.HelpText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.LogoutText}
                onClick={() => {
                    apiClient.logout();
                    window.location.href = '/';
                }}
              ></MenuItem>
            </SideMenuContainer>
        );
    }
    
    if (apiClient.isStudent()) {
        return (
            <SideMenuContainer $isOpen={props?.isOpen ?? false}>
              <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
              <MenuItem label={CurrentAppTranslation.ProfileText}>
                <MenuItem label={CurrentAppTranslation.EditProfileText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.ChangePasswordText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.ManageExamsText}>
                <MenuItem label={CurrentAppTranslation.AddExamText}></MenuItem>
                <MenuItem label={CurrentAppTranslation.EditExamText}></MenuItem>
              </MenuItem>
              <MenuItem label={CurrentAppTranslation.SettingsText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.HelpText}></MenuItem>
              <MenuItem label={CurrentAppTranslation.LogoutText}
                onClick={() => {
                    apiClient.logout();
                    window.location.href = '/';
                }}
              ></MenuItem>
            </SideMenuContainer>
        );
    }

    return (
        <SideMenuContainer $isOpen={props?.isOpen ?? false}>
          <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
        </SideMenuContainer>
    );
};

export default SideMenu;
