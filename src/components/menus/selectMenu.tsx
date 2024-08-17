
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


interface SelectMenuProps {
    options: string[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    name: string;
    labelId?: string;
    labelText: string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ ...props }) => {
    return (
        <Box sx={{ 
            minWidth: 120,
            width: '100%',
            marginBottom: '1rem',
        }}>
            <FormControl fullWidth>
                <InputLabel id={props.labelId ?? 'select-label'}>{props.labelText}</InputLabel>
                <Select
                    labelId={props.labelId ?? 'select-label'}
                    id="simple-select"
                    value={props.value}
                    label={props.labelText}
                    name={props.name}
                    onChange={(e) => props.onChange(e as any)}
                >
                    {props.options.map((option, index) => (
                        <MenuItem key={index} value={option}>{option}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
};

export default SelectMenu;