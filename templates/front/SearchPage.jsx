"use client";

import { useState } from "react";
import Link from "next/link";
import SearchSidebar from "@/layouts/sidebar/SearchSidebar";
import LTImage from "@/components/global/LTImage";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";

export default function SearchPage() {
	const [data, setData] = useState();
	const [page, setPage] = useState(1);
	const [sortBy, setSortBy] = useState("createdAt");
	const [order, setOrder] = useState("desc");

	const handlePaginationClick = (page) => {
		setPage(page);
	};

	const handleSortClick = (sortBy, order) => {
		setSortBy(sortBy);
		setOrder(order);
	};

	return (
		<div className="inner-page search-page">
			<div className="lt-container">
				<div className="page-wrapper front-page-wrapper">
					<div className="sidebar">
						<SearchSidebar setData={setData} />
					</div>
					<div className="content">
						<div className="search-results">
							<div className="search-results-header">
								<div className="search-results-title">
									<h4>نتایج جستجو</h4>
								</div>
								<div className="search-results-sort">
									<Button
										onClick={() =>
											handleSortClick("createdAt", "desc")
										}
									>
										جدیدترین
									</Button>
									<Button
										onClick={() =>
											handleSortClick("createdAt", "asc")
										}
									>
										قدیمی ترین
									</Button>
								</div>
							</div>
							{!data ? (
								<LTProgress />
							) : data.length === 0 ? (
								<NoData />
							) : (
								<div className="search-results-grid">
									{data.map((item) => (
										<Link
											key={item.id}
											href={`/shop/${item.id}`}
										>
											<div className="search-result-item">
												<div className="search-result-item-image">
													<div className="search-result-cover-image">
														<LTImage
															name={item.cover}
															width={"100%"}
															height={"140px"}
														/>
													</div>
													<div className="search-result-logo-image">
														<LTImage
															name={item.logo}
															variant="circle"
															width={80}
															height={80}
														/>
													</div>
												</div>
												<div className="search-result-item-details">
													<div className="search-result-item-name">
														<h6>{item.name}</h6>
													</div>
													<div className="search-result-item-rating">
														<Rating
															name="read-only"
															value={
																item.averageRating
															}
															precision={0.1}
															readOnly
															size="small"
															sx={{
																direction:
																	"ltr",
															}}
														/>
													</div>
													<div className="search-result-item-categories">
														{item.categories.map(
															(category) => (
																<Chip
																	key={
																		category.categoryId
																	}
																	label={
																		category.categoryLabel
																	}
																	size="small"
																/>
															)
														)}
													</div>
												</div>
											</div>
										</Link>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
