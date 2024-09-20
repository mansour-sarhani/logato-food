import Link from "next/link";
import LTImage from "@/components/global/LTImage";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";

export default function ShopItem({ shop, _id }) {
	return (
		<Link href={`/shop/${_id ? shop._id : shop.id}`}>
			<div className="shop-item">
				<div className="shop-item-image">
					<div className="shop-item-cover-image">
						<LTImage name={shop.cover} width={300} height={140} />
					</div>
					<div className="shop-item-logo-image">
						<LTImage
							name={shop.logo}
							variant="circle"
							width={80}
							height={80}
						/>
					</div>
				</div>
				<div className="shop-item-details">
					<div className="shop-item-name">
						<h6>{shop.name}</h6>
					</div>
					<div className="shop-item-rating">
						<Rating
							name="read-only"
							value={shop.averageRating}
							precision={0.1}
							readOnly
							size="small"
							sx={{
								direction: "ltr",
							}}
						/>
					</div>
					<div className="shop-item-categories">
						{shop.categories.map((category) => (
							<Chip
								key={category.categoryId}
								label={category.categoryLabel}
								size="small"
							/>
						))}
					</div>
				</div>
			</div>
		</Link>
	);
}
