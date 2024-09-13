"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import getCommentForShop from "@/functions/comment/getCommentForShop";
import getCommentForShopProducts from "@/functions/comment/getCommentsForShopProducts";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import { dateFormatter } from "@/utils/dateFormatter";
import PanelModal from "@/components/panel/PanelModal";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import LTTableFooter from "@/components/global/LTTableFooter";
import RespondToCommentForm from "@/components/forms/RespondToCommentForm";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Alert from "@mui/material/Alert";

export default function ShopCommentsPage() {
	const [comments, setComments] = useState(null);
	const [type, setType] = useState("shop");
	const [doReload, setDoReload] = useState(true);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const user = useSelector((state) => state.user.data);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comments.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleChangeType = (event, newType) => {
		setType(newType);
		if (newType === "shop") {
			async function fetchComments() {
				await getCommentForShop(
					dispatch,
					enqueueSnackbar,
					user.shopId,
					setComments
				);
			}
			fetchComments();
		} else {
			async function fetchCommentsOnProducts() {
				await getCommentForShopProducts(
					dispatch,
					enqueueSnackbar,
					user.shopId,
					setComments
				);
			}
			fetchCommentsOnProducts();
		}
	};

	useEffect(() => {
		if (!user) return;

		if (!user.shopId) {
			return;
		}

		if (doReload) {
			async function fetchComments() {
				await getCommentForShop(
					dispatch,
					enqueueSnackbar,
					user.shopId,
					setComments
				);
			}
			fetchComments();
		}
		setDoReload(false);
	}, [user, doReload]);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت نظرات</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید نظرات را مدیریت کنید.
					</Typography>
				</div>
			</div>
			{!user.shopId ? (
				<div className="panel-inner-content">
					<Alert severity="info" sx={{ marginBottom: "20px" }}>
						شما در حال حاضر فروشگاه فعال ندارید. برای ایجاد فروشگاه
						به صفحه "مدیریت فروشگاه" مراجعه کنید.
					</Alert>
					<NoData />
				</div>
			) : (
				<>
					<div className="panel-filters">
						<ToggleButtonGroup
							color="primary"
							value={type}
							exclusive
							onChange={handleChangeType}
							aria-label="status"
							size="small"
						>
							<ToggleButton
								variant="outlined"
								value="shop"
								aria-label="shop"
							>
								نظرات برای فروشگاه
							</ToggleButton>
							<ToggleButton
								variant="outlined"
								value="product"
								aria-label="product"
							>
								نظرات برای محصولات
							</ToggleButton>
						</ToggleButtonGroup>
					</div>
					{!comments ? (
						<LTProgress />
					) : comments.length === 0 ? (
						<NoData />
					) : (
						<div className="panel-inner-content">
							<TableContainer component={Paper}>
								<Table aria-label="comments table">
									<TableHead sx={{ backgroundColor: "#ccc" }}>
										<TableRow>
											<TableCell>شناسه</TableCell>
											<TableCell>نام کاربر</TableCell>
											<TableCell>نام محصول</TableCell>
											<TableCell>متن نظر</TableCell>
											<TableCell>وضعیت</TableCell>
											<TableCell>تاریخ ایجاد</TableCell>
											<TableCell>عملیات</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{(rowsPerPage > 0
											? comments
													.filter(
														(comment) =>
															comment.status ===
															"published"
													)
													.slice(
														page * rowsPerPage,
														page * rowsPerPage +
															rowsPerPage
													)
											: comments
										).map((comment) => (
											<TableRow key={comment.id}>
												<TableCell>
													{comment.value}
												</TableCell>
												<TableCell>
													{comment.userName}
												</TableCell>
												<TableCell>
													{comment.productName !==
													"null"
														? comment.productName
														: "-"}
												</TableCell>
												<TableCell>
													{comment.body}
												</TableCell>
												<TableCell>
													{useSetStatusLabel(
														comment.status
													)}
												</TableCell>
												<TableCell>
													{dateFormatter(
														comment.createdAt
													)}
												</TableCell>
												<TableCell>
													<div className="lt-table-actions">
														{comment.responseBody ? (
															<Typography variant="body2">
																<strong>
																	پاسخ شما:
																</strong>{" "}
																{
																	comment.responseBody
																}
															</Typography>
														) : (
															<PanelModal
																data={comment}
																buttonLabel="پاسخ"
																modalHeader="پاسخ به کامنت"
																type="table"
																icon="edit"
																tooltipTitle="پاسخ"
																variant="outlined"
															>
																<RespondToCommentForm
																	setDoReload={
																		setDoReload
																	}
																/>
															</PanelModal>
														)}
													</div>
												</TableCell>
											</TableRow>
										))}
										{emptyRows > 0 && (
											<TableRow
												style={{
													height: 53 * emptyRows,
												}}
											>
												<TableCell colSpan={7} />
											</TableRow>
										)}
									</TableBody>
									<LTTableFooter
										rows={comments}
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
					)}
				</>
			)}
		</div>
	);
}
