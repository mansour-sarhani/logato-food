import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import FA from '@/utils/localizationFa';
import { getMenuItemClass } from '@/utils/getMenuItemClass';
import LTImage from '@/components/global/LTImage';
import Typography from '@mui/material/Typography';

export default function PanelSidebar({ user }) {
    const path = usePathname();

    return (
        <div className="panel-sidebar-container">
            <div className="panel-sidebar-top">
                <div className="panel-sidebar-avatar">
                    {user.avatar.img === '' ? (
                        <Image
                            src="/assets/images/front/avatar.png"
                            alt="user-avatar"
                            width={50}
                            height={50}
                            style={{ borderRadius: '50%' }}
                        />
                    ) : (
                        <LTImage
                            name={user.avatar}
                            variant="circle"
                            width={50}
                            height={50}
                        />
                    )}
                </div>
                <div className="panel-sidebar-top-text">
                    <Typography variant="h6">
                        {user.firstName} {user.lastName}
                    </Typography>
                    <Typography variant="span">{FA.role[user.role]}</Typography>
                </div>
            </div>
            <div className="panel-sidebar-menu">
                <ul>
                    {(user.role === 'superAdmin' || user.role === 'admin') && (
                        <>
                            <div className="panel-sidebar-separator">
                                <Typography variant="h6">پنل ادمین</Typography>
                            </div>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/city'
                                )}
                            >
                                <Link href="/panel/city">مدیریت شهرها</Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/type'
                                )}
                            >
                                <Link href="/panel/type">
                                    مدیریت نوع فروشگاه
                                </Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/category'
                                )}
                            >
                                <Link href="/panel/category">
                                    مدیریت دسته بندی
                                </Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/sub-category'
                                )}
                            >
                                <Link href="/panel/sub-category">
                                    مدیریت زیر دسته ها
                                </Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/users'
                                )}
                            >
                                <Link href="/panel/users">مدیریت کاربران</Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/shops'
                                )}
                            >
                                <Link href="/panel/shops">
                                    مدیریت فروشگاه ها
                                </Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/comments'
                                )}
                            >
                                <Link href="/panel/comments">مدیریت نظرات</Link>
                            </li>
                        </>
                    )}
                    {user.role === 'owner' && (
                        <>
                            <div className="panel-sidebar-separator">
                                <Typography variant="h6">
                                    پنل فروشگاه
                                </Typography>
                            </div>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/shop'
                                )}
                            >
                                <Link href="/panel/shop">مدیریت فروشگاه</Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/shop/products'
                                )}
                            >
                                <Link href="/panel/shop/products">
                                    مدیریت محصولات
                                </Link>
                            </li>
                            <li
                                className={getMenuItemClass(
                                    path,
                                    '/panel/shop/comments'
                                )}
                            >
                                <Link href="/panel/shop/comments">نظرات</Link>
                            </li>
                        </>
                    )}
                    <div className="panel-sidebar-separator">
                        <Typography variant="h6">پنل کاربری</Typography>
                    </div>
                    <li className={getMenuItemClass(path, '/panel/profile')}>
                        <Link href="/panel/profile">حساب کاربری</Link>
                    </li>
                    <li className={getMenuItemClass(path, '/panel/bookmark')}>
                        <Link href="/panel/bookmark">لیست علاقه مندی ها</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
