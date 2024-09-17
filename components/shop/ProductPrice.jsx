import { priceFormatter } from "@/utils/priceFormatter";
import Typography from "@mui/material/Typography";

export default function ProductPrice({ product }) {
	return (
		<div className="shop-product-price">
			{product.discount ? (
				<Typography
					variant="body2"
					className="product-discounted-price"
				>
					{priceFormatter(product.price)}
				</Typography>
			) : (
				<Typography variant="body1" className="product-final-price">
					{priceFormatter(product.finalPrice)}
				</Typography>
			)}
			{product.discount && (
				<Typography variant="body1" className="product-final-price">
					{priceFormatter(product.finalPrice)}
				</Typography>
			)}
			<Typography variant="body2">تومان</Typography>
		</div>
	);
}
