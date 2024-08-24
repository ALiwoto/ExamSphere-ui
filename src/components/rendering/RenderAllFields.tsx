
import apiClient from '../../apiClient';
import { CurrentAppTranslation } from '../../translations/appTranslation';
import { Box, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import SelectMenu from '../../components/menus/selectMenu';
import ModernDateTimePicker from '../date/ModernDatePicker';
import { getDateFromServerTimestamp } from '../../utils/timeUtils';

interface RenderAllFieldsProps {
    data: any;
    handleInputChange: any;
    isEditing?: boolean;
    disablePast?: boolean;
    excludedFields?: string[];
    noEditFields?: string[];
}

const RenderAllFields = (props: RenderAllFieldsProps) => {
    const { data, handleInputChange } = props;

    // we will be using Object.keys to get all the keys in the data object
    return Object.keys(data).map((field) => {
        if (props.excludedFields?.includes(field)) {
            return null;
        }

        const typeName = typeof data[field as keyof (typeof data)];
        const isEditing = (props.isEditing ?? true) && !props.noEditFields?.includes(field);

        if (apiClient.isFieldDate(field)) {
            if (!isEditing) {
                return (
                    <Grid item xs={12} key={field}>
                        <Typography style={{
                            direction: `${CurrentAppTranslation.direction}`,
                        }}>
                            <strong>
                                {`${CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}: `}
                            </strong>
                            {getDateFromServerTimestamp(data[field])?.toLocaleDateString('en-US', {
                                weekday: 'long', // "Monday"
                                year: 'numeric', // "2003"
                                month: 'long', // "July"
                                day: 'numeric', // "26",
                                hour: 'numeric', // "11 AM"
                                minute: 'numeric', // "30"
                            })}
                        </Typography>
                    </Grid>
                )
            }
            return (
                <ModernDateTimePicker key={`${field}-date-time-picker-key`}
                    disablePast={props.disablePast}
                    label={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                    value={data[field] ?? ''}
                    dateType={CurrentAppTranslation.CalendarType}
                    onChange={(newValue: any) => {
                        handleInputChange({
                            target: {
                                name: field,
                                value: newValue
                            }
                        });
                    }}
                />
            )
        }

        if (typeName === 'boolean') {
            if (!isEditing) {
                return (
                    <Grid item xs={12} key={field}>
                        <Typography style={{
                            direction: `${CurrentAppTranslation.direction}`,
                        }}>
                            <strong>
                                {`${CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}: `}
                            </strong>
                            {data[field] ? CurrentAppTranslation.YesText : CurrentAppTranslation.NoText}
                        </Typography>
                    </Grid>
                )
            }

            return (
                <Box key={`${field}-box-key`}
                sx={{
                  display: 'flex',
                  justifyContent: `${CurrentAppTranslation.justifyContent}`,
                  width: '100%', // Ensure the Box takes full width
                }}
              >
                <FormControlLabel key={`${field}-form-control-label-key`}
                    style={{
                        direction: `${CurrentAppTranslation.direction}`,
                    }}
                    control={
                        <Checkbox
                            checked={data[field] ?? false}
                            disabled={!isEditing}
                            onChange={(e: any) => {
                                handleInputChange({
                                    target: {
                                        name: field,
                                        value: e.target.checked
                                    }
                                });
                            }}
                            color="primary"
                        />
                    }
                    label={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                />
                </Box>
            );
        }

        // check if type of field is enum
        if (apiClient.isFieldEnum(field)) {
            if (!isEditing) {
                return (
                    <Grid item xs={12} key={field}>
                        <Typography style={{
                            direction: `${CurrentAppTranslation.direction}`,
                        }}>
                            <strong>
                                {`${CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}: `}
                            </strong>
                            {CurrentAppTranslation[data[field] as keyof (typeof CurrentAppTranslation)]}
                        </Typography>
                    </Grid>
                )
            }

            return (
                <SelectMenu key={`${field}-select-el-key`}
                    labelText={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                    labelId={`${field}-select-label`}
                    name={field}
                    value={data[field as keyof (typeof data)] ?? ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    options={Object.values(typeof field).filter(
                        enumValue => enumValue !== undefined && enumValue !== '')}
                />
            );
        }

        // check if type of key is string
        if (typeName === 'string' || typeName === 'number') {
            if (!isEditing) {
                return (
                    <Grid item xs={12} key={field}>
                        <Typography style={{
                            direction: `${CurrentAppTranslation.direction}`,
                        }}>
                            <strong>
                                {`${CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}: `}
                            </strong>
                            {data[field]}
                        </Typography>
                    </Grid>
                )
            }

            return (
                <TextField key={`${field}-text-field-key`}
                    style={{
                        width: '100%',
                        marginBottom: '1rem',
                        direction: `${CurrentAppTranslation.direction}`,
                    }}
                    name={field}
                    variant='standard'
                    disabled={!isEditing}
                    type={'text'}
                    label={CurrentAppTranslation[field as keyof (typeof CurrentAppTranslation)]}
                    value={data[field] ?? ''}
                    onChange={(e) => { handleInputChange(e as any) }}
                    required />
            );
        }
        return null;
    });
};

export default RenderAllFields;
