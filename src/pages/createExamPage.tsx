import React, { useState } from 'react';
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


const CreateExamPage: React.FC = () => {
    const [createCourseData, setCourseData] = useState<CreateCourseData>({
        course_name: '',
        course_description: '',
    });
    const snackbar = useAppSnackbar();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCourseData({ ...createCourseData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiClient.createCourse(createCourseData);
            snackbar.success(CurrentAppTranslation.TopicCreatedSuccessfullyText);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}): ${errMessage}`);
        }
    };

    return (
        <DashboardContainer>
            <CreateUserContainer>
                <CreateUserForm onSubmit={handleSubmit}>
                    <TitleLabel>{CurrentAppTranslation.CreateNewTopicText}</TitleLabel>
                    {RenderAllFields(createCourseData, handleInputChange)}
                    <SubmitButton type="submit">{CurrentAppTranslation.CreateCourseButtonText}</SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateExamPage;