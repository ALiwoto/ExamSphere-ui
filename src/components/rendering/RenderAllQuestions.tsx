import React from "react";
import { ExamQuestionInfo } from "../../api";
import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import apiClient from "../../apiClient";
import { CurrentAppTranslation } from "../../translations/appTranslation";

interface RenderQuestionsListProps {
    questions: ExamQuestionInfo[];

    /**
     * The id of the question that is currently being edited.
     */
    editingId: number | null;

    /**
     * Whether the user is participating in the exam.
     * This is used to determine if the user can submit answers.
     * If the user is not participating, the user can only view the questions.
     */
    isParticipating: boolean;

    /**
     * Whether the user should be able to edit the questions.
     */
    canEditQuestions: boolean;

    /**
     * Whether the exam is finished.
     */
    isExamFinished?: boolean;

    handleEdit: (qId: number) => void;
    handleSubmit: (qId: number) => void;
    handleInputChange: (qId: number, field: keyof ExamQuestionInfo, value: any) => void;
    handleChosenOptionChange: (qId: number, value: string) => void;
    handleAnswerTextChange: (qId: number, value: string) => void;
}

const getPointerQuestionDescription = (question: ExamQuestionInfo) => {
    // there are question.pointer_count and question.pointer_to_exam_id
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="body1">
                References {question.pointer_count} questions from{' '}
                <Link href={`/examInfo?examId=${question.pointer_to_exam_id}`} underline="hover">
                    exam-{question.pointer_to_exam_id}
                </Link>
            </Typography>
        </Box>
    );
};

const RenderAllQuestions: React.FC<RenderQuestionsListProps> = ({ ...props }) => {
    if (!props.questions || props.questions.length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
                {CurrentAppTranslation.ExamHasNoQuestionsYetText}
            </Typography>
        );
    }

    return (
        <Container maxWidth="md" >
            {props.questions.map((question) => (
                <Paper key={question.question_id} elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}>
                        {props.editingId !== question.question_id || !props.canEditQuestions ? (
                            <Typography variant="h6"
                                style={{
                                    justifyContent: question.is_pointer ? 'center' : CurrentAppTranslation.justifyContent,
                                    direction: CurrentAppTranslation.direction,
                                }}
                            >
                                {question.is_pointer ? CurrentAppTranslation.ReferencedQuestionsText :
                                    question.question_title}
                            </Typography>
                        ) : (
                            question?.is_pointer ?? false ? (
                                <TextField
                                    fullWidth
                                    label={CurrentAppTranslation.ReferenceExamIdText}
                                    value={question.pointer_to_exam_id}
                                    type="number"
                                    onChange={(e) => props.handleInputChange(
                                        question.question_id!, "pointer_to_exam_id", parseInt(e.target.value))}
                                    disabled={props.editingId !== question.question_id}
                                />
                            ) : (
                                <TextField
                                    fullWidth
                                    label={CurrentAppTranslation.QuestionTitleText}
                                    value={question.question_title}
                                    onChange={(e) => props.handleInputChange(question.question_id!, "question_title", e.target.value)}
                                    disabled={props.editingId !== question.question_id}
                                />
                            )
                        )}
                        {!props.isExamFinished && (
                            <Button
                                variant="contained"
                                color={props.editingId === question.question_id ? "secondary" : "primary"}
                                onClick={() => props.handleEdit(question.question_id!)}
                            >
                                {props.editingId === question.question_id ?
                                    CurrentAppTranslation.CancelButtonText :
                                    CurrentAppTranslation.EditText}
                            </Button>
                        )}
                    </Box>
                    {props.editingId !== question.question_id || !props.canEditQuestions ? (
                        <Typography variant="body1"
                            sx={{
                                justifyContent: CurrentAppTranslation.justifyContent,
                                direction: CurrentAppTranslation.direction,
                            }}
                            gutterBottom>
                            {question.is_pointer ? getPointerQuestionDescription(question) : question.description}
                        </Typography>
                    ) : (
                        question?.is_pointer ?? false ? (
                            <TextField
                                fullWidth
                                label={CurrentAppTranslation.ReferencedQuestionsCountText}
                                value={question.pointer_count ?? 0}
                                type="number"
                                onChange={(e) => props.handleInputChange(
                                    question.question_id!, "pointer_count", parseInt(e.target.value))}
                                disabled={props.editingId !== question.question_id}
                            />
                        ) : (
                            <TextField
                                sx={{
                                    justifyContent: CurrentAppTranslation.justifyContent,
                                    direction: CurrentAppTranslation.direction,
                                }}
                                fullWidth
                                multiline
                                rows={3}
                                label={CurrentAppTranslation.DescriptionText}
                                value={question.description}
                                onChange={(e) => props.handleInputChange(question.question_id!, "description", e.target.value)}
                                disabled={props.editingId !== question.question_id}
                                margin="normal"
                            />
                        )
                    )}
                    {!question.is_pointer && apiClient.getQuestionOptions(question).map((option, index) => (
                        props.editingId !== question.question_id || !props.canEditQuestions ?
                            (
                                <Typography key={index} variant="body2" sx={{
                                    justifyContent: CurrentAppTranslation.justifyContent,
                                    direction: CurrentAppTranslation.direction,
                                }}>
                                    {`${CurrentAppTranslation.OptionText} ${index + 1}${CurrentAppTranslation.OptionSeparatorChar
                                        } ${option}`}
                                </Typography>
                            ) :
                            (<TextField
                                key={index}
                                fullWidth
                                label={`${CurrentAppTranslation.OptionText} ${index + 1}`}
                                value={option}
                                onChange={(e) => props.handleInputChange(
                                    question.question_id!,
                                    `option${index + 1}` as keyof ExamQuestionInfo,
                                    e.target.value
                                )}
                                disabled={props.editingId !== question.question_id}
                                margin="normal" />)
                    ))}
                    {!props.canEditQuestions && (
                        <TextField
                            fullWidth
                            label={CurrentAppTranslation.ChosenOptionText}
                            value={question.user_answer?.chosen_option}
                            onChange={(e) => props.handleChosenOptionChange(question.question_id!, e.target.value)}
                            disabled={props.editingId !== question.question_id}
                            margin="normal"
                        />)}
                    {!props.canEditQuestions && (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label={CurrentAppTranslation.AnswerFieldText}
                            value={question.user_answer?.answer}
                            onChange={(e) => props.handleAnswerTextChange(question.question_id!, e.target.value)}
                            disabled={props.editingId !== question.question_id!}
                            margin="normal"
                            style={{
                                justifyContent: CurrentAppTranslation.justifyContent,
                                direction: CurrentAppTranslation.direction,
                            }}
                        />)}
                    {props.editingId === question.question_id && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => props.handleSubmit(question.question_id!)}
                            sx={{ mt: 2 }}
                        >
                            {CurrentAppTranslation.SubmitText}
                        </Button>
                    )}
                </Paper>
            ))}
        </Container>
    );
};

export default RenderAllQuestions;
