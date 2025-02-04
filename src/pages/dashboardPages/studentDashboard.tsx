import type React from "react"
import { Container, Grid, Paper, Typography } from "@mui/material";
import FutureExams from "../../components/charts/FutureExams";
import OngoingExams from "../../components/charts/OngoingExams";
import PreviousExams from "../../components/charts/PreviousExams";
import ScoreChart from "../../components/charts/ScoreChart";
import ExamsPerTopicChart from "../../components/charts/ExamsPerTopicChart";
import ExamDurationChart from "../../components/charts/ExamDurationChart";

const StudentDashboard: React.FC = () => {
    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Student Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
                        <OngoingExams />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
                        <FutureExams />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 240 }}>
                        <PreviousExams />
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

