'use client';

import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import getShopById from '@/functions/shop/getShopById';
import LTProgress from '@/components/global/LTProgress';
import LTImage from '@/components/global/LTImage';
import ProductItem from '@/components/shop/ProductItem';
import ShopInfo from '@/components/shop/ShopInfo';
import ShopComments from '@/components/shop/ShopComments';
import Bookmark from '@/components/global/Bookmark';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

export default function ShopSinglePage({ id }) {
    const [shop, setShop] = useState(null);

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const user = useSelector((state) => state.user.data);

    useEffect(() => {
        if (id) {
            async function fetchShop() {
                getShopById(dispatch, enqueueSnackbar, id, setShop);
            }
            fetchShop();
        }
    }, [id]);

    useEffect(() => {
        if (shop) {
            document.title = shop.name;
        }
    }, [shop]);

    return !shop ? (
        <LTProgress />
    ) : (
        <div className="inner-page shop-single-page">
            <div className="lt-container">
                <div className="page-wrapper front-page-wrapper">
                    <div className="sidebar">
                        <ShopInfo shop={shop} />
                        <ShopComments shop={shop} user={user} />
                    </div>
                    <div className="content">
                        <div className="shop-single">
                            <div className="shop-cover">
                                <LTImage
                                    name={shop.cover}
                                    alt={shop.name}
                                    fill
                                />
                            </div>
                            <div className="shop-heading">
                                <div className="shop-logo">
                                    <LTImage
                                        name={shop.logo}
                                        alt={shop.name}
                                        width={80}
                                        height={80}
                                        variant="circle"
                                    />
                                </div>
                                <div className="shop-name">
                                    <div className="shop-title">
                                        <Typography variant="h1">
                                            {shop.name}
                                        </Typography>

                                        {user && (
                                            <Bookmark
                                                id={shop.id}
                                                type="shop"
                                            />
                                        )}
                                    </div>
                                    <div className="shop-rating">
                                        <Rating
                                            name="read-only"
                                            value={shop.averageRating}
                                            precision={0.1}
                                            readOnly
                                            size="small"
                                            sx={{ direction: 'ltr' }}
                                        />
                                        <Typography variant="body2">
                                            (امتیاز: {shop.averageRating} از
                                            مجموع {shop.ratingsCount} نظر)
                                        </Typography>
                                    </div>
                                </div>
                            </div>
                            <div className="shop-products-container">
                                {shop.products.map((category) => (
                                    <div
                                        key={category._id}
                                        id={category._id}
                                        className="product-category-section"
                                    >
                                        <Typography variant="h5">
                                            {category.name}
                                        </Typography>
                                        <div className="shop-products-grid">
                                            {category.items.map((product) => (
                                                <ProductItem
                                                    key={product._id}
                                                    product={product}
                                                    shop={shop}
                                                    user={user}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
