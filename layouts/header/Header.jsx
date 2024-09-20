"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import userLogout from "@/functions/auth/userLogout";
import Logo from "@/components/global/Logo";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HowToRegOutlinedIcon from "@mui/icons-material/HowToRegOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import HeaderAddress from "@/components/global/HeaderAddress";
import { toggleTheme } from "@/redux/features/publicSlice";

export default function Header({ user }) {
	const [isHome, setIsHome] = useState(true);
	const [isDarkMode, setIsDarkMode] = useState(false);

	const router = useRouter();
	const pathname = usePathname();

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	const handleLogout = async () => {
		await userLogout(enqueueSnackbar, router);
	};

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
		dispatch(toggleTheme({ theme: isDarkMode ? "light" : "dark" }));
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const theme = localStorage.getItem("theme");
			if (theme === "dark") {
				setIsDarkMode(true);
				dispatch(toggleTheme({ theme: "dark" }));
			} else {
				setIsDarkMode(false);
				dispatch(toggleTheme({ theme: "light" }));
			}
		}
	}, [dispatch]);

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
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.removeAttribute("data-theme");
			document.documentElement.classList.remove("dark");
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
									<HeaderAddress />
								</li>
							)}
						</ul>
					</div>
					<div className="header-logo">
						<Link href={"/"}>
							<Logo
								color={isHome || isDarkMode ? "white" : "black"}
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
