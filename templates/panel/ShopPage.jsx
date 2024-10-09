'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import getShopById from '@/functions/shop/getShopById';
import NoData from '@/components/global/NoData';
import PanelShopView from '@/components/panel/PanelShopView';
import LTProgress from '@/components/global/LTProgress';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function ShopPage() {
    const [shop, setShop] = useState(null);
    const [doReload, setDoReload] = useState(true);
    const [underReview, setUnderReview] = useState(false);

    const user = useSelector((state) => state.user.data);
    const searchParams = useSearchParams();
    const newShop = searchParams.get('new');

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (!user) return;

        if (!user.shopId) {
            return;
        }

        if (doReload) {
            async function fetchData() {
                await getShopById(
                    dispatch,
                    enqueueSnackbar,
                    user.shopId,
                    setShop
                );
            }
            fetchData();
            setDoReload(false);
        }
    }, [user, doReload]);

    useEffect(() => {
        if (newShop === 'true') {
            setUnderReview(true);
        }
    }, [newShop]);

    return !user ? (
        <LTProgress />
    ) : (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">مدیریت فروشگاه</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید فروشگاه خود را مدیریت کنید.
                    </Typography>
                </div>
                <div className="panel-inner-header-btns">
                    {!shop ? (
                        <Button variant="contained" color="primary">
                            <Link href="/panel/shop/new">
                                <AddIcon />
                                ایجاد فروشگاه
                            </Link>
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="contained"
                                color="success"
                                disabled={shop.status !== 'active'}
                            >
                                <Link href={`/shop/${shop.id}`}>
                                    <VisibilityIcon />
                                    مشاهده فروشگاه
                                </Link>
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={shop.status !== 'active'}
                            >
                                <Link href={`/panel/shop/edit/${shop.id}`}>
                                    <EditIcon />
                                    ویرایش فروشگاه
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="panel-inner-content">
                {underReview && (
                    <Alert severity="info" sx={{ marginBottom: '10px' }}>
                        فروشگاه شما در صف بازبینی برای انتشار قرار دارد.
                    </Alert>
                )}
                {!user.shopId ? <NoData /> : <PanelShopView shop={shop} />}
            </div>
        </div>
    );
}
