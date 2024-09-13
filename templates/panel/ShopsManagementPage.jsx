"use client";

import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Link from "next/link";
import adminGetAllShops from "@/functions/shop/adminGetAllShops";
import adminGetShopsByStatus from "@/functions/shop/adminGetShopsByStatus";
import adminGetShopsBySearch from "@/functions/shop/adminGetShopsBySearch";
import adminDeleteShop from "@/functions/shop/adminDeleteShop";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import { debounce } from "lodash";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import LTTableFooter from "@/components/global/LTTableFooter";
import LTImage from "@/components/global/LTImage";
import DeleteModal from "@/components/panel/DeleteModal";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import AddIcon from "@mui/icons-material/Add";
import { dateFormatter } from "@/utils/dateFormatter";

export default function ShopsManagementPage() {
	const [shops, setShops] = useState(null);
	const [doReload, setDoReload] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [status, setStatus] = useState("all");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const isFirstRender = useRef(true);

	const handleStatus = (event, newStatus) => {
		setStatus(newStatus);
		setDoReload(true);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - shops.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleRemoveItem = async (shopId) => {
		await adminDeleteShop(dispatch, enqueueSnackbar, shopId);
		setDoReload(!doReload);
	};

	useEffect(() => {
		if (doReload) {
			if (status === "all") {
				async function fetchShops() {
					await adminGetAllShops(dispatch, enqueueSnackbar, setShops);
				}
				fetchShops();
			} else {
				async function fetchShops() {
					await adminGetShopsByStatus(
						dispatch,
						enqueueSnackbar,
						status,
						setShops
					);
				}
				fetchShops();
			}
		}
		setDoReload(false);
	}, [status, doReload]);

	useEffect(() => {
		const fetchShops = async (search = "") => {
			try {
				await adminGetShopsBySearch(
					dispatch,
					enqueueSnackbar,
					search,
					setShops
				);
			} catch (error) {
				console.error("متاسفانه مشکلی پیش آمده است.", error);
			}
		};

		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		if (searchTerm.length >= 3) {
			const debouncedFetch = debounce(() => fetchShops(searchTerm), 1000);
			debouncedFetch();
			return () => {
				debouncedFetch.cancel();
			};
		} else if (searchTerm.length === 0) {
			fetchShops();
		}
	}, [searchTerm]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت فروشگاه ها</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید فروشگاه ها را مدیریت کنید.
					</Typography>
				</div>
				<Button variant="contained" color="primary">
					<Link href="/panel/shop/new">
						<AddIcon />
						ایجاد فروشگاه
					</Link>
				</Button>
			</div>
			<div className="panel-filters">
				<FormControl variant="standard">
					<Input
						id="panel-search"
						placeholder="جستجو فروشگاه"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						startAdornment={
							<InputAdornment position="start">
								<SearchOutlined />
							</InputAdornment>
						}
						sx={{ width: "300px" }}
					/>
				</FormControl>

				<ToggleButtonGroup
					color="primary"
					value={status}
					exclusive
					onChange={handleStatus}
					aria-label="status"
					size="small"
				>
					<ToggleButton
						variant="outlined"
						value="all"
						aria-label="all"
					>
						همه
					</ToggleButton>
					<ToggleButton
						variant="outlined"
						value="active"
						aria-label="active"
					>
						فعال
					</ToggleButton>
					<ToggleButton
						variant="outlined"
						value="inactive"
						aria-label="inactive"
					>
						غیرفعال
					</ToggleButton>
					<ToggleButton
						variant="outlined"
						value="underReview"
						aria-label="underReview"
					>
						در انتظار تایید
					</ToggleButton>
					<ToggleButton
						variant="outlined"
						value="banned"
						aria-label="banned"
					>
						مسدود شده
					</ToggleButton>
				</ToggleButtonGroup>
			</div>

			{!shops ? (
				<LTProgress />
			) : shops.length === 0 ? (
				<NoData />
			) : (
				<div className="panel-inner-content">
					<TableContainer component={Paper}>
						<Table aria-label="shops table">
							<TableHead sx={{ backgroundColor: "#ccc" }}>
								<TableRow>
									<TableCell>شناسه</TableCell>
									<TableCell>لوگو</TableCell>
									<TableCell>نام فروشگاه</TableCell>
									<TableCell>نام مالک</TableCell>
									<TableCell>نوع فروشگاه</TableCell>
									<TableCell>وضعیت</TableCell>
									<TableCell>تاریخ ایجاد</TableCell>
									<TableCell>عملیات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rowsPerPage > 0
									? shops.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
									  )
									: shops
								).map((shop) => (
									<TableRow key={shop.id}>
										<TableCell>{shop.value}</TableCell>
										<TableCell>
											<LTImage
												name={shop.logo}
												variant="rounded"
												width={70}
												height={70}
											/>
										</TableCell>
										<TableCell>{shop.name}</TableCell>
										<TableCell>
											{shop.owner.ownerName
												? shop.owner.ownerName
												: "-"}
										</TableCell>
										<TableCell>
											{shop.type.typeLabel}
										</TableCell>
										<TableCell>
											{useSetStatusLabel(shop.status)}
										</TableCell>
										<TableCell>
											{dateFormatter(shop.createdAt)}
										</TableCell>
										<TableCell>
											<div className="lt-table-actions">
												<Tooltip
													title="ویرایش فروشگاه"
													placement="top"
													arrow
												>
													<Button
														variant="outlined"
														size="small"
														color="info"
													>
														<Link
															href={`/panel/shop/edit/${shop.id}`}
														>
															<EditIcon />
															ویرایش
														</Link>
													</Button>
												</Tooltip>
												<DeleteModal
													data={shop.id}
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
										<TableCell colSpan={8} />
									</TableRow>
								)}
							</TableBody>
							<LTTableFooter
								rows={shops}
								rowsPerPage={rowsPerPage}
								page={page}
								colSpan={8}
								handleChangePage={handleChangePage}
								handleChangeRowsPerPage={
									handleChangeRowsPerPage
								}
							/>
						</Table>
					</TableContainer>
				</div>
			)}
		</div>
	);
}
