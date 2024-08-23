import React, { useEffect, useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import DashboardContainer from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import apiClient from '../apiClient';
import { CreateExamData } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import RenderAllFields from '../components/rendering/RenderAllFields';
import ModernDateTimePicker from '../components/date/ModernDatePicker';


const CreateExamPage: React.FC = () => {
    const [createExamData, setCreateExamData] = useState<CreateExamData>({
        exam_title: '',
        exam_description: '',
        price: '0',
        course_id: 0,
        duration: 60,
        exam_date: 0,
        is_public: false,
    });
    const snackbar = useAppSnackbar();

    useEffect(() => {
        if (window.location.pathname === '/createExam') {
            document.title = CurrentAppTranslation.CreateExamText;
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setCreateExamData({
            ...createExamData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiClient.createExam(createExamData);
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
                    <TitleLabel>{CurrentAppTranslation.CreateNewExamText}</TitleLabel>
                    {RenderAllFields(createExamData, handleInputChange)}
                    <ModernDateTimePicker />
                    <SubmitButton type="submit">{CurrentAppTranslation.CreateCourseButtonText}</SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateExamPage;