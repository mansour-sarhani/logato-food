import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SearchSidebar from '@/layouts/sidebar/SearchSidebar';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Fab from '@mui/material/Fab';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import HomeIcon from '@mui/icons-material/Home';
import CloseIcon from '@mui/icons-material/Close';

export default function MobileSearchSidebar(props) {
    const { setData, setLimit, setPage, setTotal } = props;

    const router = useRouter();

    const resetFilters = () => {
        router.push('/search-results');

        setData();
        setLimit(10);
        setPage(1);
        setTotal(0);
    };

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
            <AppBar className="mobile-footer mobile-search-footer">
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
                        <SearchIcon />
                    </Fab>

                    <Button
                        className="mobile-bottom-util-button"
                        onClick={resetFilters}
                    >
                        <DeleteSweepIcon />
                        حذف فیلترها
                    </Button>
                </Toolbar>
            </AppBar>

            <div className="mobile-bottom-drawer">
                <div className="mobile-bottom-drawer-header">
                    <div className="mobile-bottom-drawer-text">
                        <Typography variant="h6">فیلترها</Typography>
                    </div>

                    <div className="mobile-bottom-drawer-close">
                        <IconButton onClick={toggleDrawer(false)}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                </div>

                <div className="mobile-bottom-drawer-filters">
                    <SearchSidebar
                        setData={setData}
                        setLimit={setLimit}
                        setPage={setPage}
                        setTotal={setTotal}
                    />
                </div>
            </div>
        </div>
    );
}
