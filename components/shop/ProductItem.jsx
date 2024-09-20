import FA from "@/utils/localizationFa";
import LTImage from "@/components/global/LTImage";
import ProductPrice from "@/components/shop/ProductPrice";
import Bookmark from "@/components/global/Bookmark";
import ProductModal from "@/components/shop/ProductModal";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import Paper from "@mui/material/Paper";

export default function ProductItem({ product, shop, user, showModal = true }) {
	return (
		<Paper elevation={1}>
			<div className="shop-product-item" id={`product-${product._id}`}>
				<div className="shop-product-main">
					<div className="shop-product-image">
						<LTImage
							name={product.image}
							alt={product.name}
							width={100}
							height={100}
						/>
					</div>
					<div className="shop-product-info">
						<div className="shop-product-header">
							<div className="shop-product-title">
								<Typography variant="h6">
									{product.name}
								</Typography>
								<div className="shop-product-rating">
									<Rating
										name="read-only"
										value={product.averageRating}
										precision={0.1}
										readOnly
										size="small"
										sx={{
											direction: "ltr",
										}}
									/>
									<Typography variant="body2">
										(امتیاز: {product.averageRating} از
										مجموع {product.ratingsCount} نظر)
									</Typography>
								</div>
							</div>
							<div className="product-item-btns">
								<Bookmark id={product._id} type={"product"} />

								{showModal && (
									<ProductModal
										product={product}
										shop={shop}
										user={user}
									/>
								)}
							</div>
						</div>
						<ProductPrice product={product} />
					</div>
				</div>
				<div className="shop-product-alt">
					<div className="shop-product-description">
						<Typography variant="body2">
							{product.description}
						</Typography>
					</div>
					<div className="shop-product-measurement">
						{product.size && (
							<Typography variant="body2">
								{product.size} {FA.unit[product.sizeUnit]}
							</Typography>
						)}
						{product.weight && (
							<Typography variant="body2">
								{product.weight} {FA.unit[product.weightUnit]}
							</Typography>
						)}
						{product.quantity && (
							<Typography variant="body2">
								{product.quantity} عدد
							</Typography>
						)}
					</div>
				</div>
			</div>
		</Paper>
	);
}
