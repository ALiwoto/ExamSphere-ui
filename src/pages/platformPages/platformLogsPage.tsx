import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import apiClient from '../../apiClient';
import { LoggingLogEntry } from '../../api';

enum LogLevel {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
  Debug = 'debug'
}

// Mock log entry type
interface LogEntry {
  id: string;
  type: LogLevel;
  date: Date;
  message: string;
  details: string;
}

const convertToLogEntries = (serverEntries: LoggingLogEntry[]): LogEntry[] => {
  return serverEntries.map((entry) => ({
    id: entry.log_id!,
    type: entry.log_type as LogLevel,
    date: new Date(entry.date!),
    message: entry.message!,
    details: entry.details!,
  }));
}

// Mock API call
const fetchLogs = async (): Promise<LogEntry[]> => {
  return convertToLogEntries((await apiClient.getPlatformLogs())?.logs || []);
};

export default function PlatformLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [logType, setLogType] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);

  useEffect(() => {
    fetchLogs().then(setLogs);
  }, []);

  const handleLogExpand = (id: string) => {
    setExpandedLogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = logType === '' || log.type === logType;
    const matchesDateRange = (!dateFrom || log.date >= dateFrom) && (!dateTo || log.date <= dateTo);
    return matchesSearch && matchesType && matchesDateRange;
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Application Logs
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search logs"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Log Type</InputLabel>
              <Select
                value={logType}
                label="Log Type"
                onChange={(e) => setLogType(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="error">Error</MenuItem>
                <MenuItem value="warning">Warning</MenuItem>
                <MenuItem value="info">Info</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="From Date"
              value={dateFrom}
              onChange={(newValue) => setDateFrom(newValue)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="To Date"
              value={dateTo}
              onChange={(newValue) => setDateTo(newValue)}
            />
          </Grid>
        </Grid>
        <Paper elevation={3}>
          <List>
            {filteredLogs.map((log) => (
              <React.Fragment key={log.id}>
                <ListItem
                  button
                  onClick={() => handleLogExpand(log.id)}
                  sx={{ borderBottom: '1px solid #e0e0e0' }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ minWidth: 150 }}>
                          {log.date.toLocaleString()}
                        </Typography>
                        <Chip
                          label={log.type}
                          color={log.type === 'error' ? 'error' : log.type === 'warning' ? 'warning' : 'info'}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography>{log.message}</Typography>
                      </Box>
                    }
                  />
                  {expandedLogs.has(log.id) ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={expandedLogs.has(log.id)} timeout="auto" unmountOnExit>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                    {
                        log.details.split('\n').map((line => (
                            <Typography variant="body2">{line}</Typography>
                        )))
                    }
                  </Box>
                </Collapse>
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}