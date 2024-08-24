import { useEffect, useReducer, useState } from 'react';
import { Container, Paper, Box, Typography, Grid, Button } from '@mui/material';
import apiClient from '../apiClient';
import { ConfirmChangePasswordData } from '../api';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import { autoSetWindowTitle, hexDecode } from '../utils/commonUtils';
import { sha256 } from 'js-sha256';
import RenderAllFields from '../components/rendering/RenderAllFields';

interface PasswordChangeRequiredFields {
    new_password: string;
    repeat_password: string;
}

export var forceUpdateConfirmAccountRedirectPage = () => { };

const PassChangeRedirectPage = () => {
    apiClient.clearTokens();
    const urlSearch = new URLSearchParams(window.location.search);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    forceUpdateConfirmAccountRedirectPage = () => forceUpdate();

    const [requiredData, setRequiredData] = useState<PasswordChangeRequiredFields>({
        new_password: '',
        repeat_password: '',
    });
    const [confirmData, setConfirmData] = useState<ConfirmChangePasswordData>({
        rq_id: urlSearch.get('rq') ?? '',
        rt_param: urlSearch.get('rt') ?? '',
        rt_hash: sha256(urlSearch.get('rt') ?? ''),
        rt_verifier: sha256(`LT:${parseInt(hexDecode(urlSearch.get('lt') ?? ''), 16)}`),
    });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const snackbar = useAppSnackbar();

    useEffect(() => {
        autoSetWindowTitle();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (urlSearch.get('rq') === null ||
        urlSearch.get('rt') === null ||
        urlSearch.get('lt') === null) {
        window.location.href = '/login';
        return null;
    }


    const handleChange = (e: any) => {
        setRequiredData({ ...requiredData, [e.target.name]: e.target.value });
        setConfirmData({
            ...confirmData,
            new_password: requiredData.new_password,
        });
    };

    const handleConfirm = async () => {
        setIsButtonClicked(true);

        try {
            confirmData.new_password = requiredData.new_password;
            const result = await apiClient.confirmChangePassword(confirmData);
            if (!result) {
                snackbar.error(CurrentAppTranslation.FailedToConfirmAccountCreationText);
                setIsButtonClicked(false);
                return;
            }

            setIsConfirmed(true);
            // Redirect the user to /login page in 2 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}): ${errMessage}`);
            setIsButtonClicked(false);
            return;
        }
    };

    return (
        <DashboardContainer disableSlideMenu={true}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 3, mt: 6 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">
                            {CurrentAppTranslation.ConfirmChangingYourPasswordText}
                        </Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {!isConfirmed && RenderAllFields(
                            {
                                data: requiredData,
                                handleInputChange: handleChange,
                                isEditing: true,
                                disablePast: true,
                            }
                        )}
                        {isConfirmed && (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <CheckCircleIcon color="success" sx={{ fontSize: 30 }} />
                                <Typography variant="body2" sx={{ color: 'green' }}>
                                    {CurrentAppTranslation.ConfirmationSuccessText}
                                </Typography>
                            </Grid>
                        )}
                        {(requiredData.new_password !== requiredData.repeat_password) ? (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Typography variant="body2" sx={{ color: 'red' }}>
                                    {CurrentAppTranslation.PasswordsDoNotMatchText}
                                </Typography>
                            </Grid>
                        ) : null}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button variant="contained" onClick={handleConfirm}
                                disabled={
                                    isButtonClicked || isConfirmed ||
                                    requiredData.new_password !== requiredData.repeat_password}
                                style={
                                    {
                                        display: isConfirmed ? 'none' : 'block',
                                        backgroundColor: requiredData.new_password === requiredData.repeat_password ? 'green' : 'red',
                                    }
                                }>
                                {CurrentAppTranslation.ConfirmText}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </DashboardContainer>
    );
};

export default PassChangeRedirectPage;