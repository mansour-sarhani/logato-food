'use client';

import { SnackbarProvider } from 'notistack';

export default function SnackProviders({ children }) {
    return (
        <SnackbarProvider
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            maxSnack={10}
        >
            {children}
        </SnackbarProvider>
    );
}
