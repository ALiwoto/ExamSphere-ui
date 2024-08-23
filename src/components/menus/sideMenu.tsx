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

const RenderProfileMenu = () => {
  return (
    <MenuItem label={CurrentAppTranslation.ProfileText}>
      <MenuItem label={CurrentAppTranslation.EditProfileText}></MenuItem>
      <MenuItem label={CurrentAppTranslation.ChangePasswordText}></MenuItem>
    </MenuItem>
  )
};

const RenderManageUserMenu = () => {
  return (
    <MenuItem label={CurrentAppTranslation.ManageUsersText}>
      <MenuItem
        label={CurrentAppTranslation.AddUserText}
        href='/createUser'
      >
      </MenuItem>
      <MenuItem
        label={CurrentAppTranslation.EditUserInfoText}
        href='/searchUser'
      >
      </MenuItem>
      <MenuItem
        label={CurrentAppTranslation.ChangeUserPasswordText}
        href='/changeUser'
      >
      </MenuItem>
    </MenuItem>
  )
}

const RenderManageTopicsMenu = () => {
  return (
    <MenuItem label={CurrentAppTranslation.ManageTopicsText}>
      <MenuItem 
        label={CurrentAppTranslation.AddTopicText}
        href='/createTopic'
      ></MenuItem>
      <MenuItem 
        label={CurrentAppTranslation.SearchTopicsText}
        href='/searchTopic'
      ></MenuItem>
    </MenuItem>
  )
};

const RenderManageCoursesMenu = () => {
  return (
    <MenuItem label={CurrentAppTranslation.ManageCoursesText}>
      <MenuItem 
        label={CurrentAppTranslation.AddCourseText}
        href='/createCourse'
      ></MenuItem>
      <MenuItem 
        label={CurrentAppTranslation.SearchCoursesText}
        href='/searchCourse'
      ></MenuItem>
      <MenuItem 
        label={CurrentAppTranslation.EditCourseText}
        href='/editCourse'
      ></MenuItem>
    </MenuItem>
  )
};

const RenderManageExamsMenu = () => {
  return (
    <MenuItem label={CurrentAppTranslation.ManageExamsText}>
      <MenuItem label={CurrentAppTranslation.AddExamText}></MenuItem>
      <MenuItem label={CurrentAppTranslation.EditExamText}></MenuItem>
    </MenuItem>
  )
};

const RenderCommonMenus = () => {
  return (
    <>
      <MenuItem label={CurrentAppTranslation.SettingsText}></MenuItem>
      <MenuItem label={CurrentAppTranslation.HelpText}></MenuItem>
      <MenuItem label={CurrentAppTranslation.LogoutText}
        onClick={() => {
          apiClient.logout();
          window.location.href = '/';
        }}
      ></MenuItem>
    </>
  );
};

const SideMenu: React.FC<SideMenuProps> = ({ ...props }) => {
  if (apiClient.isOwner()) {
    return (
      <SideMenuContainer $isOpen={props?.isOpen ?? false}>
        <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
        {RenderProfileMenu()}
        {RenderManageUserMenu()}
        {RenderManageTopicsMenu()}
        {RenderManageCoursesMenu()}
        {RenderManageExamsMenu()}
        {RenderCommonMenus()}
      </SideMenuContainer>
    );
  }

  if (apiClient.isAdmin()) {
    return (
      <SideMenuContainer $isOpen={props?.isOpen ?? false}>
        <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
        {RenderProfileMenu()}
        {RenderManageUserMenu()}
        {RenderManageTopicsMenu()}
        {RenderManageCoursesMenu()}
        {RenderManageExamsMenu()}
        {RenderCommonMenus()}
      </SideMenuContainer>
    );
  }

  if (apiClient.isTeacher()) {
    return (
      <SideMenuContainer $isOpen={props?.isOpen ?? false}>
        <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
        {RenderProfileMenu()}
        {RenderManageUserMenu()}
        {RenderManageCoursesMenu()}
        {RenderManageExamsMenu()}
        {RenderCommonMenus()}
      </SideMenuContainer>
    );
  }

  if (apiClient.isStudent()) {
    return (
      <SideMenuContainer $isOpen={props?.isOpen ?? false}>
        <MenuButton onClick={props?.toggleMenu}>✕</MenuButton>
        {RenderProfileMenu()}
        {RenderManageUserMenu()}
        {RenderManageExamsMenu()}
        {RenderCommonMenus()}
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
