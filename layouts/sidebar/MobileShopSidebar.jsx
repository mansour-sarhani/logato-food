import Link from 'next/link';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import RedoIcon from '@mui/icons-material/Redo';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';
import ShopInfo from '@/components/shop/ShopInfo';
import ShopComments from '@/components/shop/ShopComments';
import InfoIcon from '@mui/icons-material/Info';

export default function MobileShopSidebar(props) {
    const { shop, user } = props;

    const toggleDrawer = (open) => () => {
        const drawer = document.querySelector('.mobile-bottom-drawer');
        if (drawer) {
            if (open) {
                drawer.classList.add('open');
            } else {
                drawer.classList.remove('open');
            }
        }
    };

    return (
        <div className="mobile-bottom-app-bar">
            <AppBar className="mobile-footer mobile-shop-footer">
                <Toolbar className="mobile-bottom-toolbar">
                    <Link href={'/'}>
                        <Button className="mobile-bottom-util-button">
                            <HomeIcon />
                            صفحه اصلی
                        </Button>
                    </Link>

                    <Fab
                        className="mobile-bottom-main-button"
                        aria-label="search"
                        onClick={toggleDrawer(true)}
                    >
                        <InfoIcon />
                    </Fab>

                    <Link href={'/search-results'}>
                        <Button className="mobile-bottom-util-button">
                            <RedoIcon />
                            بازگشت
                        </Button>
                    </Link>
                </Toolbar>
            </AppBar>

            <div className="mobile-bottom-drawer">
                <div className="mobile-bottom-drawer-header">
                    <div className="mobile-bottom-drawer-text">
                        <Typography variant="h6">جزییات فروشگاه</Typography>
                    </div>

                    <div className="mobile-bottom-drawer-close">
                        <IconButton onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="mobile-shop-info">
                    <ShopInfo shop={shop} />
                    <ShopComments shop={shop} user={user} />
                </div>
            </div>
        </div>
    );
}
