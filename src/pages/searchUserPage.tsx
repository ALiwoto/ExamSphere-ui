import React, { useState } from 'react';
import { 
    TextField, 
    Button, 
    List, 
    ListItem, 
    ListItemText, 
    CircularProgress,
    Paper,
    Grid,
    Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Pagination from '@mui/material/Pagination';
import IconButton from '@mui/material/IconButton';
import { SearchedUserInfo } from '../api';
import apiClient from '../apiClient';
import DashboardContainer from '../components/containers/dashboardContainer';
import { timeAgo } from '../utils/timeUtils';

const SearchUserPage = () => {
    const [query, setQuery] = useState('');
    const [users, setUsers] = useState<SearchedUserInfo[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    const handleSearch = async (newPage = 0) => {
        if (query === '') {
            return;
        }

        setLoading(true);
        const results = await apiClient.searchUser({
            query: query,
            offset: newPage * limit,
            limit: limit,
        })

        if (!results || !results.users) {
            setLoading(false);
            return;
        }

        // we need to do setTotalPages dynamically, e.g. if the limit is reached,
        // we should add one more page. if the amount of results returned is less than
        // the limit, we shouldn't increment the total pages.
        const newTotalPages = results.users.length < limit ? (newPage + 1) : newPage + 2;
        setTotalPages(newTotalPages);

        setPage(newPage);
        setUsers(results.users!);
        setLoading(false);
    };

    return (
        <DashboardContainer>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '80vh' }}>
                <Box sx={{ 
                    flexGrow: 1,
                    margin: '0 auto',
                    width: '100%',
                    maxWidth: '650px',
                }}>
                <TextField
                    value={query}
                    style={
                        {
                            minWidth: '100%',
                        }
                    }
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search users"
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={() => handleSearch()} disabled={loading}>
                                <SearchIcon />
                            </IconButton>
                        ),
                    }}
                />
                {loading ? (
                    <CircularProgress />
                ) : (
                    <List>
                        {users.map((user) => (
                            <ListItem key={user.user_id} sx={{ mb: 2 }}>
                            <Paper elevation={3} sx={{ width: '100%', p: 2, borderRadius: 2 }}>
                              <Grid container spacing={2}>
                                <Grid item xs={6}>
                                  <Typography variant="body2">ID: {user.user_id}</Typography>
                                  <Typography variant="body2">Email: {user.email}</Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                  <Typography variant="body2">Name: {user.full_name}</Typography>
                                  <Typography variant="body2">Created: {timeAgo(user.created_at!)}</Typography>
                                </Grid>
                              </Grid>
                            </Paper>
                          </ListItem>
                        ))}
                    </List>
                )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                <Pagination
                    count={totalPages} page={page + 1} onChange={(_, newPage) => handleSearch(newPage - 1)} />
                </Box>
            </Box>
        </DashboardContainer>
    );
};

export default SearchUserPage;