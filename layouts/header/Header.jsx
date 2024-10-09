import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '@/redux/features/publicSlice';
import { useRouter } from 'next/navigation';
import userLogout from '@/functions/auth/userLogout';
import WebPanelHeader from '@/layouts/header/_webPanelHeader';
import MobilePanelHeader from '@/layouts/header/_mobilePanelHeader';
import WebFrontHeader from '@/layouts/header/_webFrontHeader';
import MobileFrontHeader from '@/layouts/header/_mobileFrontHeader';

export default function Header({ isPanel, isHome }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const user = useSelector((state) => state.user.data);
    const viewPort = useSelector((state) => state.public.viewPort);

    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogout = async () => {
        await userLogout(enqueueSnackbar, router);
    };

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
        dispatch(toggleTheme({ theme: isDarkMode ? 'light' : 'dark' }));
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
                setIsDarkMode(true);
                dispatch(toggleTheme({ theme: 'dark' }));
            } else {
                setIsDarkMode(false);
                dispatch(toggleTheme({ theme: 'light' }));
            }
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    if (isPanel) {
        if (viewPort === 'desktop') {
            return (
                <WebPanelHeader
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleLogout={handleLogout}
                />
            );
        } else {
            return (
                <MobilePanelHeader
                    user={user}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleLogout={handleLogout}
                />
            );
        }
    } else {
        if (viewPort === 'desktop') {
            return (
                <WebFrontHeader
                    user={user}
                    isHome={isHome}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleLogout={handleLogout}
                />
            );
        } else {
            return (
                <MobileFrontHeader
                    user={user}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    handleLogout={handleLogout}
                />
            );
        }
    }
}
