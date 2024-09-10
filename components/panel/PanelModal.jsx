import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import ModalTableButton from "./ModalTableButton";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
	".MuiDialog-paper": {
		maxWidth: 800,
	},
	"& .MuiDialogContent-root": {
		padding: theme.spacing(2),
	},
	"& .MuiDialogActions-root": {
		padding: theme.spacing(1),
	},
}));

function BootstrapDialogTitle(props) {
	const { children, onClose, ...other } = props;

	return (
		<DialogTitle sx={{ m: 0, p: 2 }} {...other}>
			{children}
			{onClose ? (
				<IconButton
					aria-label="close"
					onClick={onClose}
					sx={{
						position: "absolute",
						left: 8,
						top: 8,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
			) : null}
		</DialogTitle>
	);
}

function PanelModal(props) {
	const [open, setOpen] = useState(false);
	const [currentData, setCurrentData] = useState();

	const {
		data,
		buttonLabel,
		modalHeader,
		children,
		variant,
		icon,
		tooltipTitle,
	} = props;

	const handleClickOpen = () => {
		setOpen(true);
		setCurrentData(data);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div className="panel-modal">
			<ModalTableButton
				icon={icon}
				tooltipTitle={tooltipTitle}
				handleClickOpen={handleClickOpen}
				buttonLabel={buttonLabel}
				variant={variant}
			/>

			<BootstrapDialog
				onClose={handleClose}
				aria-labelledby="panel-modal-title"
				open={open}
			>
				<div className="bg-black" style={{ width: "600px" }}>
					<BootstrapDialogTitle
						id="panel-modal-title"
						onClose={handleClose}
					>
						{modalHeader}
					</BootstrapDialogTitle>

					<DialogContent dividers>
						{React.Children.map(children, (child) =>
							React.cloneElement(child, {
								handleClose,
								currentData,
							})
						)}
					</DialogContent>
				</div>
			</BootstrapDialog>
		</div>
	);
}

export default PanelModal;
