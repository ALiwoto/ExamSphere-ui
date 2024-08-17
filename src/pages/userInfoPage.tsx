import { useState, useEffect } from 'react';
import { CircularProgress, Container, Paper, Box, Typography, Avatar, Grid, TextField, Button } from '@mui/material';
import apiClient from '../apiClient';
import { EditUserData } from '../api';
import DashboardContainer from '../components/containers/dashboardContainer';
import { CurrentAppTranslation } from '../translations/appTranslation';

const UserInfoPage = () => {
    const [userData, setUserData] = useState<EditUserData>({
        user_id: '',
        full_name: '',
        email: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isUserNotFound, setIsUserNotFound] = useState(false);
    const [serverError, setServerError] = useState('');

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        // the user id is passed like /userInfo?userId=123
        const targetUserId = new URLSearchParams(window.location.search).get('userId');
        if (!targetUserId) {
            window.location.href = '/searchUser';
            return;
        }

        try {
            const result = await apiClient.getUserInfo(targetUserId);
            setUserData({
                user_id: result.user_id,
                full_name: result.full_name,
                email: result.email,
            });
        } catch (error: any) {
            setServerError('Failed to get user information');
            return;
        }
    };

    const handleEdit = () => setIsEditing(!isEditing);

    const handleChange = (e: any) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const result = await apiClient.editUser(userData);
            const updatedUserData = { ...userData };
            Object.keys(result).forEach(key => {
                if (key in userData) {
                    updatedUserData[key as keyof (typeof updatedUserData)] = result[key as keyof (typeof result)];
                }
            });

            setUserData(updatedUserData);
        } catch (error: any) {
            const errCode = error.response?.data?.error?.code;
            const errMessage = error.response?.data?.error?.message;
            setServerError(`Failed (${errCode}) - ${errMessage}`);
            return;
        }

    };

    if (!userData) {
        // maybe return better stuff here in future?
        return <CircularProgress />;
    }

    return (
        <DashboardContainer>
            {serverError && <Typography color="error">{serverError}</Typography>}
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">{CurrentAppTranslation.UserInformationText}</Typography>
                        <Button variant="contained" onClick={isEditing ? handleSave : handleEdit}>
                            {isEditing ? CurrentAppTranslation.SaveText : CurrentAppTranslation.EditText}
                        </Button>
                    </Box>
                    <Avatar sx={{ width: 100, height: 100, mb: 2 }} />
                    <Grid container spacing={2}>
                        {Object.keys(userData).map((field) => (
                            <Grid item xs={12} key={field}>
                                {isEditing && apiClient.canUserFieldBeEdited(field) ? (
                                    <TextField
                                        fullWidth
                                        name={field}
                                        label={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                                        value={userData[field as keyof (typeof userData)]}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography>
                                        <strong>
                                            {CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}:
                                        </strong> {userData[field as keyof (typeof userData)]}
                                    </Typography>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </DashboardContainer>
    );
};

export default UserInfoPage;