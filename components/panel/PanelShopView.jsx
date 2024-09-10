import LTMap from "../global/LTMap";
import Image from "next/image";
import LTProgress from "../global/LTProgress";
import Alert from "@mui/material/Alert";
import Rating from "@mui/material/Rating";
import { Paper, Typography } from "@mui/material";
import LTImage from "../global/LTImage";

export default function PanelShopView({ shop }) {
	let priceClassLabel = "همه";
	if (shop) {
		if (shop.priceClass === "all") {
			priceClassLabel = "همه";
		} else if (shop.role === "economy") {
			priceClassLabel = "اقتصادی";
		} else if (shop.role === "average") {
			priceClassLabel = "متوسط";
		} else {
			priceClassLabel = "گران";
		}
	}

	return !shop ? (
		<LTProgress />
	) : (
		<div className="panel-inner-content">
			{shop.status === "underReview" && (
				<Alert severity="info" sx={{ marginBottom: "20px" }}>
					فروشگاه شما در صف بازبینی برای انتشار قرار دارد.
				</Alert>
			)}
			{shop.status === "banned" && (
				<Alert severity="error" sx={{ marginBottom: "20px" }}>
					فروشگاه شما به دلیل نقض قوانین سایت مسدود شده است.
				</Alert>
			)}
			{shop.status === "inactive" && (
				<Alert severity="warning" sx={{ marginBottom: "20px" }}>
					فروشگاه شما غیرفعال شده است.
				</Alert>
			)}
			{shop.status === "active" && (
				<Alert severity="success" sx={{ marginBottom: "20px" }}>
					فروشگاه شما فعال است.
				</Alert>
			)}
			<div
				className={`panel-shop-view ${
					shop.status !== "active" ? "disabled-overlay" : ""
				}`}
			>
				<div className="panel-shop-view-box">
					<div className="panel-shop-view-header">
						<Paper className="lt-paper" elevation={3}>
							<div className="panel-show-view-header-container">
								<div className="panel-shop-view-title">
									<LTImage
										name={shop.logo}
										width={70}
										height={70}
										variant="circle"
									/>
									<div className="panel-shop-view-header-name">
										<Typography variant="h6">
											{shop.name}
										</Typography>
										<Typography variant="body2">
											{shop.owner.ownerName}
										</Typography>
									</div>
								</div>
								<div className="panel-shop-view-rating">
									<Rating
										value={shop.averageRating}
										readOnly
										size="small"
									/>
									<Typography variant="body2">
										تعداد امتیاز: {shop.ratingsCount}
									</Typography>
								</div>
							</div>
						</Paper>
					</div>
					<div className="panel-shop-view-cover">
						<Image
							src={shop.cover.path + shop.cover.img}
							alt={shop.name}
							layout="fill"
							objectFit="cover"
						/>
					</div>
					<div className="panel-view-content">
						<div className="panel-view-full">
							<div className="panel-view-item">
								<div className="panel-view-item-key">
									درباره فروشگاه:
								</div>
								<div className="panel-view-item-value">
									{shop.description}
								</div>
							</div>
						</div>
						<div className="panel-view-row">
							<div className="panel-view-item">
								<div className="panel-view-item-key">تلفن:</div>
								<div className="panel-view-item-value">
									{shop.phone}
								</div>
							</div>
							<div className="panel-view-item">
								<div className="panel-view-item-key">
									ایمیل:
								</div>
								<div className="panel-view-item-value">
									{shop.email}
								</div>
							</div>
						</div>
						<div className="panel-view-row">
							<div className="panel-view-item">
								<div className="panel-view-item-key">
									ساعت باز شدن فروشگاه:
								</div>
								<div className="panel-view-item-value">
									{shop.openHour}
								</div>
							</div>
							<div className="panel-view-item">
								<div className="panel-view-item-key">
									ساعت تعطیل شدن فروشگاه:
								</div>
								<div className="panel-view-item-value">
									{shop.closeHour}
								</div>
							</div>
						</div>
						<div className="panel-view-row">
							<div className="panel-view-item">
								<div className="panel-view-item-key">
									کلاس قیمتی:
								</div>
								<div className="panel-view-item-value">
									{priceClassLabel}
								</div>
							</div>
							<div className="panel-view-item">
								<div className="panel-view-item-key">
									{shop.hasDelivery
										? "سرویس دلیوری دارد"
										: "سرویس دلیوری ندارد"}
								</div>
							</div>
						</div>
						<div className="panel-view-row">
							<div className="panel-view-item">
								<div className="panel-view-item-key">آدرس:</div>
								<div className="panel-view-item-value">
									{shop.address}
								</div>
							</div>
							<div className="panel-view-item">
								<div className="panel-view-item-key">شهر:</div>
								<div className="panel-view-item-value">
									{shop.city.cityName} ({shop.city.cityState})
								</div>
							</div>
						</div>
						<div className="panel-view-full">
							<LTMap
								latitude={shop.latitude}
								longitude={shop.longitude}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
