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
import IconButton from '@mui/material/IconButton';
import { SearchedTopicInfo } from '../api';
import apiClient from '../apiClient';
import DashboardContainer from '../components/containers/dashboardContainer';
import { CurrentAppTranslation } from '../translations/appTranslation';

const RenderTopicsList = (topics: SearchedTopicInfo[] | undefined, forEdit: boolean = false) => {
    if (!topics || topics.length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
                {forEdit ? CurrentAppTranslation.EnterSearchForEdit : 
                    CurrentAppTranslation.NoResultsFoundText}
            </Typography>
        );
    }

    return (
        <List>
            {topics.map((topic) => (
                <ListItem key={topic.topic_id} sx={{ mb: 2 }}>
                    <Paper
                        elevation={3}
                        sx={{ width: '100%', p: 2, borderRadius: 2 }}
                        onClick={
                            () => {
                                // Redirect to user info page, make sure to query encode it
                                window.location.href = `/topicInfo?topicId=${encodeURIComponent(topic.topic_id!)}`;
                            }
                        }>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.topic_id}: ${topic.topic_id}`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.topic_name}: ${topic.topic_name}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </ListItem>
            ))}
        </List>
    )
}

const SearchTopicPage = () => {
    const urlSearch = new URLSearchParams(window.location.search);
    const providedQuery = urlSearch.get('query');
    const forEdit = (urlSearch.get('edit') ?? "false") === "true";

    const [query, setQuery] = useState(providedQuery ?? '');
    const [topics, setTopics] = useState<SearchedTopicInfo[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        window.history.pushState(
            `searchTopic_query_${query}`,
            "Search Topic",
            `/searchTopic?query=${encodeURIComponent(query)}`,
        );

        if (query === '') {
            return;
        }

        setIsLoading(true);
        const results = await apiClient.searchTopic({
            topic_name: query,
        })

        if (!results || !results.topics) {
            setIsLoading(false);
            return;
        }

        setTopics(results.topics);
        setIsLoading(false);
    };

    useEffect(() => {
        // if at first the query is not null (e.g. the providedQuery exists),
        // do the search.
        if (query) {
            handleSearch();
        }
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
                        label={CurrentAppTranslation.SearchTopicsText}
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
                    ) : RenderTopicsList(topics, forEdit)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                </Box>
            </Box>
        </DashboardContainer>
    );
};

export default SearchTopicPage;