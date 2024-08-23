import React from 'react';
import { TextField, ThemeProvider, createTheme } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import moment from 'moment-jalaali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
    },
});

const ModernDateTimePicker: React.FC = () => {
    moment.loadPersian({ dialect: 'persian-modern' });
    const [selectedDateTime, setSelectedDateTime] = React.useState<Date | null>(null);

    return (
        <ThemeProvider theme={theme}>
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
            <LocalizationProvider dateAdapter={AdapterMomentJalaali}>
                <DateTimePicker
                    label="Exam Start Time"
                    value={selectedDateTime as any}
                    onChange={(newValue) => {
                        setSelectedDateTime(newValue);
                    }}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default ModernDateTimePicker;