import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';

export default function HintTextField() {
    const hint = React.useRef('');
    const [inputValue, setInputValue] = React.useState('');
    const [displayHint, setDisplayHint] = React.useState('');

    return (
        <Box sx={{ position: 'relative', width: 300 }}>
            <Typography
                sx={{
                    position: 'absolute',
                    opacity: 0.5,
                    left: 14,
                    top: 16,
                    overflow: 'hidden',
                    width: 'calc(100% - 28px)',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                }}
            >
                {inputValue + displayHint}
            </Typography>
            <TextField
                multiline
                fullWidth
                value={inputValue}
                onChange={(e) => {
                    const newValue = e.target.value;
                    setInputValue(newValue);
                    const matchingOption = top100Films.find((option) =>
                        option.label.toLowerCase().startsWith(newValue.toLowerCase())
                    );

                    if (newValue && matchingOption) {
                        hint.current = matchingOption.label;
                        setDisplayHint(matchingOption.label.slice(newValue.length));
                    } else {
                        hint.current = '';
                        setDisplayHint('');
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Tab') {
                        if (hint.current) {
                            setInputValue(hint.current);
                            event.preventDefault();
                        }
                    }
                }}
                label="Movie"
            />
        </Box>
    );
}

const top100Films = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: "Schindler's List", year: 1993 },
    { label: 'Pulp Fiction', year: 1994 }
];