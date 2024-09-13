"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import adminGetAllUsers from "@/functions/admin/adminGetAllUsers";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import Image from "next/image";
import PanelModal from "@/components/panel/PanelModal";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import AddUserForm from "@/components/forms/AddUserForm";
import AdminUpdateUserForm from "@/components/forms/AdminUpdateUserForm";
import LTTableFooter from "@/components/global/LTTableFooter";
import LTImage from "@/components/global/LTImage";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function UsersPage() {
	const [users, setUsers] = useState(null);
	const [doReload, setDoReload] = useState(true);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	useEffect(() => {
		if (doReload) {
			async function fetchData() {
				await adminGetAllUsers(dispatch, enqueueSnackbar, setUsers);
			}
			fetchData();
		}
		setDoReload(false);
	}, [doReload]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت کاربران</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید کاربران سایت را مدیریت نمایید.
					</Typography>
				</div>
				<PanelModal
					buttonLabel="اضافه کردن کاربر"
					modalHeader="اضافه کردن کاربر"
					icon="add"
				>
					<AddUserForm setDoReload={setDoReload} />
				</PanelModal>
			</div>
			{!users ? (
				<LTProgress />
			) : users && users.length > 0 ? (
				<div className="panel-inner-content">
					<TableContainer component={Paper}>
						<Table aria-label="users table">
							<TableHead sx={{ backgroundColor: "#ccc" }}>
								<TableRow>
									<TableCell>شناسه</TableCell>
									<TableCell>تصویر</TableCell>
									<TableCell>نام</TableCell>
									<TableCell>نام خانوادگی</TableCell>
									<TableCell>ایمیل</TableCell>
									<TableCell>نقش</TableCell>
									<TableCell>وضعیت</TableCell>
									<TableCell>عملیات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rowsPerPage > 0
									? users.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
									  )
									: users
								).map((user) => (
									<TableRow key={user.id}>
										<TableCell>{user.value}</TableCell>
										<TableCell>
											{user.avatar.img === "" ? (
												<Image
													src="/assets/images/front/avatar.png"
													alt="user-avatar"
													width={70}
													height={70}
													style={{
														borderRadius: "50%",
													}}
												/>
											) : (
												<LTImage
													name={user.avatar}
													variant="circle"
													width={70}
													height={70}
												/>
											)}
										</TableCell>
										<TableCell>{user.firstName}</TableCell>
										<TableCell>{user.lastName}</TableCell>
										<TableCell>{user.email}</TableCell>
										<TableCell>{user.role}</TableCell>
										<TableCell>
											{useSetStatusLabel(user.status)}
										</TableCell>
										<TableCell>
											<PanelModal
												data={user}
												buttonLabel="ویرایش"
												modalHeader="ویرایش کاربر"
												type="table"
												icon="edit"
												tooltipTitle="ویرایش کاربر"
												variant="outlined"
											>
												<AdminUpdateUserForm
													setDoReload={setDoReload}
												/>
											</PanelModal>
										</TableCell>
									</TableRow>
								))}
								{emptyRows > 0 && (
									<TableRow
										style={{ height: 53 * emptyRows }}
									>
										<TableCell colSpan={8} />
									</TableRow>
								)}
							</TableBody>
							<LTTableFooter
								colSpan={8}
								rows={users}
								rowsPerPage={rowsPerPage}
								page={page}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
							/>
						</Table>
					</TableContainer>
				</div>
			) : (
				<NoData />
			)}
		</div>
	);
}
