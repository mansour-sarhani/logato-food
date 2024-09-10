"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import AddShopForm from "@/components/forms/AddShopForm";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function NewShopPage() {
	const user = useSelector((state) => state.user.data);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">ایجاد فروشگاه جدید</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید فروشگاه جدید بسازید.
					</Typography>
				</div>
				<Button variant="contained" color="primary">
					<Link
						href={
							user.role === "admin" || user.role === "superAdmin"
								? "/panel/shops"
								: "/panel/shop"
						}
					>
						<ArrowForwardIcon />
						بازگشت به مدیریت فروشگاه
					</Link>
				</Button>
			</div>

			<div className="panel-inner-content form-content">
				<AddShopForm
					ownerValue={user.value}
					ownerId={user.id}
					ownerName={user.firstName + " " + user.lastName}
					role={user.role}
				/>
			</div>
		</div>
	);
}
