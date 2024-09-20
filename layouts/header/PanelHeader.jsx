import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import EmailIcon from "@mui/icons-material/Email";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Loading from "@/components/global/Loading";
import userLogout from "@/functions/auth/userLogout";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import { toggleTheme } from "@/redux/features/publicSlice";
import HeaderAddress from "@/components/global/HeaderAddress";

export default function PanelHeader({ user }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
		dispatch(toggleTheme({ theme: isDarkMode ? "light" : "dark" }));
	};

	const handleLogout = async () => {
		await userLogout(enqueueSnackbar, router);
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
		if (isDarkMode) {
			document.documentElement.setAttribute("data-theme", "dark");
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.removeAttribute("data-theme");
			document.documentElement.classList.remove("dark");
		}
	}, [isDarkMode]);

	return !user ? (
		<Loading isLoading={true} />
	) : (
		<header className="panel-header-container">
			<div className="panel-header-menu">
				<ul>
					<li className="menu-item link-item">
						<Link href="/">
							<HomeOutlinedIcon />
							صفحه اصلی
						</Link>
					</li>
					<li className="menu-item link-item">
						<HeaderAddress />
					</li>
				</ul>
			</div>
			<div className="panel-header-menu">
				<ul>
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
					<li className="menu-item util-item">
						<Tooltip title="پیام ها">
							<Button
								variant="text"
								onClick={toggleDarkMode}
								className="header-util-button"
							>
								<EmailIcon />
							</Button>
						</Tooltip>
					</li>
					<li className="menu-item util-item">
						<Tooltip title={isDarkMode ? "حالت روز" : "حالت شب"}>
							<Button
								variant="text"
								onClick={toggleDarkMode}
								className="header-util-button"
							>
								{isDarkMode ? (
									<LightModeOutlinedIcon />
								) : (
									<DarkModeIcon />
								)}
							</Button>
						</Tooltip>
					</li>
				</ul>
			</div>
		</header>
	);
}
