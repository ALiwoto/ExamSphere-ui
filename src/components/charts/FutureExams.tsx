import type React from "react";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import apiClient from "../../apiClient";
import { UserFutureExamInfo } from "../../api";

interface FutureExamsProps {
    SetProperExamsPaperHeight: (currentAmount: number) => void;
}

const FutureExams: React.FC<FutureExamsProps> = ({ ...props }) => {
    const [exams, setExams] = useState<UserFutureExamInfo[]>([]);

    useEffect(() => {
        const loadExams = async () => {
            const fetchedExams = await apiClient.fetchFutureExams();
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
                Future Exams
            </Typography>
            <List>
                {exams.map((exam) => (
                    <ListItem key={exam.exam_id} button onClick={() => handleExamClick(exam.exam_id!)}>
                        <ListItemText primary={exam.exam_title} secondary={`Date: ${exam.exam_date}`} />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default FutureExams;

