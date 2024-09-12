"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import userSearchAll from "@/functions/user/userSearchAll";
import getAllCities from "@/functions/city/getAllCities";
import getAllTypes from "@/functions/type/getAllTypes";
import getCategoriesByTypeValue from "@/functions/category/getCategoriesOfType";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Typography from "@mui/material/Typography";
import debounce from "lodash/debounce";

export default function SearchSidebar({ setData }) {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [sortBy, setSortBy] = useState("createdAt");
	const [order, setOrder] = useState("desc");
	const [term, setTerm] = useState(null);
	const [cities, setCities] = useState([]);
	const [types, setTypes] = useState([]);
	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedType, setSelectedType] = useState(null);
	const [categories, setCategories] = useState();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSubCategory, setSelectedSubCategory] = useState(null);
	const [doReload, setDoReload] = useState(true);

	const dispatch = useDispatch();
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const { enqueueSnackbar } = useSnackbar();

	const loading = useSelector((state) => state.user.status);

	const city = searchParams.get("city");
	const type = searchParams.get("type");
	const termQuery = searchParams.get("term");
	const category = searchParams.get("category");
	const subCategory = searchParams.get("subCategory");
	const latitude = searchParams.get("latitude");
	const longitude = searchParams.get("longitude");
	const pageQuery = searchParams.get("page");
	const limitQuery = searchParams.get("limit");
	const sortByQuery = searchParams.get("sortBy");
	const orderQuery = searchParams.get("order");

	const query = searchParams.toString();

	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const searchByTerm = useCallback(
		debounce((e) => {
			setTerm(e.target.value);
			router.push(
				`${pathname}?${createQueryString("term", e.target.value)}`
			);
			setDoReload(!doReload);
		}, 500),
		[createQueryString, pathname, router, setDoReload]
	);

	const handleCityChange = (cityValue) => {
		setSelectedCity(cityValue);
		router.push(`${pathname}?${createQueryString("city", cityValue)}`);
		setDoReload(!doReload);
	};

	const handleTypeChange = (typeValue) => {
		setSelectedType(typeValue);
		setSelectedCategory("");
		setSelectedSubCategory("");
		getCategoriesByTypeValue(
			dispatch,
			enqueueSnackbar,
			typeValue,
			setCategories
		);
		router.push(`${pathname}?${createQueryString("type", typeValue)}`);
		setDoReload(!doReload);
	};

	const handleCategoryChange = (categoryValue) => {
		setSelectedCategory((prevSelected) => {
			const newSelected =
				prevSelected === categoryValue ? "" : categoryValue;
			const queryString = createQueryString("category", newSelected);
			router.push(`${pathname}?${queryString}`);
			setDoReload(!doReload);
			return newSelected;
		});
	};

	const handleSubCategoryChange = (subCategoryValue) => {
		setSelectedSubCategory((prevSelected) => {
			const newSelected =
				prevSelected === subCategoryValue ? "" : subCategoryValue;
			const queryString = createQueryString("subCategory", newSelected);
			router.push(`${pathname}?${queryString}`);
			setDoReload(!doReload);
			return newSelected;
		});
	};

	const handleSearchClick = () => {
		router.push(`${pathname}?${createQueryString("term", term)}`);
		setDoReload(!doReload);
	};

	useEffect(() => {
		async function fetchInitialData() {
			await getAllCities(dispatch, enqueueSnackbar, setCities);
			await getAllTypes(dispatch, enqueueSnackbar, setTypes);

			if (termQuery) {
				setTerm(termQuery);
			}
			if (city) {
				setSelectedCity(city);
			}
			if (type) {
				setSelectedType(type);
				getCategoriesByTypeValue(
					dispatch,
					enqueueSnackbar,
					type,
					setCategories
				);
			}
		}
		fetchInitialData();
	}, []);

	// useEffect(() => {
	// 	if (query) {
	// 		async function getSearchData() {
	// 			await userSearchAll(dispatch, enqueueSnackbar, query, setData);
	// 		}
	// 		getSearchData();
	// 	} else {
	// 		return;
	// 	}
	// }, [searchParams]);

	return (
		<div className="search-sidebar-container">
			<div className="sidebar-filters">
				<div className="filter-item">
					<FormControl>
						<FormLabel id="city" className="filter-item-label">
							جستجوی زنده
						</FormLabel>
						<input
							className="lt-input"
							placeholder="نام فروشگاه یا آیتم ..."
							value={term || ""}
							onChange={(e) => searchByTerm(e)}
						/>
					</FormControl>
				</div>

				<div className="filter-item">
					<FormControl>
						<FormLabel id="city" className="filter-item-label">
							شهر
						</FormLabel>
						<RadioGroup
							aria-labelledby="city"
							name="radio-buttons-group"
							value={selectedCity}
						>
							{cities.map((city) => (
								<FormControlLabel
									key={city.id}
									value={city.value}
									control={<Radio />}
									label={city.label}
									onChange={(e) =>
										handleCityChange(e.target.value)
									}
								/>
							))}
						</RadioGroup>
					</FormControl>
				</div>

				<div className="filter-item">
					<FormControl>
						<FormLabel id="type" className="filter-item-label">
							نوع فروشگاه
						</FormLabel>
						<RadioGroup
							aria-labelledby="type"
							name="radio-buttons-group"
							value={selectedType}
						>
							{types.map((type) => (
								<FormControlLabel
									key={type.id}
									value={type.value}
									control={<Radio />}
									label={type.label}
									onChange={(e) =>
										handleTypeChange(e.target.value)
									}
								/>
							))}
						</RadioGroup>
					</FormControl>
				</div>
				<div className="filter-item">
					<FormControl>
						<FormLabel id="category" className="filter-item-label">
							دسته بندی
						</FormLabel>
						<FormGroup>
							{categories ? (
								categories.length === 0 ? (
									<Typography>
										دسته بندی ای برای این نوع فروشگاه وجود
										ندارد.
									</Typography>
								) : (
									categories.map((category) => (
										<div key={category.id}>
											<FormControlLabel
												control={
													<Checkbox
														checked={
															selectedCategory ===
															category.value
														}
														onChange={() =>
															handleCategoryChange(
																category.value
															)
														}
													/>
												}
												label={category.label}
											/>
											{category.subCategories &&
												category.subCategories.map(
													(subCategory) => (
														<div
															key={
																subCategory._id
															}
															style={{
																marginRight:
																	"20px",
															}}
														>
															<FormControlLabel
																control={
																	<Checkbox
																		checked={
																			selectedSubCategory ===
																			subCategory.value
																		}
																		onChange={() =>
																			handleSubCategoryChange(
																				subCategory.value
																			)
																		}
																	/>
																}
																label={
																	subCategory.label
																}
															/>
														</div>
													)
												)}
										</div>
									))
								)
							) : (
								<Typography>
									لطفا ابتدا یک نوع فروشگاه را انتخاب کنید.
								</Typography>
							)}
						</FormGroup>
					</FormControl>
				</div>
			</div>
		</div>
	);
}
