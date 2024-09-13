import Image from "next/image";
import LTMap from "@/components/global/LTMap";
import LTImage from "@/components/global/LTImage";
import LTProgress from "@/components/global/LTProgress";
import Alert from "@mui/material/Alert";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

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
		<div className="panel-shop-view">
			{shop.status === "underReview" && (
				<Alert severity="info" sx={{ marginBottom: "10px" }}>
					فروشگاه شما در صف بازبینی برای انتشار قرار دارد.
				</Alert>
			)}
			{shop.status === "banned" && (
				<Alert severity="error" sx={{ marginBottom: "10px" }}>
					فروشگاه شما به دلیل نقض قوانین سایت مسدود شده است.
				</Alert>
			)}
			{shop.status === "inactive" && (
				<Alert severity="warning" sx={{ marginBottom: "10px" }}>
					فروشگاه شما غیرفعال شده است.
				</Alert>
			)}
			{shop.status === "active" && (
				<Alert severity="success" sx={{ marginBottom: "10px" }}>
					فروشگاه شما فعال است.
				</Alert>
			)}

			<Paper
				className="lt-paper"
				elevation={3}
				sx={{ marginBottom: "10px" }}
			>
				<div className="panel-shop-view-header">
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
								name="read-only"
								value={shop.averageRating}
								precision={0.1}
								readOnly
								size="small"
								sx={{ direction: "ltr" }}
							/>
							<Typography variant="body2">
								(امتیاز: {shop.averageRating} از مجموع{" "}
								{shop.ratingsCount} نظر)
							</Typography>
						</div>
					</div>
				</div>
			</Paper>

			<Paper className="lt-paper" elevation={3}>
				<div className="panel-shop-view-cover">
					<Image
						src={shop.cover.path + shop.cover.img}
						alt={shop.name}
						layout="fill"
						objectFit="cover"
					/>
				</div>
				<div className="panel-shop-view-wrapper">
					<div className="panel-shop-view-map">
						<LTMap
							latitude={shop.latitude}
							longitude={shop.longitude}
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
								<div className="panel-view-item-key">آدرس:</div>
								<div className="panel-view-item-value">
									{shop.address}
								</div>
							</div>
							<div className="panel-view-item">
								<div className="panel-view-item-key">شهر:</div>
								<div className="panel-view-item-value">
									{shop.city.cityLabel} ({shop.city.cityState}
									)
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
									{shop.hasDelivery ? (
										<Chip
											icon={<CheckCircleIcon />}
											label="سرویس دلیوری دارد"
											color="success"
										/>
									) : (
										<Chip
											icon={<CancelIcon />}
											label="سرویس دلیوری ندارد"
											color="error"
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Paper>
		</div>
	);
}
