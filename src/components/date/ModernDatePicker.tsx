import React from 'react';
import { TextField, ThemeProvider, createTheme } from '@mui/material';
import moment from 'moment-jalaali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AppCalendarType } from '../../utils/AppCalendarTypes';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
        },
    },
});

interface ModernDateTimePickerProps {
    label: string;
    value?: Date | number;
    onChange: (newValue: any) => void;
    dateType?: AppCalendarType;
    disablePast?: boolean;
    disabled?: boolean;
}

moment.loadPersian({ dialect: 'persian-modern' });

const ModernDateTimePicker: React.FC<ModernDateTimePickerProps> = ({ ...props }) => {
    let momentValue: moment.Moment | null = null;
    if (props.value) {
        const valueType = typeof props.value;
        if (valueType === 'number') {
            momentValue = moment.unix(props.value as number);
        } else {
            momentValue = moment(props.value);
        }
    }
    const [selectedDateTime, setSelectedDateTime] = React.useState<moment.Moment | null>(momentValue);

    const adapterType = props.dateType === 'jalali' ? AdapterMomentJalaali : AdapterDateFns;

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={adapterType as any}>
                <MobileDateTimePicker
                    disablePast={props.disablePast}
                    disabled={props.disabled}
                    slots={
                        {
                            textField: (params) => <TextField {...params} fullWidth />
                        }
                    }
                    label={props.label}
                    value={selectedDateTime as any}
                    onChange={(newValue) => {
                        setSelectedDateTime(newValue);
                        props.onChange(newValue);
                    }}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default ModernDateTimePicker;