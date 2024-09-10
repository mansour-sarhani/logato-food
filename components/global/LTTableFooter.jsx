import TableRow from "@mui/material/TableRow";
import LTTablePagination from "@/components/global/LTTablePagination";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";

export default function LTTableFooter({
	rows,
	rowsPerPage,
	page,
	handleChangePage,
	handleChangeRowsPerPage,
	colSpan,
}) {
	return (
		<TableFooter>
			<TableRow>
				<TablePagination
					rowsPerPageOptions={[
						10,
						20,
						50,
						{ label: "همه", value: -1 },
					]}
					colSpan={colSpan}
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					labelRowsPerPage={"تعداد در هر صفحه:"}
					labelDisplayedRows={({ from, to, count }) =>
						`${from}-${to === -1 ? count : to} از ${
							count !== -1 ? count : `بیشتر از ${to}`
						}`
					}
					slotProps={{
						select: {
							inputProps: {
								"aria-label": "تعداد در هر صفحه",
							},
							native: true,
						},
					}}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
					ActionsComponent={LTTablePagination}
				/>
			</TableRow>
		</TableFooter>
	);
}
