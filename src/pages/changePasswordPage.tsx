import { useState, useEffect, useReducer } from 'react';
import { CircularProgress, Container, Paper, Box, Typography, Avatar, Grid, Button } from '@mui/material';
import apiClient from '../apiClient';
import { ChangePasswordData } from '../api';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import RenderAllFields from '../components/rendering/RenderAllFields';

export var forceUpdateChangePasswordPage = () => { };

interface ChangePasswordNeededData extends ChangePasswordData {
    repeat_password: string;
}

const ChangePasswordPage = () => {
    const [changePassData, setChangePassData] = useState<ChangePasswordNeededData>({
        lang: CurrentAppTranslation.ShortLang,
        user_id: apiClient.getCurrentUserId()!,
        new_password: '',
        repeat_password: '',
    });
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [isUserNotFound, setIsUserNotFound] = useState(false);
    const snackbar = useAppSnackbar();

    forceUpdateChangePasswordPage = () => {
        forceUpdate();
        changePassData.lang = CurrentAppTranslation.ShortLang;
    }

    const fetchUserInfo = async (fromQuery: boolean) => {
        // the user id is passed like /changePassword?userId=123
        let targetUserId: string | null = '';
        if (fromQuery) {
            const urlSearch = new URLSearchParams(window.location.search);
            targetUserId = urlSearch.get('userId');
        } else if (changePassData.user_id) {
            targetUserId = changePassData.user_id;
        }

        const selfId = apiClient.getCurrentUserId()!;

        if (!targetUserId || !apiClient.canChangeOthersPassword()) {
            targetUserId = selfId;
        }

        try {
            if (targetUserId === selfId) {
                const meResult = await apiClient.getCurrentUserInfo();
                setChangePassData({
                    lang: CurrentAppTranslation.ShortLang,
                    user_id: meResult.user_id,
                    new_password: changePassData.new_password,
                    repeat_password: changePassData.repeat_password,
                });
                setIsUserNotFound(false);
                return;
            }

            const result = await apiClient.getUserInfo(targetUserId);
            setChangePassData({
                lang: CurrentAppTranslation.ShortLang,
                user_id: result.user_id,
                new_password: changePassData.new_password,
                repeat_password: changePassData.repeat_password,
            });
            setIsUserNotFound(false);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to get user info (${errCode}): ${errMessage}`);
            setIsUserNotFound(true);
            return;
        }
    };

    useEffect(() => {
        fetchUserInfo(true);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    const handleChange = (e: any) => {
        setChangePassData({ ...changePassData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const result = await apiClient.changePassword(changePassData);
            if (result.email_sent) {
                snackbar.success(CurrentAppTranslation.EmailSentForPasswordChangeText);
            } else {
                snackbar.success(CurrentAppTranslation.PasswordChangedSuccessfullyText);
            }
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}) - ${errMessage}`);
            return;
        }
    };

    const getFormFields = () => {
        if (!apiClient.canChangeOthersPassword()) {
            return null;
        }

        return (
            <Grid container spacing={2}>
                {RenderAllFields({
                    data: changePassData,
                    handleInputChange: handleChange,
                    isEditing: true,
                    disablePast: true,
                    noEditFields: ['lang'],
                })}
            </Grid>
        );
    }

    if (!changePassData) {
        // maybe return better stuff here in future?
        return (
            <DashboardContainer>
                <CircularProgress />
            </DashboardContainer>
        );
    }

    if (isUserNotFound) {
        return (
            <DashboardContainer>
                <Typography>{CurrentAppTranslation.UserNotFoundText}</Typography>
            </DashboardContainer>
        );
    }

    if (!apiClient.canChangeOthersPassword()) {
        return (
            <DashboardContainer>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                            <Typography variant="h4">
                                {CurrentAppTranslation.ChangePasswordText}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent={CurrentAppTranslation.justifyContent} mb={4}>
                            <Typography variant='h5'>
                                {CurrentAppTranslation.EmailForPassWilLBeSentText}
                            </Typography>
                        </Box>
                        <Button variant="contained"
                            style={{
                                justifyContent: 'center',
                                margin: '0 auto',
                                display: 'flex',
                            }}
                            onClick={handleSave}>
                            {CurrentAppTranslation.ChangePasswordText}
                        </Button>
                    </Paper>
                </Container>
            </DashboardContainer>
        );
    }

    return (
        <DashboardContainer>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">{CurrentAppTranslation.UserInformationText}</Typography>
                        <Button variant="contained" onClick={handleSave}>
                            {CurrentAppTranslation.ChangePasswordText}
                        </Button>
                    </Box>
                    <Avatar sx={{ width: 100, height: 100, mb: 2 }} />
                    {getFormFields()}
                </Paper>
            </Container>
        </DashboardContainer>
    );
};

export default ChangePasswordPage;