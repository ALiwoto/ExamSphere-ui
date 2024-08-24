import React from 'react';
import { Box, Container, IconButton, Typography, Select, MenuItem } from '@mui/material';
import { Telegram, GitHub, Twitter } from '@mui/icons-material';
import { CurrentAppTranslation } from '../../translations/appTranslation';

interface AppFooterProps {
    setAppLanguage: (lang: string) => void;
}

const AppFooter: React.FC<AppFooterProps> = ({ ...props }) => {
    const handleLanguageChange = (event: React.ChangeEvent<{ value: any }>) => {
        props.setAppLanguage(event.target.value);
    };

    return (
        <Box component="footer" sx={{ bgcolor: 'black', color: 'white', py: 3 }}>
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <IconButton color="inherit" href="https://t.me/ALiwoto" target="_blank">
                            <Telegram />
                        </IconButton>
                        <IconButton color="inherit" href="https://github.com/ALiwoto" target="_blank">
                            <GitHub />
                        </IconButton>
                        <IconButton color="inherit" href="https://t.me/ALiwoto" target="_blank">
                            <Twitter />
                        </IconButton>
                    </Box>
                    <Select
                        value={CurrentAppTranslation.ShortLang}
                        onChange={(e) => handleLanguageChange(e as any)}
                        sx={{ color: 'white', '& .MuiSelect-icon': { color: 'white' } }}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="fa">پارسی</MenuItem>
                    </Select>
                </Box>
                <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    © {new Date().getFullYear()} {CurrentAppTranslation.CopyrightText}
                </Typography>
            </Container>
        </Box>
    );
};

export default AppFooter;