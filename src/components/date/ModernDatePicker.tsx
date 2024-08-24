import React from 'react';
import { TextField, ThemeProvider, createTheme } from '@mui/material';
import moment from 'moment-jalaali';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterMomentJalaali } from '@mui/x-date-pickers/AdapterMomentJalaali';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { AppCalendarType } from '../../utils/AppCalendarTypes';
import { CurrentAppTranslation } from '../../translations/appTranslation';

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
            momentValue = moment.utc((props.value as number) * 1000);
        } else {
            momentValue = moment.utc(props.value);
        }
    }
    const [selectedDateTime, setSelectedDateTime] = React.useState<moment.Moment | null>(momentValue);

    if (!selectedDateTime && momentValue) {
        setSelectedDateTime(momentValue);
    }

    const adapterType = props.dateType === 'jalali' ? AdapterMomentJalaali : AdapterDateFns;

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider key={`${selectedDateTime?.toString() ?? ''}-${CurrentAppTranslation.ShortLang
                }-date-time-picker-localizer`}
                dateAdapter={adapterType as any}>
                <MobileDateTimePicker key={`${selectedDateTime?.toString() ?? ''}-date-time-picker`}
                    disablePast={props.disablePast}
                    disabled={props.disabled}
                    slots={
                        {
                            textField: (params) => <TextField {...params} fullWidth />
                        }
                    }
                    label={props.label}
                    value={
                        (selectedDateTime === null || selectedDateTime === undefined) ? null :
                            props.dateType === 'gregorian' ?
                                (selectedDateTime as moment.Moment).local().toDate() :
                                selectedDateTime?.local()
                    }
                    onChange={(newValue) => {
                        let utcValue: any = null;
                        if (newValue instanceof Date) {
                            // setSelectedDateTime(moment(newValue));
                            utcValue = moment(newValue).utc();
                        } else if (moment.isMoment(newValue)) {
                            // setSelectedDateTime(newValue);
                            utcValue = newValue.clone().utc();
                        }

                        if (utcValue) {
                            props.onChange(newValue);
                        } else {
                            console.log('newValue is not a Date or Moment object');
                        }
                    }}
                />
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default ModernDateTimePicker;