'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import userDeleteAddress from '@/functions/user/userDeleteAddress';
import { dateFormatter } from '@/utils/dateFormatter';
import FA from '@/utils/localizationFa';
import PanelModal from '@/components/panel/PanelModal';
import AddAddressForm from '@/components/forms/AddAddressForm';
import NoData from '@/components/global/NoData';
import LTTableFooter from '@/components/global/LTTableFooter';
import DeleteModal from '@/components/panel/DeleteModal';
import UpdateAddressForm from '@/components/forms/UpdateAddressForm';
import UpdateProfile from '@/components/forms/UpdateProfile';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function UserProfilePage() {
    const [doReload, setDoReload] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const user = useSelector((state) => state.user.data);

    const register = searchParams.get('register');
    const login = searchParams.get('login');

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleRemoveItem = async (addressId) => {
        await userDeleteAddress(dispatch, enqueueSnackbar, addressId);
        setDoReload(true);
    };

    useEffect(() => {
        if (register === 'success') {
            router.replace('/panel/profile');
            enqueueSnackbar('ثبت نام شما با موفقیت انجام شد.', {
                variant: 'success',
            });
        }
        if (login === 'success') {
            router.replace('/panel/profile');
            enqueueSnackbar('خوش آمدید.', {
                variant: 'success',
            });
        }
    }, [searchParams]);

    useEffect(() => {
        if (doReload) {
            setDoReload(false);
        }
    }, [doReload]);

    return (
        <div className="panel-content-container">
            <div className="panel-inner-header">
                <div className="panel-inner-header-text">
                    <Typography variant="h5">حساب کاربری</Typography>
                    <Typography variant="body2">
                        در این قسمت میتوانید اطلاعات حساب کاربری خود را مدیریت
                        کنید.
                    </Typography>
                </div>
                <PanelModal
                    buttonLabel="ویرایش حساب کاربری"
                    modalHeader="ویرایش حساب کاربری"
                    icon="edit"
                    data={user}
                >
                    <UpdateProfile setDoReload={setDoReload} />
                </PanelModal>
            </div>

            <div className="panel-inner-content form-content">
                <div className="panel-view-row">
                    <div className="panel-view-item">
                        <div className="panel-view-item-key">نام:</div>
                        <div className="panel-view-item-value">
                            {user.firstName}
                        </div>
                    </div>
                    <div className="panel-view-item">
                        <div className="panel-view-item-key">نام خانوادگی:</div>
                        <div className="panel-view-item-value">
                            {user.lastName}
                        </div>
                    </div>
                </div>
                <div className="panel-view-row">
                    <div className="panel-view-item">
                        <div className="panel-view-item-key">ایمیل:</div>
                        <div className="panel-view-item-value">
                            {user.email}
                        </div>
                    </div>
                    <div className="panel-view-item">
                        <div className="panel-view-item-key">تلفن:</div>
                        <div className="panel-view-item-value">
                            {user.phone ? user.phone : 'ثبت نشده'}
                        </div>
                    </div>
                </div>
                <div className="panel-view-row">
                    <div className="panel-view-item">
                        <div className="panel-view-item-key">نقش کاربری:</div>
                        <div className="panel-view-item-value">
                            {FA.role[user.role]}
                        </div>
                    </div>
                    <div className="panel-view-item">
                        <div className="panel-view-item-key">تاریخ عضویت:</div>
                        <div className="panel-view-item-value">
                            {dateFormatter(user.createdAt)}
                        </div>
                    </div>
                </div>

                <div className="panel-user-addresses">
                    <div className="panel-addresses-header">
                        <Typography variant="h5">آدرس های ثبت شده</Typography>

                        <PanelModal
                            buttonLabel="اضافه کردن آدرس"
                            modalHeader="اضافه کردن آدرس"
                            icon="add"
                            variant="outlined"
                        >
                            <AddAddressForm setDoReload={setDoReload} />
                        </PanelModal>
                    </div>
                    {user.addresses.length === 0 ? (
                        <NoData />
                    ) : (
                        <TableContainer component={Paper}>
                            <Table aria-label="categories table">
                                <TableHead sx={{ backgroundColor: '#ccc' }}>
                                    <TableRow>
                                        <TableCell>عنوان</TableCell>
                                        <TableCell>آدرس</TableCell>
                                        <TableCell>شهر</TableCell>
                                        <TableCell>استان</TableCell>
                                        <TableCell>عملیات</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? user.addresses.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : user.addresses
                                    ).map((address) => (
                                        <TableRow key={address._id}>
                                            <TableCell>
                                                {address.title}
                                                {address.default && (
                                                    <Chip
                                                        icon={
                                                            <CheckCircleIcon />
                                                        }
                                                        label="آدرس پیش فرض"
                                                        color="success"
                                                        sx={{
                                                            marginRight: '10px',
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {address.address}
                                            </TableCell>
                                            <TableCell>
                                                {address.cityLabel}
                                            </TableCell>
                                            <TableCell>
                                                {address.cityState}
                                            </TableCell>
                                            <TableCell>
                                                <div className="lt-table-actions">
                                                    <PanelModal
                                                        data={address}
                                                        buttonLabel="ویرایش"
                                                        modalHeader="ویرایش آدرس"
                                                        type="table"
                                                        icon="edit"
                                                        tooltipTitle="ویرایش آدرس"
                                                        variant="outlined"
                                                    >
                                                        <UpdateAddressForm
                                                            setDoReload={
                                                                setDoReload
                                                            }
                                                        />
                                                    </PanelModal>
                                                    <DeleteModal
                                                        handleRemoveItem={
                                                            handleRemoveItem
                                                        }
                                                        data={address._id}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow
                                            style={{ height: 53 * emptyRows }}
                                        >
                                            <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <LTTableFooter
                                    rows={user.addresses}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    handleChangePage={handleChangePage}
                                    handleChangeRowsPerPage={
                                        handleChangeRowsPerPage
                                    }
                                />
                            </Table>
                        </TableContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
