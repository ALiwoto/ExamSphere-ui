import type React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import apiClient from "../../apiClient";

const ScoreChart: React.FC = () => {
    const [data, setData] = useState<{ date: string; score: number }[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const fetchedData = await apiClient.fetchExamScores();
            setData(fetchedData);
        }
        loadData();
    }, [])

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Exam Scores Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}

export default ScoreChart;

