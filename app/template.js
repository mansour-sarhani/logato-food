'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { setViewPort } from '@/redux/features/publicSlice';
import getUser from '@/functions/user/getUser';
import Loading from '@/components/global/Loading';
import Header from '@/layouts/header/Header';
import PanelSidebar from '@/layouts/sidebar/PanelSidebar';
import { useMediaQuery } from '@mui/system';

export default function RootTemplate({ children }) {
    const [user, setUser] = useState(null);
    const [isPanel, setIsPanel] = useState(null);
    const [isHome, setIsHome] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const isDesktop = useMediaQuery('(min-width:992px)');
    const isTablet = useMediaQuery('(min-width:768px) and (max-width:991px)');
    const isMobile = useMediaQuery('(max-width:480px)');

    const currentToken = Cookies.get('logato_token');

    useEffect(() => {
        if (currentToken) {
            setIsLoading(true);
            async function fetchUser() {
                try {
                    await getUser(dispatch, enqueueSnackbar, setUser);
                } catch (error) {
                    setUser(false);
                } finally {
                    setIsLoading(false);
                }
            }
            fetchUser();
        } else {
            setUser(false);
            setIsLoading(false);
        }
    }, [currentToken]);

    useEffect(() => {
        if (isDesktop) {
            dispatch(setViewPort({ viewPort: 'desktop' }));
        } else if (isTablet) {
            dispatch(setViewPort({ viewPort: 'tablet' }));
        } else if (isMobile) {
            dispatch(setViewPort({ viewPort: 'mobile' }));
        }
    }, [isDesktop, isTablet, isMobile]);

    useEffect(() => {
        if (user === false && pathname.startsWith('/panel/')) {
            router.push('/auth/login');
        }
    }, [user, pathname, router]);

    useEffect(() => {
        if (pathname === '/') {
            setIsHome(true);
            setIsPanel(false);
        } else if (pathname.startsWith('/panel')) {
            setIsHome(false);
            setIsPanel(true);
        } else {
            setIsHome(false);
            setIsPanel(false);
        }
    }, [pathname]);

    if (isLoading || isPanel === null || user === null) {
        return <Loading isLoading={true} />;
    }

    return (
        <div className="main">
            {isPanel ? (
                <div className="panel-page-wrapper">
                    <div className="panel-header">
                        <Header isHome={isHome} isPanel={isPanel} />
                    </div>
                    <div className="panel-sidebar">
                        <PanelSidebar user={user} />
                    </div>
                    <div className="panel-content">{children}</div>
                </div>
            ) : (
                <>
                    <Header isHome={isHome} isPanel={isPanel} />
                    {children}
                </>
            )}
        </div>
    );
}
