import { useEffect, useReducer, useState } from 'react';
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
import { SearchedExamInfo } from '../api';
import apiClient from '../apiClient';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import { timeAgo } from '../utils/timeUtils';
import { CurrentAppTranslation } from '../translations/appTranslation';
import { autoSetWindowTitle } from '../utils/commonUtils';
import { extractErrorDetails } from '../utils/errorUtils';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';

export var forceUpdateSearchExamPage = () => {};

const PageLimit = 10;

const RenderExamsList = (courses: SearchedExamInfo[] | undefined, forEdit: boolean = false) => {
    if (!courses || courses.length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
                {forEdit ? CurrentAppTranslation.EnterSearchForEdit : 
                    CurrentAppTranslation.NoResultsFoundText}
            </Typography>
        );
    }

    return (
        <List>
            {courses.map((course) => (
                <ListItem key={course.course_id} sx={{ mb: 2 }}>
                    <Paper
                        elevation={3}
                        sx={{ width: '100%', p: 2, borderRadius: 2 }}
                        onClick={
                            () => {
                                // Redirect to course info page, make sure to query encode it
                                window.location.href = `/examInfo?examId=${
                                    encodeURIComponent(course.exam_id!)
                                }`;
                            }
                        }>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.exam_id}: ${course.exam_id}`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.exam_title}: ${course.exam_title}`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.course_id}: ${course.course_id}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.exam_description}: ${course.exam_description}`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.created_at}: ${timeAgo(course.created_at!)}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </ListItem>
            ))}
        </List>
    )
}

const SearchExamPage = () => {
    const urlSearch = new URLSearchParams(window.location.search);
    const providedQuery = urlSearch.get('query');
    const providedPage = urlSearch.get('page');
    const forEdit = (urlSearch.get('edit') ?? "false") === "true";

    const [query, setQuery] = useState(providedQuery ?? '');
    const [courses, setCourses] = useState<SearchedExamInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [, setForceUpdate] = useReducer(x => x + 1, 0);
    const [page, setPage] = useState<number>(providedPage ? parseInt(providedPage) - 1 : 0);
    const [totalPages, setTotalPages] = useState(page + 1);
    const snackbar = useAppSnackbar();

    forceUpdateSearchExamPage = () => setForceUpdate();

    const handleSearch = async (newPage = 0) => {
        window.history.pushState(
            `searchExam_query_${query}`,
            "Search Exam",
            `${window.location.pathname}?query=${
                encodeURIComponent(query)
            }&page=${newPage + 1}`,
        );

        setIsLoading(true);
        try {
            const results = await apiClient.searchExam({
                search_query: query,
                offset: newPage * PageLimit,
                limit: PageLimit,
            })
    
            if (!results || !results.exams) {
                setIsLoading(false);
                return;
            }
    
            // we need to do setTotalPages dynamically, e.g. if the limit is reached,
            // we should add one more page. if the amount of results returned is less than
            // the limit, we shouldn't increment the total pages.
            const newTotalPages = results.exams.length < PageLimit ? (newPage + 1) : newPage + 2;
            setTotalPages(newTotalPages);
    
            setPage(newPage);
            setCourses(results.exams!);
            setIsLoading(false);
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`Failed (${errCode}): ${errMessage}`);
            setIsLoading(false);
            return;
        }
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
                        label={CurrentAppTranslation.SearchCoursesText}
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
                    ) : RenderExamsList(courses, forEdit)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                    <Pagination
                        count={totalPages} page={page + 1} onChange={(_, newPage) => handleSearch(newPage - 1)} />
                </Box>
            </Box>
        </DashboardContainer>
    );
};

export default SearchExamPage;