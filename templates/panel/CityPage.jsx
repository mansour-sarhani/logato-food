"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import adminGetAllCities from "@/functions/city/adminGetAllCities";
import adminDeleteCity from "@/functions/city/adminDeleteCity";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import { dateFormatter } from "@/utils/dateFormatter";
import PanelModal from "@/components/panel/PanelModal";
import AddCityForm from "@/components/forms/AddCityForm";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import UpdateCityForm from "@/components/forms/UpdateCityForm";
import LTTableFooter from "@/components/global/LTTableFooter";
import DeleteModal from "@/components/panel/DeleteModal";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function CityPage() {
	const [cities, setCities] = useState(null);
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

	const handleRemoveItem = async (cityId) => {
		await adminDeleteCity(dispatch, enqueueSnackbar, cityId);
		setDoReload(!doReload);
	};

	useEffect(() => {
		if (doReload) {
			async function fetchData() {
				await adminGetAllCities(dispatch, enqueueSnackbar, setCities);
			}
			fetchData();
		}
		setDoReload(false);
	}, [doReload]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت شهرها</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید شهرهای حوزه کاری خود را اضافه
						نمایید.
					</Typography>
				</div>
				<PanelModal
					buttonLabel="اضافه کردن شهر"
					modalHeader="اضافه کردن شهر"
					icon="add"
				>
					<AddCityForm setDoReload={setDoReload} />
				</PanelModal>
			</div>

			{!cities ? (
				<LTProgress />
			) : cities && cities.length > 0 ? (
				<div className="panel-inner-content">
					<TableContainer component={Paper}>
						<Table aria-label="cities table">
							<TableHead sx={{ backgroundColor: "#ccc" }}>
								<TableRow>
									<TableCell>شناسه</TableCell>
									<TableCell>عنوان</TableCell>
									<TableCell>عنوان به انگلیسی</TableCell>
									<TableCell>نام استان</TableCell>
									<TableCell>وضعیت</TableCell>
									<TableCell>زمان ایجاد</TableCell>
									<TableCell>عملیات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rowsPerPage > 0
									? cities.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
									  )
									: cities
								).map((city) => (
									<TableRow key={city.id}>
										<TableCell>{city.value}</TableCell>
										<TableCell>{city.label}</TableCell>
										<TableCell>{city.alias}</TableCell>
										<TableCell>{city.state}</TableCell>
										<TableCell>
											{useSetStatusLabel(city.status)}
										</TableCell>
										<TableCell>
											{dateFormatter(city.createdAt)}
										</TableCell>
										<TableCell>
											<div className="lt-table-actions">
												<PanelModal
													data={city}
													buttonLabel="ویرایش"
													modalHeader="ویرایش شهر"
													type="table"
													icon="edit"
													tooltipTitle="ویرایش شهر"
													variant="outlined"
												>
													<UpdateCityForm
														setDoReload={
															setDoReload
														}
													/>
												</PanelModal>
												<DeleteModal
													data={city.id}
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
								rows={cities}
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
