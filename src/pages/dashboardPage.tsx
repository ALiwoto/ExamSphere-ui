import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import apiClient from '../apiClient';
import SideMenu from '../components/menus/sideMenu';
import { useNavigate } from 'react-router-dom';

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
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        try {
            await apiClient.getCurrentUserInfo();
        } catch (error) {
            console.error(`Failed to get user info: ${error}`);
            apiClient.clearTokens();
            navigate('/login');
            window.location.reload();
        }
    };

    
    useEffect(() => {
        fetchUserInfo();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleMenu = () => setIsSideMenuOpen(!isSideMenuOpen);

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
            {(apiClient.isAdmin() || apiClient.isTeacher()) && (
                <div>
                    <Button>New Exam</Button>
                    <Button>New Course</Button>
                </div>
            )}
        </DashboardContainer>
    )
};

export default Dashboard;