import type React from "react";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import apiClient from "../../apiClient";

const ExamsPerTopicChart: React.FC = () => {
  const [data, setData] = useState<{ topic: string; count: number }[]>([])

  useEffect(() => {
    const loadData = async () => {
      const fetchedData = await apiClient.fetchExamsPerTopic()
      setData(fetchedData);
    }
    loadData()
  }, [])

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Exams Per Topic
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="topic" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </>
  )
}

export default ExamsPerTopicChart;