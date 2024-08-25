import React, { useEffect, useReducer, useState } from 'react';
import { Typography, Button, TextField, Paper, Box, Container, Pagination, CircularProgress } from '@mui/material';
import { AnswerQuestionData, CreateExamQuestionData, ExamQuestionInfo, GetExamInfoResult } from '../api';
import { extractErrorDetails } from '../utils/errorUtils';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import apiClient from '../apiClient';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import RenderAllQuestions from '../components/rendering/RenderAllQuestions';
import { autoSetWindowTitle } from '../utils/commonUtils';

const PageLimit = 10;

export var forceUpdateExamHallPage = () => { };

export default function Component() {
    const urlSearch = new URLSearchParams(window.location.search);
    const examId = parseInt(urlSearch.get('examId')!);
    const providedPage = urlSearch.get('page');
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
            });
            setQuestions(result.questions!);
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
        }

        await fetchQuestions();
        setIsLoading(false);
    };

    const handleNextPage = async (newPage: number) => {
        window.history.pushState(
            `examHall_page_${newPage + 1}`,
            "Exam Hall",
            `${window.location.pathname}?examId=${examId}&page=${newPage + 1}`,
        );

        setIsLoading(true);

        try {
            const result = await apiClient.getExamQuestions({
                exam_id: examId!,
                offset: newPage * PageLimit,
                limit: PageLimit,
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
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed to get examQuestions (${errCode}): ${errMessage}`);
        }
    };

    const handleEdit = (id: number) => {
        // this function will be called when the user clicks on the edit button
        // for a question. if the question is already being edited, we will cancel
        // the edit mode. otherwise, we will set the editingId to the question_id.
        if (id == editingId) {
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
                apiClient.createExamQuestion(newExamQuestion);
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
                apiClient.answerExamQuestion(answerQuestionData);
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

                apiClient.editExamQuestion({
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
    };

    const handleChosenOptionChange = (qId: number, value: string) => {
        if (!qId || isNaN(qId)) {
            return;
        }

        setAnswerQuestionData(
            {
                ...answerQuestionData,
                chosen_option: value,
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
        <DashboardContainer>
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
                    ) : <RenderAllQuestions editingId={editingId}
                        questions={questions}
                        handleEdit={handleEdit}
                        handleSubmit={handleSubmit}
                        handleInputChange={handleInputChange}
                        handleChosenOptionChange={handleChosenOptionChange}
                        handleAnswerTextChange={handleAnswerTextChange}
                        isParticipating={examInfo?.has_participated ?? false}
                        canEditQuestions={examInfo?.can_edit_question ?? false}
                    />}
                    <Button variant="contained" color="primary" onClick={handleAddNewQuestion}>Add New Question</Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                    <Pagination
                        count={totalPages} page={page + 1} onChange={(_, newPage) => handleNextPage(newPage - 1)} />
                </Box>
            </Box>
        </DashboardContainer>
    );
    // return (
    //     <Container maxWidth="md">
    //         <Typography variant="h4" gutterBottom>Online Exam</Typography>

    //     </Container>
    // );
}