import FA from "@/utils/localizationFa";
import LTMap from "@/components/map/LTMap";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NavigationIcon from "@mui/icons-material/Navigation";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import StoreIcon from "@mui/icons-material/Store";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import EmailIcon from "@mui/icons-material/Email";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import MopedIcon from "@mui/icons-material/Moped";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ShopInfo({ shop }) {
	return (
		<div className="shop-single-info">
			<div className="shop-single-heading">
				<Typography variant="h5">اطلاعات فروشگاه</Typography>
			</div>
			<div className="shop-single-row">
				<StoreIcon />
				<label>نوع فروشگاه:</label>
				<Typography variant="body1">{shop.type.typeLabel}</Typography>
			</div>
			<div className="shop-single-row">
				<LocationOnIcon />
				<label>استان:</label>
				<Typography variant="body1">{shop.city.cityState}</Typography>
			</div>
			<div className="shop-single-row">
				<LocationOnIcon />
				<label>شهر:</label>
				<Typography variant="body1">{shop.city.cityLabel}</Typography>
			</div>
			<div className="shop-single-row">
				<PhoneEnabledIcon />
				<label>تلفن:</label>
				<Typography variant="body1">{shop.phone}</Typography>
			</div>
			<div className="shop-single-row">
				<EmailIcon />
				<label>ایمیل:</label>
				<Typography variant="body1">{shop.email}</Typography>
			</div>
			<div className="shop-single-row">
				<WatchLaterIcon />
				<label>ساعات کاری:</label>
				<Typography variant="body1">
					{shop.openHour} الی {shop.closeHour}
				</Typography>
			</div>
			<div className="shop-single-row">
				<MonetizationOnIcon />
				<label>کلاس قیمتی:</label>
				<Typography variant="body1">
					{FA.priceClass[shop.priceClass]}
				</Typography>
			</div>
			<div className="shop-single-row">
				<MopedIcon />
				<label>سرویس دلیوری:</label>
				<Typography variant="body1">
					{shop.hasDelivery ? (
						<Chip
							icon={<CheckCircleIcon />}
							label={"بله"}
							color="success"
						/>
					) : (
						<Chip
							icon={<CancelIcon />}
							label={"خیر"}
							color="error"
						/>
					)}
				</Typography>
			</div>
			<div className="shop-single-row">
				<NavigationIcon />
				<label>آدرس:</label>
				<Typography variant="body1">{shop.address}</Typography>
			</div>
			<div className="shop-single-row">
				<LTMap
					latitude={shop.latitude}
					longitude={shop.longitude}
					height="200px"
				/>
			</div>
		</div>
	);
}
