"use client";

import { useState } from "react";
import SearchSidebar from "@/layouts/sidebar/SearchSidebar";
import NoData from "@/components/global/NoData";
import LTProgress from "@/components/global/LTProgress";
import ShopItem from "@/components/shop/ShopItem";
import Button from "@mui/material/Button";

export default function SearchPage() {
	const [data, setData] = useState();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
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
						<SearchSidebar
							setData={setData}
							setLimit={setLimit}
							setPage={setPage}
							setTotal={setTotal}
						/>
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
									{data.map((shop) => (
										<ShopItem key={shop.id} shop={shop} />
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
