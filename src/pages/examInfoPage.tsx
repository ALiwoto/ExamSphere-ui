import { useState, useEffect, useReducer } from 'react';
import { CircularProgress, Container, Paper, Box, Typography, Grid, Button, Card, CardContent, TextField, Pagination } from '@mui/material';
import apiClient from '../apiClient';
import { EditExamData, GetExamInfoResult, GetExamParticipantsResult } from '../api';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import { CurrentAppTranslation } from '../translations/appTranslation';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import { autoSetWindowTitle, getFieldOf } from '../utils/commonUtils';
import { getDateFromServerTimestamp, getUTCUnixTimestamp } from '../utils/timeUtils';
import RenderAllFields from '../components/rendering/RenderAllFields';

export var forceUpdateExamInfoPage = () => { };

const ParticipantPageLimit = 10;

type ExamInfoResult = GetExamInfoResult | null;
type ExamParticipants = GetExamParticipantsResult | null;

interface DisplayingExamData extends EditExamData {
    has_participated?: boolean;
    has_started?: boolean;
    has_finished?: boolean;
}

interface RenderParticipantsListProps {
    participants: ExamParticipants;
    handleEdit: (userId: string, score: string) => void;
    handleViewAnswers: (userId: string) => void;
    handleSubmit: (userId: string) => void;
    handleCancel: () => void;
    editScore: string;
    setEditScore: (score: string) => void;
    currentScoreEditUserId?: string;
    canSetScore?: boolean;
    canViewAnswers?: boolean;
}

var ExamCountdownId = 0;

