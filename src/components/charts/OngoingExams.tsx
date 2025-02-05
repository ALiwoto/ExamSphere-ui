import type React from "react";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import apiClient from "../../apiClient";
import { UserOngoingExamInfo } from "../../api";

interface OngoingExamsProps {
    SetProperExamsPaperHeight: (currentAmount: number) => void;
}

const OngoingExams: React.FC<OngoingExamsProps> = ({ ...props }) => {
    const [exams, setExams] = useState<UserOngoingExamInfo[]>([]);

    useEffect(() => {
        const loadExams = async () => {
            const fetchedExams = await apiClient.fetchOngoingExams();
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
                Ongoing Exams
            </Typography>
            <List>
                {exams.map((exam) => (
                    <ListItem key={exam.exam_id} button onClick={() => handleExamClick(exam.exam_id!)}>
                        <ListItemText primary={exam.exam_title} secondary={
                            `Started: ${exam.start_time}`
                        } />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default OngoingExams;