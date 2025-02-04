import type React from "react";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography } from "@mui/material";
import apiClient from "../../apiClient";

const PreviousExams: React.FC = () => {
    const [exams, setExams] = useState<any[]>([]);

    useEffect(() => {
        const loadExams = async () => {
            const fetchedExams = await apiClient.fetchPreviousExams();
            setExams(fetchedExams);
        }
        loadExams();
    }, [])

    const handleExamClick = (examId: string) => {
        window.open(`/examInfo?examId=${examId}`, "_blank");
    }

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Previous Exams
            </Typography>
            <List>
                {exams.map((exam) => (
                    <ListItem key={exam.id} button onClick={() => handleExamClick(exam.id)}>
                        <ListItemText primary={exam.title} secondary={`Score: ${exam.score}, Date: ${exam.date}`} />
                    </ListItem>
                ))}
            </List>
        </>
    )
}

export default PreviousExams;
