import React, { useEffect } from 'react';
import styled from 'styled-components';
import apiClient from '../apiClient';
import DashboardContainer from '../components/containers/dashboardContainer';

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

const Dashboard: React.FC = () => {
    const fetchUserInfo = async () => {
        try {
            await apiClient.getCurrentUserInfo();
        } catch (error) {
            console.error(`Failed to get user info: ${error}`);
            apiClient.clearTokens();
            window.location.href = '/login';
        }
    };
    
    useEffect(() => {
        fetchUserInfo();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DashboardContainer>
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
        </DashboardContainer>
    )
};

export default Dashboard;