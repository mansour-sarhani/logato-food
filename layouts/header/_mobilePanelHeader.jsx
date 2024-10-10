import { useState } from 'react';
import Link from 'next/link';
import PanelSidebar from '@/layouts/sidebar/PanelSidebar';
import Logo from '@/components/global/Logo';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import AccountCircle from '@mui/icons-material/AccountCircle';

export default function MobilePanelHeader(props) {
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
            <AppBar className="mobile-header mobile-panel-header">
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
                            <MenuItem onClick={handleClose}>
                                <Link href={'/panel/profile'}>
                                    پروفایل کاربری
                                </Link>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>خروج</MenuItem>
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

                <div className="mobile-panel-menu">
                    <PanelSidebar user={user} />
                </div>
            </Drawer>
        </>
    );
}
