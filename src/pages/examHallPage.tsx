import React, { useEffect, useReducer, useState } from 'react';
import { Button, Box, Pagination, CircularProgress, Link, Paper } from '@mui/material';
import { AnswerQuestionData, CreateExamQuestionData, ExamQuestionInfo, GetExamInfoResult } from '../api';
import { extractErrorDetails } from '../utils/errorUtils';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import apiClient from '../apiClient';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import RenderAllQuestions from '../components/rendering/RenderAllQuestions';
import { autoSetWindowTitle } from '../utils/commonUtils';
import { CurrentAppTranslation } from '../translations/appTranslation';
import backgroundImage1 from '../assets/bg/exam_hall1.jpg'

const PageLimit = 4;

export var forceUpdateExamHallPage = () => { };

const ExamHallPage: React.FC = () => {
    const urlSearch = new URLSearchParams(window.location.search);
    const examId = parseInt(urlSearch.get('examId')!);
    const providedPage = urlSearch.get('page');
    const pov = apiClient.canTryUsingPovExamFeature() ? urlSearch.get('pov') : '';
    const hasPov = pov && pov.length > 0;
    const [examInfo, setExamInfo] = useState<GetExamInfoResult | null>(null);
    const [page, setPage] = useState<number>(providedPage ? parseInt(providedPage) - 1 : 0);
    const [totalPages, setTotalPages] = useState(page + 1);
    const [isLoading, setIsLoading] = useState(false);
    const [questions, setQuestions] = useState<ExamQuestionInfo[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [answerQuestionData, setAnswerQuestionData] = useState<AnswerQuestionData | null>({});
    const [newExamQuestion, setNewExamQuestion] = useState<CreateExamQuestionData | null>(null);
    const [, setForceUpdate] = useReducer(x => x + 1, 0);

    const snackbar = useAppSnackbar();

    forceUpdateExamHallPage = () => setForceUpdate();

    const fetchQuestions = async () => {
        try {
            const result = await apiClient.getExamQuestions({
                exam_id: examId!,
                offset: page * PageLimit,
                limit: PageLimit,
                pov: pov!,
            });
            setQuestions(result.questions!);

            // we need to do setTotalPages dynamically, e.g. if the limit is reached,
            // we should add one more page. if the amount of results returned is less than
            // the limit, we shouldn't increment the total pages.
            const newTotalPages = (result.questions?.length ?? 0) < PageLimit ? (page + 1) : page + 2;
            setTotalPages(newTotalPages);
            return result;
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to get examQuestions (${errCode}): ${errMessage}`);
        }
    };

    const fetchExamInfo = async () => {
        if (!examId || isNaN(examId)) {
            window.location.href = '/dashboard';
            return;
        }

        if (isLoading) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await apiClient.getExamInfo(examId!);
            setExamInfo(result);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to get examInfo (${errCode}): ${errMessage}`);
            setIsLoading(false);
            return;
        }

        await fetchQuestions();
        setIsLoading(false);
    };

    const handleNextPage = async (newPage: number) => {
        let extraQueries = `&page=${newPage + 1}`;
        if (hasPov) {
            extraQueries = `&pov=${pov}`;
        }

        window.history.pushState(
            `examHall_page_${newPage + 1}`,
            "Exam Hall",
            `${window.location.pathname}?examId=${examId}${extraQueries}`,
        );

        setIsLoading(true);

        try {
            const result = await apiClient.getExamQuestions({
                exam_id: examId!,
                offset: newPage * PageLimit,
                limit: PageLimit,
                pov: pov!,
            });

            if (!result || !result.questions) {
                setIsLoading(false);
                setQuestions([]);
                return;
            }

            // we need to do setTotalPages dynamically, e.g. if the limit is reached,
            // we should add one more page. if the amount of results returned is less than
            // the limit, we shouldn't increment the total pages.
            const newTotalPages = result.questions.length < PageLimit ? (newPage + 1) : newPage + 2;
            setTotalPages(newTotalPages);

            setPage(newPage);
            setQuestions(result.questions);
            setIsLoading(false);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to get examQuestions (${errCode}): ${errMessage}`);
            setIsLoading(false);
        }
    };

    const getExamHallTitle = () => {
        let examHallTitle = !examInfo?.has_finished ?
            `${CurrentAppTranslation.ExamFinishesInText}: ${examInfo?.finishes_in ?? ''}` :
            CurrentAppTranslation.ExamFinishedText;
        return examHallTitle;
    };

    const handleEdit = (id: number) => {
        // this function will be called when the user clicks on the edit button
        // for a question. if the question is already being edited, we will cancel
        // the edit mode. otherwise, we will set the editingId to the question_id.
        setQuestions(questions.filter(q => q.question_id !== -1));
        if (id === editingId) {
            // remove all questions that have id of -1
            setEditingId(null);
        } else {
            setEditingId(id);
        }
    };

    const handleSubmit = async (id: number) => {
        // we can have 3 operations here:
        // 1. create a new question
        // 2. edit an existing question
        // 3. submit an answer
        if (id === -1 && newExamQuestion) {
            setIsLoading(true);
            try {
                await apiClient.createExamQuestion(newExamQuestion);
            } catch (error: any) {
                const [errCode, errMessage] = extractErrorDetails(error);
                snackbar.error(`Failed to create examQuestion (${errCode}): ${errMessage}`);
            }

            // fetch the questions again to get the new question(s)
            await fetchQuestions();
            setIsLoading(false);
            setNewExamQuestion(null);
        } else if (!examInfo?.can_edit_question && answerQuestionData) {
            try {
                const question = questions.find(q => q.question_id === id);
                if (!question) {
                    throw new Error('Failed to find the question to answer');
                }

                question.user_answer = {
                    chosen_option: answerQuestionData.chosen_option,
                    answer: answerQuestionData.answer_text,
                    question_id: question.question_id,
                    seconds_taken: answerQuestionData.seconds_taken,
                }

                await apiClient.answerExamQuestion(answerQuestionData);
            } catch (error: any) {
                const [errCode, errMessage] = extractErrorDetails(error);
                snackbar.error(`Failed to submit answer (${errCode}): ${errMessage}`);
            }

            setAnswerQuestionData(null);
        } else if (examInfo?.can_edit_question && id !== -1) {
            // we are editing an existing question
            try {
                const question = questions.find(q => q.question_id === id);
                if (!question) {
                    snackbar.error('Failed to find the question to edit');
                    return;
                }

                await apiClient.editExamQuestion({
                    exam_id: examId!,
                    question_id: question.question_id,
                    question_title: question.question_title,
                    description: question.description,
                    option1: question.option1,
                    option2: question.option2,
                    option3: question.option3,
                    option4: question.option4,
                });
            } catch (error: any) {
                const [errCode, errMessage] = extractErrorDetails(error);
                snackbar.error(`Failed to edit examQuestion (${errCode}): ${errMessage}`);
            }

            // fetch the questions again to get the new question(s)
            await fetchQuestions();
            setEditingId(null);
        }
        setEditingId(null);
    };

    const handleInputChange = (id: number, field: keyof ExamQuestionInfo, value: string) => {
        setQuestions(questions.map(q => q.question_id === id ? { ...q, [field]: value } : q));
        if (id === -1 && newExamQuestion) {
            setNewExamQuestion(
                {
                    ...newExamQuestion,
                    [field]: value,
                }
            );
        }
    };

    const handleChosenOptionChange = (qId: number, value: string) => {
        if (!qId || isNaN(qId)) {
            return;
        }

        setAnswerQuestionData(
            {
                ...answerQuestionData,
                chosen_option: value,
                exam_id: examId!,
                question_id: qId,
                seconds_taken: 0,
            }
        )
    };

    const handleAnswerTextChange = (qId: number, value: string) => {
        if (!qId || isNaN(qId)) {
            return;
        }

        setAnswerQuestionData(
            {
                ...answerQuestionData,
                answer_text: value,
                exam_id: examId!,
                question_id: qId,
                seconds_taken: 0,
            }
        )
    }

    const handleAddNewQuestion = () => {
        setQuestions([...questions, {
            question_id: -1,
            question_title: '',
            description: '',
            user_answer: {
                chosen_option: '',
                answer: '',
            },
        }]);
        setNewExamQuestion(
            {
                exam_id: examId!,
                question_title: '',
                description: '',
                option1: '',
                option2: '',
                option3: '',
                option4: '',
            }
        );
        setEditingId(-1);
    }

    useEffect(() => {
        fetchExamInfo();
        autoSetWindowTitle();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DashboardContainer style={{
            backgroundImage: `url(${backgroundImage1})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            gap: '10px',
        }}
            titleText={
                `${CurrentAppTranslation.ExamHallText} - ${examInfo?.exam_title ?? ''}`
            }>
            <Box sx={{
                maxWidth: '650px',
                width: '100%',
                margin: '0 auto',
            }}>
                <Paper sx={
                    {
                        backgroundColor: 'white',
                        padding: '8px',
                        margin: '8px',
                        textAlign: 'center',
                        direction: `${CurrentAppTranslation.direction}`
                    }}>
                    {getExamHallTitle()}
                </Paper>
                {hasPov && (
                    <Paper sx={
                        {
                            backgroundColor: 'rgb(37, 198, 136)',
                            padding: '8px',
                            margin: '8px',
                            textAlign: 'center',
                            direction: `${CurrentAppTranslation.direction}`,
                        }}>
                        {`${CurrentAppTranslation.AnswersForText} ${pov}`}
                    </Paper>
                )}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
                <Box sx={{
                    flexGrow: 1,
                    margin: '0 auto',
                    width: '100%',
                    maxWidth: '650px',
                }}>
                    {isLoading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mt: 4,
                        }}>
                            <CircularProgress size={60} />
                        </Box>
                    ) : <RenderAllQuestions key={`q-renderer-id-${editingId}`} editingId={editingId}
                        questions={questions}
                        handleEdit={handleEdit}
                        handleSubmit={handleSubmit}
                        handleInputChange={handleInputChange}
                        handleChosenOptionChange={handleChosenOptionChange}
                        handleAnswerTextChange={handleAnswerTextChange}
                        isParticipating={examInfo?.has_participated ?? false}
                        canEditQuestions={!hasPov && (examInfo?.can_edit_question ?? false)}
                        isExamFinished={examInfo?.has_finished ?? true}
                    />}
                    {editingId !== -1 && examInfo?.can_edit_question && !examInfo.has_finished && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mt: 4,
                        }}>
                            <Button variant="contained" color="primary" onClick={handleAddNewQuestion}>
                                {CurrentAppTranslation.AddNewQuestionText}
                            </Button>
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                    <Pagination
                        count={totalPages} page={page + 1} onChange={(_, newPage) => handleNextPage(newPage - 1)} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                    <Link href={`/examInfo?examId=${examId}`} style={{ marginTop: '16px' }}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        {CurrentAppTranslation.BackToExamInfoText}
                    </Link>
                </Box>
            </Box>
        </DashboardContainer>
    );
}

export default ExamHallPage;
