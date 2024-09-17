"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import getCommentsByStatus from "@/functions/comment/getCommentsByStatus";
import getAllComments from "@/functions/comment/getAllComments";
import useSetStatusLabel from "@/hooks/useSetStatusLabel";
import { dateFormatter } from "@/utils/dateFormatter";
import PanelModal from "@/components/panel/PanelModal";
import UpdateCommentStatusForm from "@/components/forms/UpdateCommentStatusForm";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import LTTableFooter from "@/components/global/LTTableFooter";
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

export default function CommentsPage() {
	const [comments, setComments] = useState(null);
	const [doReload, setDoReload] = useState(true);
	const [status, setStatus] = useState("all");
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const handleStatus = (event, newStatus) => {
		setStatus(newStatus);
		setDoReload(true);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - comments.length) : 0;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	useEffect(() => {
		if (doReload) {
			if (status === "all") {
				async function fetchComments() {
					await getAllComments(
						dispatch,
						enqueueSnackbar,
						setComments
					);
				}
				fetchComments();
			} else {
				async function fetchCommentsByStatus() {
					await getCommentsByStatus(
						dispatch,
						enqueueSnackbar,
						status,
						setComments
					);
				}
				fetchCommentsByStatus();
			}
		}
		setDoReload(false);
	}, [status, doReload]);

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
			<div className="panel-filters">
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
						value="published"
						aria-label="published"
					>
						منتشر شده
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
						value="rejected"
						aria-label="rejected"
					>
						رد شده
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
									<TableCell>نام فروشگاه</TableCell>
									<TableCell>نام محصول</TableCell>
									<TableCell>متن نظر</TableCell>
									<TableCell>وضعیت</TableCell>
									<TableCell>تاریخ ایجاد</TableCell>
									<TableCell>عملیات</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{(rowsPerPage > 0
									? comments.slice(
											page * rowsPerPage,
											page * rowsPerPage + rowsPerPage
									  )
									: comments
								).map((comment) => (
									<TableRow key={comment.id}>
										<TableCell>{comment.value}</TableCell>
										<TableCell>
											{comment.userName}
										</TableCell>
										<TableCell>
											{comment.shopName !== "null"
												? comment.shopName
												: "-"}
										</TableCell>
										<TableCell>
											{comment.productName !== "undefined"
												? comment.productName
												: "-"}
										</TableCell>
										<TableCell>{comment.body}</TableCell>
										<TableCell>
											{useSetStatusLabel(comment.status)}
										</TableCell>
										<TableCell>
											{dateFormatter(comment.createdAt)}
										</TableCell>
										<TableCell>
											<div className="lt-table-actions">
												<PanelModal
													data={comment}
													buttonLabel="تغییر وضعیت"
													modalHeader="تغییر وضعیت کامنت"
													type="table"
													icon="edit"
													tooltipTitle="تغییر وضعیت"
													variant="outlined"
												>
													<UpdateCommentStatusForm
														commentId={comment.id}
														setDoReload={
															setDoReload
														}
													/>
												</PanelModal>
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
		</div>
	);
}
