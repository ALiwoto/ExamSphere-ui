import { Close } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { closeSnackbar } from "notistack";
import React from "react";
import "./SnackbarButtons.css";

interface SnackbarButtonsProps {
  snackbarId: string | number;
}

export default function SnackbarButtons(props: SnackbarButtonsProps) {
  const { snackbarId } = props;
  return (
    <IconButton
      onClick={() => closeSnackbar(snackbarId)}
      sx={{
        color: "white",
        opacity: "0.4",
        "&:hover": {
          bgcolor: "unset",
          opacity: "1",
        },
      }}
    >
      <Close />
    </IconButton>
  );
}
