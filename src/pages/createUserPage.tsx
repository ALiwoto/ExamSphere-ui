import React, { useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import DashboardContainer from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import SelectMenu from '../components/menus/selectMenu';
import apiClient from '../apiClient';
import { CreateUserData, UserRole } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import { TextField } from '@mui/material';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';

const CreateUserPage: React.FC = () => {
    const [userInfo, setUserInfo] = useState<CreateUserData>({
        user_id: '',
        email: '',
        password: '',
        role: UserRole.UserRoleStudent,
    });
    const snackbar = useAppSnackbar();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiClient.createNewUser(userInfo);
            snackbar.success(CurrentAppTranslation.UserCreatedSuccessfullyText);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to create new user (${errCode}): ${errMessage}`);
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
                        name="user_id"
                        variant='standard'
                        label={CurrentAppTranslation.user_id}
                        value={userInfo.user_id ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required />
                    <TextField
                        style={{
                            width: '100%',
                            marginBottom: '1rem'
                        }}
                        name="full_name"
                        variant='standard'
                        label={CurrentAppTranslation.full_name}
                        value={userInfo.full_name ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required />
                    <TextField
                        style={{
                            width: '100%',
                            marginBottom: '1rem'
                        }}
                        name="email"
                        variant='standard'
                        type="email"
                        label={CurrentAppTranslation.email}
                        value={userInfo.email ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required />
                    <TextField
                        style={{
                            width: '100%',
                            marginBottom: '1rem'
                        }}
                        name="password"
                        variant='standard'
                        type="password"
                        label={CurrentAppTranslation.password}
                        value={userInfo.password ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required />
                    <SelectMenu
                        labelText='Role'
                        labelId='role-select-label'
                        name={CurrentAppTranslation.role}
                        value={userInfo.role ?? UserRole.UserRoleStudent}
                        onChange={handleInputChange}
                        options={Object.values(UserRole).filter(role => apiClient.canCreateTargetRole(role))}
                    />
                    <SubmitButton type="submit">{CurrentAppTranslation.CreateUserButtonText}</SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateUserPage;