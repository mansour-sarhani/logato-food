"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import adminGetAllCategories from "@/functions/category/adminGetAllCategories";
import adminDeleteCategory from "@/functions/category/adminDeleteCategory";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import LTProgress from "@/components/global/LTProgress";
import PanelModal from "@/components/panel/PanelModal";
import NoData from "@/components/global/NoData";
import LTTableFooter from "@/components/global/LTTableFooter";
import LTImage from "@/components/global/LTImage";
import AddCategoryForm from "@/components/forms/AddCategoryForm";
import UpdateCategoryForm from "@/components/forms/UpdateCategoryForm";
import DeleteModal from "@/components/panel/DeleteModal";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function CategoryPage() {
	const [categories, setCategories] = useState(null);
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

	const handleRemoveItem = async (category) => {
		const data = {
			categoryId: category.id,
			parentTypeId: category.parentTypeId,
		};
		await adminDeleteCategory(dispatch, enqueueSnackbar, data);
		setDoReload(!doReload);
	};

	useEffect(() => {
		if (doReload) {
			async function fetchData() {
				await adminGetAllCategories(
					dispatch,
					enqueueSnackbar,
					setCategories
				);
			}
			fetchData();
		}
		setDoReload(false);
	}, [doReload]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت دسته بندی ها</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید دسته بندی اضافه نمایید.
					</Typography>
				</div>
				<PanelModal
					buttonLabel="اضافه کردن دسته بندی"
					modalHeader="اضافه کردن دسته بندی"
					icon="add"
				>
					<AddCategoryForm setDoReload={setDoReload} />
				</PanelModal>
			</div>
			{!categories ? (
				<LTProgress />
			) : categories && categories.length > 0 ? (
				<div className="panel-inner-content">
					<TableContainer component={Paper}>
						<Table aria-label="categories table">
							<TableHead sx={{ backgroundColor: "#ccc" }}>
								<TableRow>
									<TableCell>شناسه</TableCell>
									<TableCell>تصویر</TableCell>
									<TableCell>عنوان</TableCell>
									<TableCell>عنوان نمایشی</TableCell>
									<TableCell>نوع فروشگاه</TableCell>
									<TableCell>وضعیت</TableCell>
									<TableCell>عملیات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rowsPerPage > 0
									? categories.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
									  )
									: categories
								).map((category) => (
									<TableRow key={category.id}>
										<TableCell>{category.value}</TableCell>
										<TableCell>
											<LTImage
												name={category.image}
												variant="rounded"
											/>
										</TableCell>
										<TableCell>{category.alias}</TableCell>
										<TableCell>{category.label}</TableCell>
										<TableCell>
											{category.parentTypeLabel}
										</TableCell>
										<TableCell>
											{useSetStatusLabel(category.status)}
										</TableCell>
										<TableCell>
											<div className="lt-table-actions">
												<PanelModal
													data={category}
													buttonLabel="ویرایش"
													modalHeader="ویرایش دسته بندی"
													type="table"
													icon="edit"
													tooltipTitle="ویرایش دسته بندی"
													variant="outlined"
												>
													<UpdateCategoryForm
														setDoReload={
															setDoReload
														}
													/>
												</PanelModal>
												<DeleteModal
													handleRemoveItem={
														handleRemoveItem
													}
													data={category}
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
								rows={categories}
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
