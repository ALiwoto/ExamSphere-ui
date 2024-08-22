import React, { useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import DashboardContainer from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import apiClient from '../apiClient';
import { CreateNewTopicData } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import { TextField } from '@mui/material';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';

const CreateTopicPage: React.FC = () => {
    const [createTopicData, setUserInfo] = useState<CreateNewTopicData>({
        topic_name: '',
    });
    const snackbar = useAppSnackbar();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserInfo({ ...createTopicData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiClient.createNewTopic(createTopicData);
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
                    <TitleLabel>{CurrentAppTranslation.CreateNewUserText}</TitleLabel>
                    <TextField
                        style={{
                            width: '100%',
                            marginBottom: '1rem',
                        }}
                        name="topic_name"
                        variant='standard'
                        label={CurrentAppTranslation.topic_name}
                        value={createTopicData.topic_name ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required />
                    <SubmitButton type="submit">{CurrentAppTranslation.CreateUserButtonText}</SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateTopicPage;