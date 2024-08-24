import React from 'react';
import { Box } from '@mui/material';
import AppFooter from './components/footers/AppFooter';
import { SupportedTranslations, switchAppTranslation } from './translations/translationSwitcher';
import apiClient from './apiClient';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAppLanguage, setCurrentAppLanguage] = React.useState<string>('en');

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '110vh', // Ensure the layout takes at least the full viewport height
            }}
        >
            <Box sx={{ flexGrow: 1 }} key={`ExamSphere-app-${currentAppLanguage}-box`}>
                {children}
            </Box>
            <AppFooter setAppLanguage={async (lang) => {
                console.log(`Switching from ${currentAppLanguage} to ${lang}`);
                // doing this, so react re-renders the app with the new language
                setCurrentAppLanguage(lang);
                const userLang = lang as SupportedTranslations;
                switchAppTranslation(userLang);
                await apiClient.setAppLanguage(userLang);
            }} />
        </Box>
    );
};

export default AppLayout;