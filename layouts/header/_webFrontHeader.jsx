import Link from 'next/link';
import Logo from '@/components/global/Logo';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import HeaderAddress from '@/components/global/HeaderAddress';

export default function WebFrontHeader(props) {
    const { user, isHome, isDarkMode, toggleDarkMode, handleLogout } = props;

    return (
        <header
            className={isHome ? 'header home-header' : 'header front-header'}
        >
            <div className="lt-container">
                <div className="header-container">
                    <div className="header-menu front-menu">
                        <ul>
                            <li className="menu-item link-item">
                                <Link href="/">
                                    <HomeOutlinedIcon />
                                    خانه
                                </Link>
                            </li>
                            {user && (
                                <li className="menu-item link-item">
                                    <HeaderAddress />
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="header-logo">
                        <Link href={'/'}>
                            <Logo
                                color={isHome || isDarkMode ? 'white' : 'black'}
                                width={243}
                                height={50}
                            />
                        </Link>
                    </div>
                    <div className="header-menu front-menu left-menu">
                        <ul>
                            {user ? (
                                <>
                                    <li className="menu-item button-item">
                                        <Button
                                            variant="text"
                                            color="error"
                                            onClick={handleLogout}
                                        >
                                            <LogoutOutlinedIcon />
                                            خروج
                                        </Button>
                                    </li>
                                    <li className="menu-item link-item">
                                        <Link href="/panel/profile">
                                            <DashboardCustomizeOutlinedIcon />
                                            پنل کاربری
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="menu-item link-item">
                                        <Link href="/auth/register">
                                            <HowToRegOutlinedIcon />
                                            ثبت نام
                                        </Link>
                                    </li>
                                    <li className="menu-item link-item">
                                        <Link href="/auth/login">
                                            <VpnKeyOutlinedIcon />
                                            ورود
                                        </Link>
                                    </li>
                                </>
                            )}

                            <li
                                className="menu-item button-item"
                                style={{ marginLeft: 0 }}
                            >
                                <Tooltip
                                    title={isDarkMode ? 'حالت روز' : 'حالت شب'}
                                >
                                    <Button
                                        variant="text"
                                        onClick={toggleDarkMode}
                                        className="header-util-button"
                                    >
                                        {isDarkMode ? (
                                            <LightModeOutlinedIcon />
                                        ) : (
                                            <DarkModeOutlinedIcon />
                                        )}
                                    </Button>
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}
