import { useEffect, useReducer, useState } from 'react';
import { CircularProgress, Container, Paper, Box, Typography, Grid, TextField, Button } from '@mui/material';
import apiClient from '../apiClient';
import { ConfirmAccountData } from '../api';
import {DashboardContainer} from '../components/containers/dashboardContainer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import { getTextInputTypeFromFieldName } from '../utils/textUtils';
import { autoSetWindowTitle } from '../utils/commonUtils';

interface ConfirmationRequiredFields {
    user_id: string;
    new_password: string;
    repeat_password: string;
}

export var forceUpdateConfirmAccountRedirectPage = () => {};

const ConfirmAccountRedirectPage = () => {
    apiClient.clearTokens();
    const urlSearch = new URLSearchParams(window.location.search);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    forceUpdateConfirmAccountRedirectPage = () => forceUpdate();

    const [requiredData, setRequiredData] = useState<ConfirmationRequiredFields>({
        user_id: '',
        new_password: '',
        repeat_password: '',
    });
    const [confirmData, setConfirmData] = useState<ConfirmAccountData>({
        user_id: '',
        confirm_token: urlSearch.get('confirmToken') ?? '',
        rl_token: urlSearch.get('rlToken') ?? '',
        lt_token: urlSearch.get('lt') ?? '',
        raw_password: '',
    });
    const [isConfirmed, setIsConfirmed] = useState(false);

    const snackbar = useAppSnackbar();

    useEffect(() => {
        autoSetWindowTitle();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleChange = (e: any) => {
        setRequiredData({ ...requiredData, [e.target.name]: e.target.value });
        setConfirmData({
            ...confirmData,
            [e.target.name]: e.target.value,
        });
    };

    const handleConfirm = async () => {
        try {
            confirmData.raw_password = requiredData.new_password;
            const result = await apiClient.confirmAccount(confirmData);
            if (!result) {
                snackbar.error(CurrentAppTranslation.FailedToConfirmAccountCreationText);
                return;
            }

            setIsConfirmed(true);
            // Redirect the user to /login page in 3 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}): ${errMessage}`);
            return;
        }

    };

    if (confirmData.confirm_token === '' ||
        confirmData.rl_token === '' ||
        confirmData.lt_token === '') {
        window.location.href = '/login';
        return (
            <CircularProgress />
        );
    }

    return (
        <DashboardContainer disableSlideMenu={true}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 3, mt: 6 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">{CurrentAppTranslation.ConfirmYourAccountText}</Typography>
                    </Box>
                    <Grid container spacing={2}>
                        {Object.keys(requiredData).map((field) => (
                            <Grid item xs={12} key={field}>
                                {!isConfirmed && (
                                    <TextField
                                        fullWidth
                                        type={getTextInputTypeFromFieldName(field)}
                                        name={field}
                                        label={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                                        value={requiredData[field as keyof (typeof requiredData)]}
                                        onChange={handleChange}
                                    />
                                )}
                            </Grid>
                        ))}
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
                            <Button variant="contained" onClick={handleConfirm} style={
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

export default ConfirmAccountRedirectPage;