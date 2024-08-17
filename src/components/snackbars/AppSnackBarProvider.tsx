"use client";

import React from "react";
import { SnackbarProvider } from "notistack";

export default function AppSnackBarProvider(props: { children: JSX.Element }) {
  return (
    <SnackbarProvider
      anchorOrigin={{
        horizontal: "right",
        vertical: "bottom",
      }}
      maxSnack={3}
    >
      {props.children}
    </SnackbarProvider>
  );
}
