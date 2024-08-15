import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface SimpleSnackbarProps {
    snackMessage: string;
    children?: React.ReactNode;
    style?: React.CSSProperties;
    buttonText?: string;
    isOpen?: boolean;
    setIsOpen?: (value: boolean) => void;
    autoHideDuration?: number;
};

const SimpleSnackbar: React.FC<SimpleSnackbarProps> = ({ ...props }) => {
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        props.setIsOpen?.(false);
    };

    const action = (
        <React.Fragment>
            {props.buttonText && <Button color="secondary" size="medium" onClick={handleClose}>
                {props.buttonText}
            </Button>}
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Snackbar
            open={props.isOpen ?? false}
            autoHideDuration={props.autoHideDuration}
            onClose={handleClose}
            message={props.snackMessage}
            action={action}
        />
    );
}

export default SimpleSnackbar;
