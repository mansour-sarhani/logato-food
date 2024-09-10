"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import Link from "next/link";
import getShopById from "@/functions/shop/getShopById";
import NoData from "@/components/global/NoData";
import PanelShopView from "@/components/panel/PanelShopView";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import LTProgress from "@/components/global/LTProgress";

export default function ShopPage() {
	const [shop, setShop] = useState(null);

	const user = useSelector((state) => state.user.data);
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		if (!user) return;

		if (!user.shopId) {
			return;
		}

		async function fetchData() {
			await getShopById(dispatch, enqueueSnackbar, user.shopId, setShop);
		}
		fetchData();
	}, [user, dispatch, enqueueSnackbar]);

	return !user || !shop ? (
		<LTProgress />
	) : (
		<div className="panel-content-container">
			<div className="panel-inner-header">
				<div className="panel-inner-header-text">
					<Typography variant="h5">مدیریت فروشگاه</Typography>
					<Typography variant="body2">
						در این قسمت میتوانید فروشگاه خود را مدیریت کنید.
					</Typography>
				</div>
				{!shop ? (
					<Button variant="contained" color="primary">
						<Link href="/panel/shop/new">
							<AddIcon />
							ایجاد فروشگاه
						</Link>
					</Button>
				) : (
					<Button
						variant="contained"
						color="primary"
						disabled={shop.status !== "active"}
					>
						<Link href={`/panel/shop/edit/${shop.id}`}>
							<EditIcon />
							ویرایش فروشگاه
						</Link>
					</Button>
				)}
			</div>

			<div className="panel-inner-content">
				{!user.shopId ? <NoData /> : <PanelShopView shop={shop} />}
			</div>
		</div>
	);
}
