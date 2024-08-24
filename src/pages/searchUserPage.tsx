import { useEffect, useState } from 'react';
import {
    TextField,
    List,
    ListItem,
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
import { CurrentAppTranslation } from '../translations/appTranslation';
import { autoSetWindowTitle } from '../utils/commonUtils';

const RenderUsersList = (users: SearchedUserInfo[] | undefined, forEdit: boolean = false) => {
    if (!users || users.length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
                {forEdit ? CurrentAppTranslation.EnterSearchForEdit : 
                    CurrentAppTranslation.NoResultsFoundText}
            </Typography>
        );
    }

    return (
        <List>
            {users.map((user) => (
                <ListItem key={user.user_id} sx={{ mb: 2 }}>
                    <Paper
                        elevation={3}
                        sx={{ width: '100%', p: 2, borderRadius: 2 }}
                        onClick={
                            () => {
                                // Redirect to user info page, make sure to query encode it
                                window.location.href = `/userInfo?userId=${encodeURIComponent(user.user_id!)}`;
                            }
                        }>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.user_id}: ${user.user_id}`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.email}: ${user.email}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.full_name}: ${user.full_name}`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.created_at}: ${timeAgo(user.created_at!)}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </ListItem>
            ))}
        </List>
    )
}

const SearchUserPage = () => {
    const urlSearch = new URLSearchParams(window.location.search);
    const providedQuery = urlSearch.get('query');
    const providedPage = urlSearch.get('page');
    const forEdit = (urlSearch.get('edit') ?? "false") === "true";

    const [query, setQuery] = useState(providedQuery ?? '');
    const [users, setUsers] = useState<SearchedUserInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState<number>(providedPage ? parseInt(providedPage) - 1 : 0);
    const [totalPages, setTotalPages] = useState(page + 1);
    const limit = 10;

    const handleSearch = async (newPage = 0) => {
        window.history.pushState(
            `searchUser_query_${query}`,
            "Search User",
            `/searchUser?query=${encodeURIComponent(query)}&page=${newPage + 1}`,
        );

        if (query === '') {
            return;
        }

        setIsLoading(true);
        const results = await apiClient.searchUser({
            query: query,
            offset: newPage * limit,
            limit: limit,
        })

        if (!results || !results.users) {
            setIsLoading(false);
            return;
        }

        // we need to do setTotalPages dynamically, e.g. if the limit is reached,
        // we should add one more page. if the amount of results returned is less than
        // the limit, we shouldn't increment the total pages.
        const newTotalPages = results.users.length < limit ? (newPage + 1) : newPage + 2;
        setTotalPages(newTotalPages);

        setPage(newPage);
        setUsers(results.users!);
        setIsLoading(false);
    };

    useEffect(() => {
        // if at first the query is not null (e.g. the providedQuery exists),
        // do the search.
        if (query) {
            handleSearch(page);
        }

        autoSetWindowTitle();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                        label={CurrentAppTranslation.SearchUsersText}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={() => handleSearch()} disabled={isLoading}>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                    {isLoading ? (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            margin: '0 auto',
                            mt: 4,
                        }}>
                            <CircularProgress size={60} />
                        </Box>
                    ) : RenderUsersList(users, forEdit)}
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