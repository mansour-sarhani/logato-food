import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import getAllTypes from "@/functions/type/getAllTypes";
import LTImage from "@/components/global/LTImage";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

export default function TypesGrid() {
	const [types, setTypes] = useState();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();

	const createSkeletons = () => {
		const skeletons = [];
		for (let i = 0; i < 5; i++) {
			skeletons.push(
				<div className="shop-type-item">
					<Skeleton
						sx={{ bgcolor: "grey.900" }}
						key={i}
						variant="circular"
						width={80}
						height={80}
						animation="wave"
					/>
					<Skeleton
						sx={{ bgcolor: "grey.900" }}
						key={i + 99}
						variant="text"
						width={80}
						animation="wave"
					/>
				</div>
			);
		}
		return skeletons;
	};

	useEffect(() => {
		async function fetchShopTypes() {
			await getAllTypes(dispatch, enqueueSnackbar, setTypes);
		}
		fetchShopTypes();
	}, []);

	return !types ? null : types.length === 0 ? (
		<div className="shop-types-container">
			<div className="shop-types-grid">{createSkeletons()}</div>
		</div>
	) : (
		<div className="shop-types-container">
			<div className="shop-types-grid">
				{types.map((type) => (
					<div
						key={type.id}
						className="shop-type-item"
						onClick={() =>
							router.push(`/search-results?type=${type.value}`)
						}
					>
						<LTImage
							name={type.image}
							alt={type.label}
							width={80}
							height={80}
							variant="circle"
						/>

						<Typography variant="h6" component="h6">
							{type.label}
						</Typography>
					</div>
				))}
			</div>
		</div>
	);
}
