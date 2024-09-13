"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import adminDeleteSubCategory from "@/functions/subCategory/adminDeleteSubCategory";
import adminGetAllSubCategories from "@/functions/subCategory/adminGetAllSubCategories";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import PanelModal from "@/components/panel/PanelModal";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import LTTableFooter from "@/components/global/LTTableFooter";
import LTImage from "@/components/global/LTImage";
import AddSubCategoryForm from "@/components/forms/AddSubCategoryForm";
import UpdateSubCategoryForm from "@/components/forms/UpdateSubCategoryForm";
import DeleteModal from "@/components/panel/DeleteModal";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function SubCategoryPage() {
	const [subCategories, setSubCategories] = useState(null);
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

	const handleRemoveItem = async (subcategory) => {
		const data = {
			subCategoryId: subcategory.id,
			categoryId: subcategory.parentCategoryId,
			typeId: subcategory.typeId,
		};
		await adminDeleteSubCategory(dispatch, enqueueSnackbar, data);
		setDoReload(!doReload);
	};

	useEffect(() => {
		if (doReload) {
			async function fetchData() {
				await adminGetAllSubCategories(
					dispatch,
					enqueueSnackbar,
					setSubCategories
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
					<Typography variant="h5">مدیریت زیر دسته</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید زیر دسته اضافه نمایید.
					</Typography>
				</div>
				<PanelModal
					buttonLabel="اضافه کردن زیر دسته"
					modalHeader="اضافه کردن زیر دسته"
					icon="add"
				>
					<AddSubCategoryForm setDoReload={setDoReload} />
				</PanelModal>
			</div>
			{!subCategories ? (
				<LTProgress />
			) : subCategories && subCategories.length > 0 ? (
				<div className="panel-inner-content">
					<TableContainer component={Paper}>
						<Table aria-label="sub categories table">
							<TableHead sx={{ backgroundColor: "#ccc" }}>
								<TableRow>
									<TableCell>شناسه</TableCell>
									<TableCell>تصویر</TableCell>
									<TableCell>عنوان</TableCell>
									<TableCell>عنوان نمایشی</TableCell>
									<TableCell>دسته اصلی</TableCell>
									<TableCell>وضعیت</TableCell>
									<TableCell>عملیات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rowsPerPage > 0
									? subCategories.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
									  )
									: subCategories
								).map((subCategory) => (
									<TableRow key={subCategory.id}>
										<TableCell>
											{subCategory.value}
										</TableCell>
										<TableCell>
											<LTImage
												name={subCategory.image}
												variant="rounded"
												width={70}
												height={70}
											/>
										</TableCell>
										<TableCell>
											{subCategory.alias}
										</TableCell>
										<TableCell>
											{subCategory.label}
										</TableCell>
										<TableCell>
											{subCategory.parentCategoryLabel}
										</TableCell>
										<TableCell>
											{useSetStatusLabel(
												subCategory.status
											)}
										</TableCell>
										<TableCell>
											<div className="lt-table-actions">
												<PanelModal
													data={subCategory}
													buttonLabel="ویرایش"
													modalHeader="ویرایش زیر دسته"
													type="table"
													icon="edit"
													tooltipTitle="ویرایش زیر دسته"
													variant="outlined"
												>
													<UpdateSubCategoryForm
														setDoReload={
															setDoReload
														}
													/>
												</PanelModal>
												<DeleteModal
													data={subCategory}
													handleRemoveItem={
														handleRemoveItem
													}
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
								rows={subCategories}
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
