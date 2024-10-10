import { useState } from 'react';
import Link from 'next/link';
import HeaderAddress from '@/components/global/HeaderAddress';
import Logo from '@/components/global/Logo';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import VpnKeyOutlinedIcon from '@mui/icons-material/VpnKeyOutlined';
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function MobileFrontHeader(props) {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const { user, isDarkMode, toggleDarkMode, handleLogout } = props;

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar className="mobile-header mobile-front-header">
                <Toolbar className="mobile-toolbar">
                    <div className="mobile-header-logo">
                        <Link href={'/'}>
                            <Logo
                                color={isDarkMode ? 'white' : 'black'}
                                width={193}
                                height={40}
                            />
                        </Link>
                    </div>

                    <div className="mobile-header-btns">
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleMenu}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            {user ? (
                                <>
                                    <MenuItem onClick={handleClose}>
                                        <Link href={'/panel/profile'}>
                                            پروفایل کاربری
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        خروج
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={handleClose}>
                                        <Link href={'/auth/register'}>
                                            ثبت نام
                                        </Link>
                                    </MenuItem>
                                    <MenuItem onClick={handleClose}>
                                        <Link href={'/auth/login'}>ورود</Link>
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                        <IconButton
                            size="large"
                            edge="end"
                            onClick={toggleDarkMode}
                            className="mobile-header-btn"
                        >
                            {isDarkMode ? (
                                <LightModeOutlinedIcon />
                            ) : (
                                <DarkModeOutlinedIcon />
                            )}
                        </IconButton>

                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="mobile drawer"
                            className="mobile-header-btn"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </div>
                </Toolbar>
            </AppBar>

            <Drawer
                open={open}
                onClose={toggleDrawer(false)}
                anchor={'left'}
                className="mobile-drawer"
            >
                <div className="mobile-drawer-header">
                    <div className="mobile-drawer-logo">
                        <Link href={'/'}>
                            <Logo
                                color={isDarkMode ? 'white' : 'black'}
                                width={193}
                                height={40}
                            />
                        </Link>
                    </div>
                </div>

                <div className="mobile-drawer-menu">
                    <ul>
                        <li className="menu-item link-item">
                            <Link href="/">
                                <HomeOutlinedIcon />
                                خانه
                            </Link>
                        </li>
                        {user ? (
                            <>
                                <li className="menu-item link-item">
                                    <Link href="/panel/profile">
                                        <DashboardCustomizeOutlinedIcon />
                                        پنل کاربری
                                    </Link>
                                </li>
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

                        {user && (
                            <li className="menu-item link-item">
                                <HeaderAddress />
                            </li>
                        )}
                    </ul>
                </div>
            </Drawer>
        </>
    );
}
