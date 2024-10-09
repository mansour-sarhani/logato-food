import Link from 'next/link';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import HeaderAddress from '@/components/global/HeaderAddress';

export default function WebPanelHeader(props) {
    const { isDarkMode, toggleDarkMode, handleLogout } = props;

    return (
        <header className="panel-header-container">
            <div className="panel-header-menu">
                <ul>
                    <li className="menu-item link-item">
                        <Link href="/">
                            <HomeOutlinedIcon />
                            صفحه اصلی
                        </Link>
                    </li>
                    <li className="menu-item link-item">
                        <HeaderAddress />
                    </li>
                </ul>
            </div>
            <div className="panel-header-menu">
                <ul>
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
                    <li className="menu-item util-item">
                        <Tooltip title={isDarkMode ? 'حالت روز' : 'حالت شب'}>
                            <Button
                                variant="text"
                                onClick={toggleDarkMode}
                                className="header-util-button"
                            >
                                {isDarkMode ? (
                                    <LightModeOutlinedIcon />
                                ) : (
                                    <DarkModeIcon />
                                )}
                            </Button>
                        </Tooltip>
                    </li>
                </ul>
            </div>
        </header>
    );
}
