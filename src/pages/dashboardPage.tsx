import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { UserHandlersMeResult } from '../api';
import apiClient from '../apiClient';
import SideMenu from '../components/menus/sideMenu';



const DashboardContainer = styled.div`
  position: relative; 
  overflow-x: hidden;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
`;

// const SideMenu = styled.div<{ isOpen: boolean, inTransition: boolean }>`
//   position: fixed;
//   top: 0;
//   right: ${props => props.isOpen ? '0' : '-300px'};
//   visibility: ${props => (props.isOpen || props.inTransition) ? 'visible' : 'hidden'};
//   width: 300px;
//   height: 100%;
//   background-color: white;
//   box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
//   transition: right 0.3s ease-in-out;
//   display: flex;
//   flex-direction: column;
//   padding: 20px;
// `;



const Menu = styled.div`
  position: absolute;
  right: 20px;
  top: 60px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
`;


const MenuItem = styled.div`
  padding: 10px 0;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const MainContent = styled.div`
  display: flex;
  gap: 20px;
  padding: 20px;
`;


const Section = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
`;


const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const ListItem = styled.li`
  margin-bottom: 5px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
`;

const Dashboard: React.FC = () => {
    const [isSideMenuOpen, setSsSideMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const ref = React.useRef();

    const fetchUserInfo = async () => {
        try {
            const myInfo = await apiClient.getCurrentUserInfo();
            setUserInfo(myInfo);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const toggleMenu = () => setSsSideMenuOpen(!isSideMenuOpen);

    return (
      <DashboardContainer>
        <Header>
          <Title>Exam Platform Dashboard</Title>
          <MenuButton onClick={toggleMenu}>☰</MenuButton>
        </Header>
        <SideMenu open={isSideMenuOpen}
            toggleMenu={toggleMenu}
          >
        </SideMenu>
        <MainContent>
          <Section>
            <SectionTitle>Courses</SectionTitle>
            <List>
              <ListItem>Mathematics</ListItem>
              <ListItem>Physics</ListItem>
              <ListItem>Chemistry</ListItem>
            </List>
          </Section>
          <Section>
            <SectionTitle>Exams</SectionTitle>
            <List>
              <ListItem>Midterm Exam</ListItem>
              <ListItem>Final Exam</ListItem>
              <ListItem>Pop Quiz</ListItem>
            </List>
          </Section>
          <Section>
            <SectionTitle>Topics</SectionTitle>
            <List>
              <ListItem>Ongoing Exams</ListItem>
              <ListItem>Participated Exams</ListItem>
            </List>
          </Section>
        </MainContent>
        {((userInfo as UserHandlersMeResult).role === 'teacher' || (userInfo as UserHandlersMeResult).role === 'admin') && (
          <div>
            <Button>New Exam</Button>
            <Button>New Course</Button>
          </div>
        )}
      </DashboardContainer>
    )
};

export default Dashboard;