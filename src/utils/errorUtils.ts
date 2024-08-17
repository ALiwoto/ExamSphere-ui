

// extractErrorDetails function takes an error object and returns the error code and 
// error message from the error object.
// In future, this function may use a translation function to translate the error code
// and error message to a user-friendly message.
export function extractErrorDetails(error: any): [number, string] {
    const errCode = error.response?.data?.error?.code ?? error.response?.status;
    const errMessage = error.response?.data?.error?.message ?? error.response?.statusText;
    return [(errCode as number), (errMessage as string)];
}
