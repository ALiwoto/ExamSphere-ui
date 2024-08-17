import { SnackbarAction, SnackbarKey, useSnackbar } from "notistack";
import SnackbarButtons from "./SnackbarButtons";

interface AppSnackbarProps {
  action?: SnackbarAction;
  key?: SnackbarKey;
  hideDuration?: number;
  preventAutoHide?: boolean;
  preventAction?: boolean;
}

const useAppSnackbar = () => {
  const { enqueueSnackbar } = useSnackbar();

  const success = (message: string, props?: AppSnackbarProps) => {
    enqueueSnackbar(message, {
      variant: "success",
      key: props?.key,
      autoHideDuration: props?.preventAutoHide
        ? null
        : props?.hideDuration ?? 5 * 1000,
      action: (key) =>
        props?.preventAction
          ? undefined
          : SnackbarButtons({
              snackbarId: key,
            }),
    });
  };

  const error = (message: string, props?: AppSnackbarProps) => {
    enqueueSnackbar(message, {
      key: props?.key,
      autoHideDuration: props?.preventAutoHide
        ? null
        : props?.hideDuration ?? 20 * 1000,
      variant: "error",
      action: (key) =>
        props?.preventAction
          ? undefined
          : SnackbarButtons({
              snackbarId: key,
            }),
    });
  };

  const warning = (message: string, props?: AppSnackbarProps) => {
    enqueueSnackbar(message, {
      variant: "warning",
      key: props?.key,
      autoHideDuration: props?.preventAutoHide
        ? null
        : props?.hideDuration ?? 20 * 1000,
      action: (key) =>
        props?.preventAction
          ? undefined
          : SnackbarButtons({
              snackbarId: key,
            }),
    });
  };

  return {
    success,
    error,
    warning,
  };
};

export default useAppSnackbar;
