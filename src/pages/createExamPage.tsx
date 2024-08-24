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
import { getUTCUnixTimestamp } from '../utils/timeUtils';
import { autoSetWindowTitle, getFieldOf } from '../utils/commonUtils';


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
        autoSetWindowTitle();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let targetValue: any = e.target.value;
        if (getFieldOf(targetValue, "_d") instanceof Date) {
            targetValue = getFieldOf(targetValue, "_d");
        }

        if (targetValue instanceof Date) {
            // convert to UTC
            targetValue = getUTCUnixTimestamp(targetValue);
        }
        setCreateExamData({
            ...createExamData,
            [e.target.name]: targetValue,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let result = await apiClient.createExam(createExamData);
            snackbar.success(CurrentAppTranslation.ExamCreatedSuccessfullyText);

            // redirect the user to the exam page in 3 seconds
            setTimeout(() => {
                window.location.href = `/examInfo?examId=${result.exam_id}`;
            }, 3000);
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
                    {RenderAllFields({
                        data: createExamData,
                        handleInputChange,
                        isEditing: true,
                    })}
                    <SubmitButton type="submit">
                        {CurrentAppTranslation.CreateCourseButtonText}
                    </SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateExamPage;