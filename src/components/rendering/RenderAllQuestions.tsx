import React from "react";
import { ExamQuestionInfo } from "../../api";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import apiClient from "../../apiClient";
import { CurrentAppTranslation } from "../../translations/appTranslation";



interface RenderQuestionsListProps {
    questions: ExamQuestionInfo[];
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

    handleEdit: (qId: number) => void;
    handleSubmit: (qId: number) => void;
    handleInputChange: (qId: number, field: keyof ExamQuestionInfo, value: string) => void;
    handleChosenOptionChange: (qId: number, value: string) => void;
    handleAnswerTextChange: (qId: number, value: string) => void;
}

const RenderAllQuestions: React.FC<RenderQuestionsListProps> = ({ ...props }) => {
    console.log(props.questions);
    return (
        <Container maxWidth="md">
            {props.questions.map((question) => (
                <Paper key={question.question_id} elevation={3} sx={{ p: 3, mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        {props.editingId !== question.question_id || !props.canEditQuestions ? (
                            <Typography variant="h6">
                                {question.question_title}
                            </Typography>
                        ) : (
                            <TextField
                                fullWidth
                                label={CurrentAppTranslation.QuestionTitleText}
                                value={question.question_title}
                                onChange={(e) => props.handleInputChange(question.question_id!, "question_title", e.target.value)}
                                disabled={props.editingId !== question.question_id}
                            />
                        )}
                        <Button
                            variant="contained"
                            color={props.editingId === question.question_id ? "secondary" : "primary"}
                            onClick={() => props.handleEdit(question.question_id!)}
                        >
                            {props.editingId === question.question_id ?
                                CurrentAppTranslation.CancelButtonText :
                                CurrentAppTranslation.EditText}
                        </Button>
                    </Box>
                    {props.editingId !== question.question_id || !props.canEditQuestions ? (
                        <Typography variant="body1" gutterBottom>
                            {question.description}
                        </Typography>) : (
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label={CurrentAppTranslation.DescriptionText}
                            value={question.description}
                            onChange={(e) => props.handleInputChange(question.question_id!, "description", e.target.value)}
                            disabled={props.editingId !== question.question_id}
                            margin="normal"
                        />
                    )}
                    {apiClient.getQuestionOptions(question).map((option, index) => (
                        props.editingId !== question.question_id || !props.canEditQuestions ?
                            (<Typography key={index} variant="body2">
                                {`${index + 1}. ${option}`}
                            </Typography>) :
                            (<TextField
                                key={index}
                                fullWidth
                                label={`${CurrentAppTranslation.OptionText} ${index + 1}`}
                                value={option}
                                onChange={(e) => props.handleInputChange(
                                    question.question_id!,
                                    `option${index+1}` as keyof ExamQuestionInfo,
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
                            label="Answer Text"
                            value={question.user_answer?.answer}
                            onChange={(e) => props.handleAnswerTextChange(question.question_id!, e.target.value)}
                            disabled={props.editingId !== question.question_id!}
                            margin="normal"
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
