import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, Typography } from '@mui/material';

export default function HintTextField() {
  const hint = React.useRef('');
  const [inputValue, setInputValue] = React.useState('');
  return (
    <Autocomplete
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          if (hint.current) {
            setInputValue(hint.current);
            event.preventDefault();
          }
        }
      }}
      onClose={() => {
        hint.current = '';
      }}
      onChange={(event: any, newValue: any) => {
        setInputValue(newValue && newValue.label ? newValue.label : '');
      }}
      disablePortal
      inputValue={inputValue}
      options={[]}
      sx={{ width: 300 }}
      renderInput={(params) => {
        return (
          <Box sx={{ position: 'relative' }}>
            <Typography
              sx={{
                position: 'absolute',
                opacity: 0.5,
                left: 14,
                top: 16,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                width: 'calc(100% - 75px)', // Adjust based on padding of TextField
              }}
            >
              {hint.current}
            </Typography>
            <TextField
              {...params}
              onChange={(e) => {
                const newValue = e.target.value;
                setInputValue(newValue);
                const matchingOption = top100Films.find((option) =>
                  option.label.startsWith(newValue),
                );

                if (newValue && matchingOption) {
                  hint.current = matchingOption.label;
                } else {
                  hint.current = '';
                }
              }}
              label="Movie"
            />
          </Box>
        );
      }}
    />
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 }
];
