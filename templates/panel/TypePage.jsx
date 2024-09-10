"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import adminDeleteType from "@/functions/type/adminDeleteType";
import adminGetAllTypes from "@/functions/type/adminGetAllTypes";
import { dateFormatter } from "@/utils/dateFormatter";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import PanelModal from "@/components/panel/PanelModal";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import LTTableFooter from "@/components/global/LTTableFooter";
import LTImage from "@/components/global/LTImage";
import DeleteModal from "@/components/panel/DeleteModal";
import AddTypeForm from "@/components/forms/AddTypeForm";
import UpdateTypeForm from "@/components/forms/UpdateTypeForm";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function TypePage() {
	const [types, setTypes] = useState(null);
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

	const handleRemoveItem = async (typeId) => {
		await adminDeleteType(dispatch, enqueueSnackbar, typeId);
		setDoReload(!doReload);
	};

	useEffect(() => {
		if (doReload) {
			async function fetchData() {
				await adminGetAllTypes(dispatch, enqueueSnackbar, setTypes);
			}
			fetchData();
		}
		setDoReload(false);
	}, [doReload]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت نوع فروشگاه ها</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید نوع فروشگاه اضافه نمایید.
					</Typography>
				</div>
				<PanelModal
					buttonLabel="اضافه کردن نوع فروشگاه"
					modalHeader="اضافه کردن نوع فروشگاه"
					icon="add"
				>
					<AddTypeForm setDoReload={setDoReload} />
				</PanelModal>
			</div>
			{!types ? (
				<LTProgress />
			) : types && types.length > 0 ? (
				<div className="panel-inner-content">
					<TableContainer component={Paper}>
						<Table aria-label="shop types table">
							<TableHead sx={{ backgroundColor: "#ccc" }}>
								<TableRow>
									<TableCell>شناسه</TableCell>
									<TableCell>تصویر</TableCell>
									<TableCell>عنوان</TableCell>
									<TableCell>عنوان نمایشی</TableCell>
									<TableCell>وضعیت</TableCell>
									<TableCell>زمان ایجاد</TableCell>
									<TableCell>عملیات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rowsPerPage > 0
									? types.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
									  )
									: types
								).map((type) => (
									<TableRow key={type.id}>
										<TableCell>{type.value}</TableCell>
										<TableCell>
											<LTImage
												name={type.image}
												variant="rounded"
												width={70}
												height={70}
											/>
										</TableCell>
										<TableCell>{type.alias}</TableCell>
										<TableCell>{type.label}</TableCell>
										<TableCell>
											{useSetStatusLabel(type.status)}
										</TableCell>
										<TableCell>
											{dateFormatter(type.createdAt)}
										</TableCell>
										<TableCell>
											<div className="lt-table-actions">
												<PanelModal
													data={type}
													buttonLabel="ویرایش"
													modalHeader="ویرایش نوع فروشگاه"
													type="table"
													icon="edit"
													tooltipTitle="ویرایش نوع فروشگاه"
													variant="outlined"
												>
													<UpdateTypeForm
														setDoReload={
															setDoReload
														}
													/>
												</PanelModal>
												<DeleteModal
													handleRemoveItem={
														handleRemoveItem
													}
													id={type.id}
												/>
											</div>
										</TableCell>
									</TableRow>
								))}
								{emptyRows > 0 && (
									<TableRow
										style={{ height: 53 * emptyRows }}
									>
										<TableCell colSpan={7} />
									</TableRow>
								)}
							</TableBody>
							<LTTableFooter
								rows={types}
								rowsPerPage={rowsPerPage}
								page={page}
								colSpan={7}
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
