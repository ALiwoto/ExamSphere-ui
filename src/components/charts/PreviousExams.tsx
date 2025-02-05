import type React from "react";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import apiClient from "../../apiClient";
import { UserExamHistoryInfo } from "../../api";

interface PreviousExamsProps {
    SetProperExamsPaperHeight : (currentAmount: number) => void;
}

const PreviousExams: React.FC<PreviousExamsProps> = ({ ...props }) => {
    const [exams, setExams] = useState<UserExamHistoryInfo[]>([]);

    useEffect(() => {
        const loadExams = async () => {
            const fetchedExams = await apiClient.fetchPreviousExams({
                limit: 5,
                offset: 0,
            }); // TODO: implement pagination later
            setExams(fetchedExams);
            props.SetProperExamsPaperHeight(fetchedExams.length);
        }
        loadExams();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleExamClick = (examId: number) => {
        window.open(`/examInfo?examId=${examId}`, "_blank");
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Previous Exams
            </Typography>
            <List>
                {exams.map((exam) => (
                    <ListItem key={exam.exam_id} button onClick={() => handleExamClick(exam.exam_id!)}>
                        <ListItemText primary={exam.exam_title} secondary={`Date: ${exam.started_at}`} />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default PreviousExams;
