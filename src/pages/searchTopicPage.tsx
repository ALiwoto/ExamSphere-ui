import { useEffect, useState, Fragment, useReducer } from 'react';
import {
    TextField,
    List,
    ListItem,
    CircularProgress,
    Paper,
    Grid,
    Typography,
    Button,
} from '@mui/material';
import { Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import { SearchedTopicInfo } from '../api';
import apiClient from '../apiClient';
import { DashboardContainer } from '../components/containers/dashboardContainer';
import { CurrentAppTranslation } from '../translations/appTranslation';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import useAppSnackbar from '../components/snackbars/useAppSnackbars';
import { extractErrorDetails } from '../utils/errorUtils';
import { autoSetWindowTitle } from '../utils/commonUtils';

interface DeleteDialogueProps {
    target_topic_id: number;
    handleDelete: (topic_id: number) => Promise<void>;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    fullScreen: boolean;
}

var currentDeleteProps: DeleteDialogueProps | null = null;
var confirmedDeleteTopicId: number = 0;

export var forceUpdateSearchTopicPage = () => { };

const DeleteDialogueComponent = () => {
    const props = currentDeleteProps;
    if (!props) {
        return null;
    }

    const handleClose = () => {
        props.setIsOpen(false);
        currentDeleteProps = null;
        confirmedDeleteTopicId = 0;
    };

    return (
        <Fragment>
            <Dialog
                fullScreen={props.fullScreen}
                open={props.isOpen}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {CurrentAppTranslation.AreYouSureDeleteTopicText}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {CurrentAppTranslation.DeleteTopicDescriptionText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        {CurrentAppTranslation.CancelButtonText}
                    </Button>
                    <Button onClick={async () => {
                        await props.handleDelete(props.target_topic_id);
                        handleClose();
                    }} autoFocus>
                        {CurrentAppTranslation.DeleteTopicButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}

const RenderTopicsList = (
    topics: SearchedTopicInfo[] | undefined, handleDelete: (topicId: number) => Promise<void>) => {
    if (!topics || topics.length === 0) {
        return (
            <Typography variant="body2" sx={{ textAlign: 'center', mt: 4 }}>
                {CurrentAppTranslation.SearchSomethingForTopicsText}
            </Typography>
        );
    }

    return (
        <List>
            {topics.map((topic) => (
                <ListItem key={topic.topic_id} sx={{ mb: 2 }}>
                    <Paper
                        elevation={3}
                        sx={{ width: '100%', p: 2, borderRadius: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" sx={
                                    {
                                        fontFamily: `${CurrentAppTranslation.fontFamily}`,
                                    }
                                }>
                                    {`${CurrentAppTranslation.topic_id}: ${topic.topic_id}`}
                                </Typography>
                                <Typography variant="body2">
                                    {`${CurrentAppTranslation.topic_name}: ${topic.topic_name}`}
                                </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: 'red' }}
                                    onClick={() => handleDelete(topic.topic_id!)}
                                >
                                    Delete
                                </Button>
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

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [query, setQuery] = useState(providedQuery ?? '');
    const [topics, setTopics] = useState<SearchedTopicInfo[]>([]);
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const [isDeleteDialogueOpen, setIsDeleteDialogueOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialogue, setDeleteDialogue] = useState<any>(null);
    const snackbar = useAppSnackbar();

    forceUpdateSearchTopicPage = () => forceUpdate();

    const handleSearch = async () => {
        window.history.pushState(
            `searchTopic_query_${query}`,
            "Search Topic",
            `/searchTopic?query=${encodeURIComponent(query)}`,
        );

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

    const handleDelete = async (topicId: number) => {
        if (!confirmedDeleteTopicId) {
            setIsDeleteDialogueOpen(true);
            confirmedDeleteTopicId = topicId;
            currentDeleteProps = {
                target_topic_id: topicId,
                handleDelete: handleDelete,
                isOpen: true,
                setIsOpen: setIsDeleteDialogueOpen,
                fullScreen: fullScreen,
            };
            setDeleteDialogue(DeleteDialogueComponent);
            return;
        }
        confirmedDeleteTopicId = 0;
        setDeleteDialogue(null);
        currentDeleteProps = null;
        setIsDeleteDialogueOpen(false);

        setIsLoading(true);

        try {
            const deleteResult = await apiClient.deleteTopic(topicId);
            if (deleteResult) {
                await handleSearch();
                snackbar.success(CurrentAppTranslation.TopicDeletedSuccessfullyText);
            }
        } catch (error: any) {
            const [errCode, errMessage] = extractErrorDetails(error);
            snackbar.error(`(${errCode}): ${errMessage}`);
        }

    }

    useEffect(() => {
        // if at first the query is not null (e.g. the providedQuery exists),
        // do the search.
        if (query) {
            handleSearch();
        }

        autoSetWindowTitle();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <DashboardContainer>
            {(deleteDialogue && isDeleteDialogueOpen) ? deleteDialogue : null}
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
                    ) : RenderTopicsList(topics, handleDelete)}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', margin: '0 auto', }}>
                </Box>
            </Box>
        </DashboardContainer>
    );
};

export default SearchTopicPage;