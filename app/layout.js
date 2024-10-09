import '@/styles/globals.css';
import '@/styles/fonts.css';
import '@/styles/dark.css';
import '@/styles/rtl.css';
import 'leaflet/dist/leaflet.css';
import '@/styles/styles.css';

import theme from './theme';
import { ReduxProviders } from '@/redux/ReduxProviders';
import SnackProviders from '@/components/global/SnackProviders';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export default function RootLayout({ children }) {
    return (
        <html dir="rtl">
            <body>
                <ReduxProviders>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <CssBaseline />
                            <SnackProviders>{children}</SnackProviders>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </ReduxProviders>
            </body>
        </html>
    );
}
