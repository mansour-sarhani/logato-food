import FA from "@/utils/localizationFa";
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
				<Chip
					icon={<CheckCircleIcon />}
					label={FA.status.active}
					color="success"
				/>
			);

		case "published":
			return (
				<Chip
					icon={<CheckCircleIcon />}
					label={FA.status.published}
					color="success"
				/>
			);

		case "inactive":
			return (
				<Chip
					icon={<CancelIcon />}
					label={FA.status.inactive}
					color="error"
				/>
			);

		case "rejected":
			return (
				<Chip
					icon={<CancelIcon />}
					label={FA.status.rejected}
					color="error"
				/>
			);

		case "banned":
			return (
				<Chip
					icon={<BlockIcon />}
					label={FA.status.banned}
					color="default"
				/>
			);

		case "underReview":
			return (
				<Chip
					icon={<PendingIcon />}
					label={FA.status.underReview}
					color="warning"
				/>
			);

		default:
			return (
				<Chip icon={<InfoIcon />} label={FA.status.NA} color="info" />
			);
	}
}