const RenderParticipantsList: React.FC<RenderParticipantsListProps> = ({ ...props }) => {
    return (
        <Grid container spacing={3}>
            {props.participants?.participants?.map((participant) => (
                <Grid item xs={12} sm={6} key={participant.user_id}>
                    <Card elevation={2}>
                        <CardContent>
                            <Typography variant="h6">{participant.full_name}</Typography>
                            <Typography color="textSecondary" gutterBottom>
                                {`${CurrentAppTranslation.user_id}: ${participant.user_id}`}
                            </Typography>
                            {props.currentScoreEditUserId === participant.user_id ? (
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        label="Score"
                                        type='text'
                                        value={props.editScore}
                                        onChange={(e) => props.setEditScore(e.target.value)}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <Button variant="outlined" onClick={props.handleCancel}>
                                            {CurrentAppTranslation.CancelButtonText}
                                        </Button>
                                        <Button variant="contained"
                                            onClick={() => props.handleSubmit(participant.user_id!)}>
                                            {CurrentAppTranslation.SubmitText}
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="h5">
                                        {`${CurrentAppTranslation.ScoreText}: ${participant.final_score ?? CurrentAppTranslation.NotSetText}`}
                                    </Typography>
                                    {props.canSetScore && (
                                        <Button variant="contained"
                                        onClick={() => props.handleViewAnswers(participant.user_id!)}>
                                            {CurrentAppTranslation.ViewAnswersText}
                                        </Button>
                                    )}
                                    {props.canViewAnswers && (
                                        <Button variant="contained"
                                            onClick={() => props.handleEdit(participant.user_id!, participant.final_score!)}>
                                            {CurrentAppTranslation.SetScoreText}
                                        </Button>
                                    )}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

const ExamInfoPage = () => {
    const [examData, setExamData] = useState<DisplayingExamData>({
        exam_id: 0,
        course_id: 0,
        exam_title: '',
        exam_description: '',
        price: '0T',
        duration: 60,
        exam_date: 0,
        is_public: false,
    });
    const [examInfo, setExamInfo] = useState<ExamInfoResult>(null);
    const [examParticipants, setExamParticipants] = useState<ExamParticipants>(null);
    const [participantPage, setParticipantPage] = useState(0);
    const [totalPages, setTotalPages] = useState(participantPage + 1);
    const [currentScoreEditUserId, setCurrentScoreEditUserId] = useState<string | null>(null);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [isEditing, setIsEditing] = useState(false);
    const [isExamNotFound, setIsUserNotFound] = useState(false);
    const [editScore, setEditScore] = useState('');
    const snackbar = useAppSnackbar();

    forceUpdateExamInfoPage = () => {
        forceUpdate();
    };

    const fetchExamParticipants = async (newPage: number = 0, forInfo: ExamInfoResult = null) => {
        forInfo = forInfo ?? examInfo;
        if (!forInfo) {
            return;
        }

        try {
            const result = await apiClient.getExamParticipants({
                exam_id: forInfo.exam_id,
                offset: newPage * ParticipantPageLimit,
                limit: ParticipantPageLimit,
            });

            // we need to do setTotalPages dynamically, e.g. if the limit is reached,
            // we should add one more page. if the amount of results returned is less than
            // the limit, we shouldn't increment the total pages.
            const newTotalPages = result.participants!.length < ParticipantPageLimit ? (newPage + 1) : newPage + 2;
            setTotalPages(newTotalPages);

            setExamParticipants(result);
            setParticipantPage(newPage);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to get exam participants (${errCode}): ${errMessage}`);
            return;
        }
    };

    const fetchExamInfo = async () => {
        // the exam id is passed like /examInfo?examId=123
        const urlSearch = new URLSearchParams(window.location.search);
        const targetExamId = parseInt(urlSearch.get('examId') ?? '');
        const isEditingQuery = urlSearch.get('edit');
        if (!targetExamId || isNaN(targetExamId)) {
            window.location.href = '/searchExam';
            return;
        }

        setIsEditing(isEditingQuery === '1' || isEditingQuery === 'true');

        try {
            const result = await apiClient.getExamInfo(targetExamId);
            setExamData({
                exam_id: result.exam_id,
                course_id: result.course_id,
                exam_title: result.exam_title,
                exam_description: result.exam_description,
                price: result.price,
                duration: result.duration,
                exam_date: getUTCUnixTimestamp(getDateFromServerTimestamp(result.exam_date)!),
                is_public: result.is_public,
                has_participated: result.has_participated,
                has_finished: result.has_finished,
                has_started: result.has_started,
            });
            setExamInfo(result);

            if (examInfo?.can_participate && !examInfo.has_started && !examInfo.has_finished) {
                ExamCountdownId = window.setInterval(() => {
                    if (!examInfo.starts_in || examInfo.starts_in < 0) {
                        clearInterval(ExamCountdownId);

                        // automatically redirect the user to the exam hall
                        setTimeout(() => {
                            window.location.href = `/examHall?examId=${targetExamId}`;
                        }, 5000);
                    }

                    setExamInfo({
                        ...examInfo,
                        starts_in: examInfo.starts_in! - 1,
                    });
                }, 60000);
            }

            await fetchExamParticipants(0, result);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to get exam info (${errCode}): ${errMessage}`);
            setIsUserNotFound(true);
            return;
        }
    };

    useEffect(() => {
        fetchExamInfo();

        autoSetWindowTitle();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleEdit = () => {
        window.history.pushState(
            `examInfo_examId_${examData.exam_id}`,
            "Exam Info",
            `${window.location.pathname}?examId=${encodeURIComponent(examData.exam_id!)
            }&edit=${isEditing ? '0' : '1'
            }`,
        );
        setIsEditing(!isEditing);
    }

    const handleChange = (e: any) => {
        let targetValue: any = e.target.value;
        if (getFieldOf(targetValue, "_d") instanceof Date) {
            targetValue = getFieldOf(targetValue, "_d");
        }

        if (targetValue instanceof Date) {
            // convert to UTC
            targetValue = getUTCUnixTimestamp(targetValue);
        }
        setExamData({
            ...examData,
            [e.target.name]: targetValue,
        });
    };

    const handleSave = async () => {
        try {
            const result = await apiClient.editExam(examData);
            const updatedUserData: any = { ...examData };
            Object.keys(result).forEach(key => {
                if (key in examData) {
                    updatedUserData[key] = result[key as keyof (typeof result)];
                }
            });

            setExamData(updatedUserData);
            setIsEditing(false);

            window.history.pushState(
                `examInfo_examId_${examData.exam_id}`,
                "Exam Info",
                `${window.location.pathname}?examId=${encodeURIComponent(examData.exam_id!)
                }&edit=${isEditing ? '0' : '1'}`,
            );
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}) - ${errMessage}`);
            return;
        }
    };

    const handleParticipate = async () => {
        try {
            const result = await apiClient.participateExam({
                exam_id: examData.exam_id,
                price: examData.price,
                user_id: apiClient.getCurrentUserId()!,
            });
            snackbar.success(CurrentAppTranslation.ExamParticipationSuccessText);
            setExamInfo({
                ...examInfo!,
                has_participated: true,
                question_count: result.question_count,
            });
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}) - ${errMessage}`);
            return;
        }
    };

    const handleExamHall = () => {
        window.location.href = `/examHall?examId=${examData.exam_id}`;
    }

    const handleScoreEdit = (userId: string, score: string) => {
        setCurrentScoreEditUserId(userId);
        setEditScore(score);
    };

    const handleScoreSubmit = async (userId: string) => {
        try {
            await apiClient.setExamScore({
                exam_id: examData.exam_id,
                user_id: userId,
                score: editScore,
            });
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to set score (${errCode}): ${errMessage}`);
            return;
        }

        setExamParticipants(
            {
                ...examParticipants,
                participants: examParticipants?.participants?.map(p =>
                    p.user_id === userId ? { ...p, final_score: editScore } : p
                )
            }
        )

        setCurrentScoreEditUserId(null);
        setEditScore('');
    };

    const handleViewAnswers = (userId: string) => {
        window.open(
            `/examHall?examId=${examInfo?.exam_id}&pov=${userId}`,
            '_blank'
        )
    }

    const handleScoreCancel = () => {
        setCurrentScoreEditUserId(null);
        setEditScore('');
    };


    if (!examData) {
        // maybe return better stuff here in future?
        return (
            <DashboardContainer>
                <CircularProgress />
            </DashboardContainer>
        );
    }

    if (isExamNotFound) {
        return (
            <DashboardContainer>
                <Typography>{CurrentAppTranslation.ExamNotFoundText}</Typography>
            </DashboardContainer>
        );
    }

    return (
        <DashboardContainer>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
                    <Typography variant="h4" style={{
                        textAlign: 'center',
                    }} gutterBottom>
                        {CurrentAppTranslation.ExamInformationText}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        {examInfo?.can_edit_question && (
                            <Button variant="contained" onClick={isEditing ? handleSave : handleEdit}>
                                {isEditing ? CurrentAppTranslation.SaveText : CurrentAppTranslation.EditText}
                            </Button>
                        )}
                        {(!isEditing && examInfo?.can_participate &&
                            !examInfo.has_participated &&
                            !examInfo.has_finished && !examInfo.can_edit_question) && (
                                <Button variant="contained" onClick={handleParticipate}>
                                    {CurrentAppTranslation.ParticipateText}
                                </Button>
                            )}
                        {(!isEditing && examInfo?.can_edit_question) && (
                            <Button variant="contained" onClick={handleExamHall}>
                                {CurrentAppTranslation.QuestionsText}
                            </Button>
                        )}
                        {(!isEditing && examInfo?.has_participated && examInfo.has_started) && (
                            <Button variant="contained" onClick={handleExamHall}>
                                {CurrentAppTranslation.ExamHallText}
                            </Button>
                        )}
                    </Box>
                    <hr />
                    <Grid container spacing={2}>
                        {RenderAllFields({
                            data: examData,
                            handleInputChange: handleChange,
                            isEditing: isEditing,
                            disablePast: true,
                            disableDateTimePickers: examInfo?.has_finished,
                            noEditFields: [
                                'exam_id',
                                'has_participated',
                                'has_started',
                                'has_finished',
                            ],
                        })}
                    </Grid>
                </Paper>
            </Container>
            <RenderParticipantsList editScore={editScore}
                handleCancel={handleScoreCancel}
                handleEdit={handleScoreEdit}
                handleSubmit={handleScoreSubmit}
                handleViewAnswers={handleViewAnswers}
                participants={examParticipants}
                setEditScore={setEditScore}
                currentScoreEditUserId={currentScoreEditUserId!}
                canSetScore={apiClient.canSetExamScore(examInfo)}
                canViewAnswers={apiClient.canViewExamQuestionAnswers(examInfo)}
                key={`participants-list-renderer-${currentScoreEditUserId! ?? 'no-edit'}`}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                <Pagination
                    count={totalPages} page={participantPage + 1} onChange={(_, newPage) => fetchExamParticipants(newPage - 1)} />
            </Box>
        </DashboardContainer>
    );
};

export default ExamInfoPage;