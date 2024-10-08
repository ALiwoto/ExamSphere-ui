import React, { useEffect, useReducer, useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import apiClient from '../apiClient';
import { CreateCourseData } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import RenderAllFields from '../components/rendering/RenderAllFields';
import { autoSetWindowTitle, getFieldOf } from '../utils/commonUtils';

export var forceUpdateCreateCoursePage = () => {};

const CreateCoursePage: React.FC = () => {
    const [createCourseData, setCourseData] = useState<CreateCourseData>({
        topic_id: 0,
        course_name: '',
        course_description: '',
    });
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const snackbar = useAppSnackbar();

    forceUpdateCreateCoursePage = () => {
        forceUpdate();
    };

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
        autoSetWindowTitle();
    } , []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DashboardContainer>
            <CreateUserContainer key={'create-course-page-create-container'}>
                <CreateUserForm onSubmit={handleSubmit}>
                    <TitleLabel>
                        {CurrentAppTranslation.CreateNewCourseText}
                    </TitleLabel>
                    {RenderAllFields({
                        data: createCourseData, 
                        handleInputChange :handleInputChange,
                        disablePast: false,
                        isEditing: true
                    })}
                    <SubmitButton type="submit">{CurrentAppTranslation.CreateCourseButtonText}</SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateCoursePage;