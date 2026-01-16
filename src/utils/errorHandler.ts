/**
 * Extracts the actual error message from API response
 * Handles various error response formats including validation errors
 */
export const getErrorMessage = (error: any, fallback: string = "An error occurred. Please try again."): string => {
    // Check for issues array first (validation errors from backend)
    if (error?.data?.error?.issues?.[0]?.message) {
        return error.data.error.issues[0].message;
    }

    // Check for direct error message (not generic "Internal Server Error")
    if (error?.data?.message && error.data.message !== "Internal Server Error") {
        return error.data.message;
    }

    // Check for Firebase/client-side error message
    if (error?.message) {
        // Clean up Firebase error messages (remove "Firebase: " prefix)
        const msg = error.message;
        if (msg.startsWith("Firebase: ")) {
            return msg.slice(10);
        }
        return msg;
    }

    return fallback;
};
