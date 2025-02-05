import type React from "react"
import { Container, Grid, Paper, Typography } from "@mui/material";
import FutureExams from "../../components/charts/FutureExams";
import OngoingExams from "../../components/charts/OngoingExams";
import PreviousExams from "../../components/charts/PreviousExams";
import ScoreChart from "../../components/charts/ScoreChart";
import ExamsPerTopicChart from "../../components/charts/ExamsPerTopicChart";
import ExamDurationChart from "../../components/charts/ExamDurationChart";
import { useState } from "react";

const StudentDashboard: React.FC = () => {
    const [examsPaperHeight, setExamsPaperHeight] = useState(300);

    const setProperExamsPaperHeight = (currentAmount: number) => {
        // we should set maximum height for exams paper
        let newHeight = currentAmount * 100;
        if (newHeight > examsPaperHeight) {
            setExamsPaperHeight(newHeight);
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Student Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: examsPaperHeight }}>
                        <OngoingExams SetProperExamsPaperHeight={setProperExamsPaperHeight} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: examsPaperHeight }}>
                        <FutureExams SetProperExamsPaperHeight={setProperExamsPaperHeight} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: examsPaperHeight }}>
                        <PreviousExams SetProperExamsPaperHeight={setProperExamsPaperHeight} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 300 }}>
                        <ScoreChart />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 300 }}>
                        <ExamsPerTopicChart />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 300 }}>
                        <ExamDurationChart />
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    )
};

export default StudentDashboard;

