import Chip from "@mui/material/Chip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import BlockIcon from "@mui/icons-material/Block";
import InfoIcon from "@mui/icons-material/Info";
import PendingIcon from "@mui/icons-material/Pending";

export default function useSetStatusLabel(status) {
	switch (status) {
		case "active":
			return (
				<Chip icon={<CheckCircleIcon />} label="فعال" color="success" />
			);

		case "published":
			return (
				<Chip
					icon={<CheckCircleIcon />}
					label="منتشرشده"
					color="success"
				/>
			);

		case "inactive":
			return (
				<Chip icon={<CancelIcon />} label="غیر فعال" color="error" />
			);

		case "rejected":
			return <Chip icon={<CancelIcon />} label="رد شده" color="error" />;

		case "banned":
			return (
				<Chip icon={<BlockIcon />} label="مسدود شده" color="default" />
			);

		case "underReview":
			return (
				<Chip
					icon={<PendingIcon />}
					label="در حال بازبینی"
					color="warning"
				/>
			);

		default:
			return <Chip icon={<InfoIcon />} label="نامشخص" color="info" />;
	}
}
