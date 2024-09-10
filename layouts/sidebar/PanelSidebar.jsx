"use client";

import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Loading from "@/components/global/Loading";

export default function PanelSidebar({ user }) {
	const path = usePathname();

	let roleLabel = "";
	if (user && user.role === "superAdmin") {
		roleLabel = "سوپر ادمین";
	} else if (user && user.role === "admin") {
		roleLabel = "ادمین";
	} else if (user && user.role === "owner") {
		roleLabel = "فروشنده";
	} else if (user && user.role === "viewer") {
		roleLabel = "کاربر";
	}

	return !user ? (
		<Loading isLoading={true} />
	) : (
		<div className="panel-sidebar-container">
			<div className="panel-sidebar-top">
				<div className="panel-sidebar-avatar">
					<Avatar
						alt={user.firstName}
						src={user.avatar.path + user.avatar.img}
						sx={{ width: 50, height: 50 }}
					/>
				</div>
				<div className="panel-sidebar-top-text">
					<Typography variant="h6">
						{user.firstName} {user.lastName}
					</Typography>
					<Typography variant="span">{roleLabel}</Typography>
				</div>
			</div>
			<div className="panel-sidebar-menu">
				<ul>
					{(user.role === "superAdmin" || user.role === "admin") && (
						<>
							<div className="panel-sidebar-separator">
								<Typography variant="h6">پنل ادمین</Typography>
							</div>
							<li
								className={
									path === "/panel/city"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/city">مدیریت شهرها</Link>
							</li>
							<li
								className={
									path === "/panel/type"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/type">
									مدیریت نوع فروشگاه
								</Link>
							</li>
							<li
								className={
									path === "/panel/category"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/category">
									مدیریت دسته بندی
								</Link>
							</li>
							<li
								className={
									path === "/panel/sub-category"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/sub-category">
									مدیریت زیر دسته ها
								</Link>
							</li>
							<li
								className={
									path === "/panel/users"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/users">مدیریت کاربران</Link>
							</li>
							<li
								className={
									path === "/panel/shops"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/shops">
									مدیریت فروشگاه ها
								</Link>
							</li>
							<li
								className={
									path === "/panel/comments"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/comments">مدیریت نظرات</Link>
							</li>
						</>
					)}
					{user.role === "owner" && (
						<>
							<div className="panel-sidebar-separator">
								<Typography variant="h6">
									پنل فروشگاه
								</Typography>
							</div>
							<li
								className={
									path === "/panel/shop"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/shop">مدیریت فروشگاه</Link>
							</li>
							<li
								className={
									path === "/panel/shop/products"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/shop/products">
									مدیریت محصولات
								</Link>
							</li>
							<li
								className={
									path === "/panel/shop/comments"
										? "sidebar-menu-item active-menu"
										: "sidebar-menu-item"
								}
							>
								<Link href="/panel/shop/comments">نظرات</Link>
							</li>
						</>
					)}
					<div className="panel-sidebar-separator">
						<Typography variant="h6">پنل کاربری</Typography>
					</div>
					<li
						className={
							path === "/panel/profile"
								? "sidebar-menu-item active-menu"
								: "sidebar-menu-item"
						}
					>
						<Link href="/panel/profile">حساب کاربری</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
