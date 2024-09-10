"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import UpdateShopForm from "@/components/forms/UpdateShopForm";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function EditShopPage({ shopId }) {
	const user = useSelector((state) => state.user.data);

	return (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">به روزرسانی فروشگاه</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید فروشگاه خود را ویرایش کنید.
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
						برگشت به مدیریت فروشگاه
					</Link>
				</Button>
			</div>

			<div className="panel-inner-content form-content">
				<UpdateShopForm
					shopId={shopId}
					ownerId={user.id}
					ownerName={user.firstName + " " + user.LastName}
					role={user.role}
				/>
			</div>
		</div>
	);
}
