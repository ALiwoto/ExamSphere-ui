import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

export default function HintTextField() {
    const hint = React.useRef('');
    const [inputValue, setInputValue] = React.useState('');
    const [displayHint, setDisplayHint] = React.useState('');
    const textFieldRef = React.useRef(null);

    return (
        <Box sx={{ position: 'relative', width: 300 }}>
            <TextField
                ref={textFieldRef}
                minRows={1}
                multiline={true}
                fullWidth={true}
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
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 16,
                        left: 14,
                        right: 14,
                        opacity: 0.5,
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                    }}
                >
                    {inputValue + displayHint}
                </div>
            </div>
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