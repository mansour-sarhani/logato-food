"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
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

export default function SearchSidebar({
	setData,
	setPage,
	setLimit,
	setTotal,
}) {
	const [term, setTerm] = useState("");
	const [cities, setCities] = useState([]);
	const [types, setTypes] = useState([]);
	const [selectedCity, setSelectedCity] = useState(null);
	const [selectedType, setSelectedType] = useState(null);
	const [categories, setCategories] = useState();
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [selectedSubCategory, setSelectedSubCategory] = useState(null);
	const [doReload, setDoReload] = useState(true);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const typeQuery = searchParams.get("type");
	const termQuery = searchParams.get("term");

	const query = searchParams.toString();

	const createQueryString = useCallback(
		(name, value) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);
			return params.toString();
		},
		[searchParams]
	);

	const searchTerm = useCallback(
		debounce((value) => {
			router.push(`${pathname}?${createQueryString("term", value)}`);
			setDoReload(!doReload);
		}, 1000),
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

	useEffect(() => {
		async function fetchInitialData() {
			await getAllCities(dispatch, enqueueSnackbar, setCities);
			await getAllTypes(dispatch, enqueueSnackbar, setTypes);

			if (termQuery) {
				setTerm(termQuery);
			}
			if (typeQuery) {
				setSelectedType(typeQuery);
				getCategoriesByTypeValue(
					dispatch,
					enqueueSnackbar,
					typeQuery,
					setCategories
				);
			}
		}
		fetchInitialData();
	}, []);

	useEffect(() => {
		async function getSearchData() {
			await userSearchAll(
				dispatch,
				enqueueSnackbar,
				query,
				setData,
				setPage,
				setLimit,
				setTotal
			);
		}
		getSearchData();
	}, [query, dispatch, enqueueSnackbar]);

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
							value={term}
							onChange={(e) => {
								setTerm(e.target.value);
								searchTerm(e.target.value);
							}}
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
