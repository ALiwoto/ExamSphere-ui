import React, { useState } from 'react';
import SubmitButton from '../components/buttons/submitButton';
import DashboardContainer from '../components/containers/dashboardContainer';
import TitleLabel from '../components/labels/titleLabel';
import LineInput from '../components/inputs/lineInput';
import CreateUserForm from '../components/forms/createUserForm';
import CreateUserContainer from '../components/containers/createUserContainer';
import SelectMenu from '../components/menus/selectMenu';
import apiClient from '../apiClient';
import { CreateUserData, UserRole } from '../api';
import { CurrentAppTranslation } from '../translations/appTranslation';
import ErrorLabel from '../components/labels/errorLabel';
import SuccessLabel from '../components/labels/successLabel';

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
                <div>
                    <div>User ID:</div>
                    <LineInput 
                        name="user_id" 
                        value={userInfo.user_id ?? ''}
                        onChange={handleInputChange} 
                        placeholder="User ID" required />
                </div>
                <div>
                    <div>Full Name:</div>
                    <LineInput 
                        name="full_name" 
                        value={userInfo.full_name ?? ''}
                        onChange={handleInputChange} 
                        placeholder="Full Name" required />
                </div>
                <div>
                    <div>Email:</div>
                    <LineInput 
                        name="email" 
                        type="email" 
                        value={userInfo.email ?? ''}
                        onChange={handleInputChange} 
                        placeholder="Email" required />
                </div>
                <div>
                    <div>Password:</div>
                    <LineInput 
                        name="password" 
                        type="password" 
                        value={userInfo.password ?? ''}
                        onChange={handleInputChange} 
                        placeholder="Password" required />
                </div>
                <div>
                    <div>Role:</div>
                    <SelectMenu
                        name="role"
                        value={userInfo.role ?? UserRole.UserRoleStudent}
                        onChange={handleInputChange}
                        options={Object.values(UserRole).filter(role => apiClient.canCreateTargetRole(role))}
                    />
                </div>
                <SubmitButton type="submit">{CurrentAppTranslation.CreateUserButtonText}</SubmitButton>
            </CreateUserForm>
        </CreateUserContainer>
    </DashboardContainer>
  );
};

export default CreateUserPage;