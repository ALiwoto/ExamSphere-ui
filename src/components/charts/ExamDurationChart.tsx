import type React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import apiClient from "../../apiClient";


const ExamDurationChart: React.FC = () => {
    const [data, setData] = useState<{ date: string; duration: number }[]>([])

    useEffect(() => {
        const loadData = async () => {
            const fetchedData = await apiClient.fetchExamDurations()
            setData(fetchedData)
        }
        loadData();
    }, [])

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Exam Duration Over Time
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="duration" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
            </ResponsiveContainer>
        </>
    )
}

export default ExamDurationChart;
