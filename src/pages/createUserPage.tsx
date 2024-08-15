import React, { ChangeEventHandler, FormEvent, useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import DashboardContainer from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import SelectMenu from '../components/menus/selectMenu';
import apiClient from '../apiClient';
import { CreateUserData, UserRole } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import ErrorLabel from '../components/labels/errorLabel';
import SuccessLabel from '../components/labels/successLabel';
import { TextField } from '@mui/material';

const CreateUserPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<CreateUserData>({
    user_id: '',
    email: '',
    password: '',
    role: UserRole.UserRoleStudent,
  });
  const [errText, setErrText] = useState<string>('');
  const [successText, setSuccessText] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setSuccessText('');
    setErrText('');
  };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessText('');
        setErrText('');

        try {
            await apiClient.createNewUser(userInfo);
            setSuccessText('User created successfully');
        } catch (error: any) {
            setErrText('Failed to create user: ' + error?.response?.data?.error?.message ?? 'Unknown error');
        }
    };

  return (
    <DashboardContainer>
        <CreateUserContainer>
            <CreateUserForm onSubmit={handleSubmit}>
                <TitleLabel>Create New User</TitleLabel>
                { errText && <ErrorLabel>{errText}</ErrorLabel> }
                { successText && <SuccessLabel>{successText}</SuccessLabel> }
                <TextField 
                    style={{
                        width: '100%',
                        marginBottom: '1rem',
                    }}
                    name="user_id" 
                    variant='standard'
                    label='User ID'
                    value={userInfo.user_id ?? ''} 
                    onChange={(e) => {handleInputChange(e as any)}}
                    required />
                <TextField
                    style={{
                        width: '100%',
                        marginBottom: '1rem'
                    }}
                    name="full_name"
                    variant='standard'
                    label='Full Name'
                    value={userInfo.full_name ?? ''}
                    onChange={(e) => {handleInputChange(e as any)}}
                    required />
                <TextField
                    style={{
                        width: '100%',
                        marginBottom: '1rem'
                    }}
                    name="email"
                    variant='standard'
                    type="email" 
                    label="Email"
                    value={userInfo.email ?? ''}
                    onChange={(e) => {handleInputChange(e as any)}}
                    required />
                <TextField
                    style={{
                        width: '100%',
                        marginBottom: '1rem'
                    }}
                    name="password"
                    variant='standard'
                    type="password"
                    label="Password"
                    value={userInfo.password ?? ''}
                    onChange={(e) => {handleInputChange(e as any)}}
                    required />
                    <SelectMenu
                        labelText='Role'
                        labelId='role-select-label'
                        name="role"
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