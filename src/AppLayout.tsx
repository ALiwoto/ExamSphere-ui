import React from 'react';
import { Box } from '@mui/material';
import AppFooter from './components/footers/AppFooter';
import { SupportedTranslations, switchAppTranslation } from './translations/translationSwitcher';
import apiClient from './apiClient';
import { CurrentAppTranslation } from './translations/appTranslation';
import { forceUpdateDashboardContainer } from './components/containers/dashboardContainer';
import { forceUpdateConfirmAccountRedirectPage } from './pages/confirmAccountRedirectPage';
import { forceUpdateCourseInfoPage } from './pages/courseInfoPage';
import { forceUpdateCreateCoursePage } from './pages/createCoursePage';
import { forceUpdateCreateExamPage } from './pages/createExamPage';
import { forceUpdateCreateTopicPage } from './pages/createTopicPage';
import { forceUpdateCreateUserPage } from './pages/createUserPage';
import { forceUpdateDashboardPage } from './pages/dashboardPage';
import { forceUpdateExamInfoPage } from './pages/examInfoPage';
import { forceUpdateLoginPage } from './pages/loginPage';
import { forceUpdateSearchCoursePage } from './pages/searchCoursePage';
import { forceUpdateSearchTopicPage } from './pages/searchTopicPage';
import { forceUpdateSearchUserPage } from './pages/searchUserPage';
import { forceUpdateUserInfoPage } from './pages/userInfoPage';

/**
 * This function forces a re-render of all the pages in the app.
 * This is useful when the app language is changed.
 * (I wish there was a better way to do this but I couldn't find one 😭)
 */
const forceUpdateWholePage = () => {
    try {
        forceUpdateDashboardContainer();
        forceUpdateConfirmAccountRedirectPage();
        forceUpdateCourseInfoPage();
        forceUpdateCreateCoursePage();
        forceUpdateCreateExamPage();
        forceUpdateCreateTopicPage();
        forceUpdateCreateUserPage();
        forceUpdateDashboardPage();
        forceUpdateExamInfoPage();
        forceUpdateLoginPage();
        forceUpdateSearchCoursePage();
        forceUpdateSearchTopicPage();
        forceUpdateSearchUserPage();
        forceUpdateUserInfoPage();
    } catch (error: any) {
        console.log(`forceUpdateWholePage: failed to force update: ${error}`);
    }
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAppLanguage, setCurrentAppLanguage] = React.useState<string>('en');
    const [fontFamily, setFontFamily] = React.useState<string>(`${CurrentAppTranslation.fontFamily}`);
    const [, forceUpdate] = React.useReducer(x => x + 1, 0);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '110vh', // Ensure the layout takes at least the full viewport height
                fontFamily: `${fontFamily}`,
            }}
            fontFamily={
                `${fontFamily}`
            }
        >
            <Box sx={{ flexGrow: 1 }} about={`ExamSphere-app-${currentAppLanguage}-box`}>
                {children}
            </Box>
            <AppFooter setAppLanguage={async (lang) => {
                const userLang = lang as SupportedTranslations;
                console.log(`Switching from ${currentAppLanguage} to ${lang}`);

                // doing this so react re-renders the app with the new language
                setCurrentAppLanguage(lang);
                switchAppTranslation(userLang);
                await apiClient.setAppLanguage(userLang);
                setFontFamily(`${CurrentAppTranslation.fontFamily}`);

                forceUpdate();
                forceUpdateWholePage();
            }} />
        </Box>
    );
};

export default AppLayout;