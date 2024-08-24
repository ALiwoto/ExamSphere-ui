import { useState, useEffect, useReducer } from 'react';
import { CircularProgress, Container, Paper, Box, Typography, Grid, TextField, Button } from '@mui/material';
import apiClient from '../apiClient';
import { EditCourseData } from '../api';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';

export var forceUpdateCourseInfoPage = () => {};

const CourseInfoPage = () => {
    const [courseData, setCourseData] = useState<EditCourseData>({
        course_id: 0,
        topic_id: 0,
        course_name: '',
        course_description: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isCourseNotFound, setIsCourseNotFound] = useState(false);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const snackbar = useAppSnackbar();

    forceUpdateCourseInfoPage = () => {
        forceUpdate();
    };

    const fetchCourseInfo = async () => {
        // the user id is passed like /courseInfo?userId=123
        const urlSearch = new URLSearchParams(window.location.search);
        const targetCourseId = parseInt(urlSearch.get('courseId') ?? '');
        if (!targetCourseId || isNaN(targetCourseId)) {
            window.location.href = '/searchCourse';
            return;
        }

        try {
            const result = await apiClient.getCourseInfo(targetCourseId);
            setCourseData({
                course_id: result.course_id,
                topic_id: result.topic_id,
                course_name: result.course_name,
                course_description: result.course_description,
            });
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}): ${errMessage}`);
            setIsCourseNotFound(true);
            return;
        }
    };

    useEffect(() => {
        fetchCourseInfo();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleEdit = () => setIsEditing(!isEditing);

    const handleChange = (e: any) => {
        setCourseData({ ...courseData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const result = await apiClient.editCourse(courseData);
            const updatedCourseData = { ...courseData };
            Object.keys(result).forEach(key => {
                if (key in courseData) {
                    updatedCourseData[key as keyof (typeof updatedCourseData)] = result[key as keyof (typeof result)] as any;
                }
            });

            setCourseData(updatedCourseData);
            setIsEditing(false);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}) - ${errMessage}`);
            return;
        }
    };

    if (!courseData) {
        // maybe return better stuff here in future?
        return (
            <DashboardContainer>
                <CircularProgress />
            </DashboardContainer>
        );
    }

    if (isCourseNotFound) {
        return (
            <DashboardContainer>
                <Typography>{CurrentAppTranslation.CourseNotFoundText}</Typography>
            </DashboardContainer>
        );
    }

    return (
        <DashboardContainer>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h4">{CurrentAppTranslation.CourseInformationText}</Typography>
                        <Button variant="contained" onClick={isEditing ? handleSave : handleEdit}>
                            {isEditing ? CurrentAppTranslation.SaveText : CurrentAppTranslation.EditText}
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        {Object.keys(courseData).map((field) => (
                            <Grid item xs={12} key={field}>
                                {isEditing && apiClient.canUserFieldBeEdited(field) ? (
                                    <TextField
                                        fullWidth
                                        name={field}
                                        label={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                                        value={courseData[field as keyof (typeof courseData)]}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <Typography>
                                        <strong>
                                            {CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}:
                                        </strong> {courseData[field as keyof (typeof courseData)]}
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

export default CourseInfoPage;