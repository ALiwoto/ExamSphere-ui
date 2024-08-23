import React, { useEffect, useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import DashboardContainer from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import apiClient from '../apiClient';
import { CreateCourseData } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import RenderAllFields from '../components/rendering/RenderAllFields';
import { getFieldOf } from '../utils/commonUtils';


const CreateCoursePage: React.FC = () => {
    const [createCourseData, setCourseData] = useState<CreateCourseData>({
        topic_id: 0,
        course_name: '',
        course_description: '',
    });
    const snackbar = useAppSnackbar();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCourseData({
            ...createCourseData, 

            // prefer e.target.realValue if it exists (dynamically)
            [e.target.name]: getFieldOf(e.target, 'realValue') ?? e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiClient.createCourse(createCourseData);
            snackbar.success(CurrentAppTranslation.CourseCreatedSuccessfullyText);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}): ${errMessage}`);
        }
    };

    useEffect(() => {
        if (window.location.pathname === '/createCourse') {
            document.title = CurrentAppTranslation.CreateCourseText;
        }
    } , []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DashboardContainer>
            <CreateUserContainer key={'create-course-page-create-container'}>
                <CreateUserForm onSubmit={handleSubmit}>
                    <TitleLabel>{CurrentAppTranslation.CreateNewCourseText}</TitleLabel>
                    {RenderAllFields(createCourseData, handleInputChange)}
                    <SubmitButton type="submit">{CurrentAppTranslation.CreateCourseButtonText}</SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateCoursePage;