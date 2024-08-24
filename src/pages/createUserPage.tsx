import React, { useReducer, useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import SelectMenu from '../components/menus/selectMenu';
import apiClient from '../apiClient';
import { CreateUserData, UserRole } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import { Checkbox, FormControlLabel, TextField } from '@mui/material';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';

export var forceUpdateCreateUserPage = () => {};

const CreateUserPage: React.FC = () => {
    const [createUserData, setUserInfo] = useState<CreateUserData>({
        user_id: '',
        email: '',
        password: '',
        role: UserRole.UserRoleStudent,
    });
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const snackbar = useAppSnackbar();

    forceUpdateCreateUserPage = () => {
        forceUpdate();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setUserInfo({ ...createUserData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await apiClient.createNewUser(createUserData);
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
                        value={createUserData.user_id ?? ''}
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
                        value={createUserData.full_name ?? ''}
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
                        value={createUserData.email ?? ''}
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
                        value={createUserData.password ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required />
                    <TextField
                        style={{
                            width: '100%',
                            marginBottom: '1rem'
                        }}
                        name="phone_number"
                        variant='standard'
                        type="tel"
                        label={CurrentAppTranslation.phone_number}
                        value={createUserData.phone_number ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required={false} />
                    <TextField
                        style={{
                            width: '100%',
                            marginBottom: '1rem'
                        }}
                        name="user_address"
                        variant='standard'
                        type='text'
                        label={CurrentAppTranslation.user_address}
                        value={createUserData.user_address ?? ''}
                        onChange={(e) => { handleInputChange(e as any) }}
                        required={false} />
                    <SelectMenu
                        labelText={CurrentAppTranslation.role}
                        labelId='role-select-label'
                        name='role'
                        value={createUserData.role ?? UserRole.UserRoleStudent}
                        onChange={handleInputChange}
                        options={Object.values(UserRole).filter(role => apiClient.canCreateTargetRole(role))}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={createUserData.setup_completed ?? true}
                            onChange={(e) => setUserInfo({ ...createUserData, setup_completed: e.target.checked })}
                            color="primary"
                            />
                        }
                        label={CurrentAppTranslation.SendEmailToUseText}
                    />
                    <SubmitButton type="submit">{CurrentAppTranslation.CreateUserButtonText}</SubmitButton>
                </CreateUserForm>
            </CreateUserContainer>
        </DashboardContainer>
    );
};

export default CreateUserPage;