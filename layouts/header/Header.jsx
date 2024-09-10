"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import userLogout from "@/functions/auth/userLogout";
import Logo from "@/components/global/Logo";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";

export default function Header({ user }) {
	const [isHome, setIsHome] = useState(true);
	const [isDarkMode, setIsDarkMode] = useState(false);

	const router = useRouter();
	const pathname = usePathname();

	const { enqueueSnackbar } = useSnackbar();

	const handleLogout = async () => {
		await userLogout(enqueueSnackbar, router);
	};

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	useEffect(() => {
		if (user === false && pathname.startsWith("/panel/")) {
			router.push("/auth/login");
		}
	}, [user, pathname, router]);

	useEffect(() => {
		if (pathname === "/") {
			setIsHome(true);
		} else {
			setIsHome(false);
		}
	}, [pathname]);

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.setAttribute("data-theme", "dark");
		} else {
			document.documentElement.removeAttribute("data-theme");
		}
	}, [isDarkMode]);

	return (
		<header
			className={isHome ? "header home-header" : "header front-header"}
		>
			<div className="lt-container">
				<div className="header-container">
					<div className="header-menu front-menu">
						<ul>
							<li className="menu-item link-item">
								<Link href="/">
									<HomeOutlinedIcon />
									خانه
								</Link>
							</li>
							{user && (
								<li className="menu-item link-item">
									<div className="header-address">
										<GpsFixedIcon />
										{user.addresses.length > 0 ? (
											<div className="header-default-address">
												<Typography variant="body">
													{
														user.addresses.find(
															(addr) =>
																addr.default
														).title
													}
												</Typography>
												<Typography variant="body2">
													(
													{
														user.addresses.find(
															(addr) =>
																addr.default
														).address
													}
													)
												</Typography>
											</div>
										) : (
											"آدرس خود را انتخاب کنید"
										)}
									</div>
								</li>
							)}
						</ul>
					</div>
					<div className="header-logo">
						<Link href={"/"}>
							<Logo
								color={isHome ? "white" : "black"}
								width={243}
								height={50}
							/>
						</Link>
					</div>
					<div className="header-menu front-menu left-menu">
						<ul>
							{user ? (
								<>
									<li className="menu-item button-item">
										<Button
											variant="text"
											color="error"
											onClick={handleLogout}
										>
											<LogoutOutlinedIcon />
											خروج
										</Button>
									</li>
									<li className="menu-item link-item">
										<Link href="/panel/profile">
											<DashboardCustomizeOutlinedIcon />
											پنل کاربری
										</Link>
									</li>
								</>
							) : (
								<>
									<li className="menu-item link-item">
										<Link href="/auth/register">
											<HowToRegOutlinedIcon />
											ثبت نام
										</Link>
									</li>
									<li className="menu-item link-item">
										<Link href="/auth/login">
											<VpnKeyOutlinedIcon />
											ورود
										</Link>
									</li>
								</>
							)}

							<li
								className="menu-item button-item"
								style={{ marginLeft: 0 }}
							>
								<Tooltip
									title={isDarkMode ? "حالت روز" : "حالت شب"}
								>
									<Button
										variant="text"
										onClick={toggleDarkMode}
										className="header-util-button"
									>
										{isDarkMode ? (
											<LightModeOutlinedIcon />
										) : (
											<DarkModeOutlinedIcon />
										)}
									</Button>
								</Tooltip>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</header>
	);
}
