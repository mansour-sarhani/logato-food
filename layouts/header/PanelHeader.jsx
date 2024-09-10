import { useEffect, useState } from "react";
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

export default function PanelHeader({ user }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	const { enqueueSnackbar } = useSnackbar();
	const router = useRouter();

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => !prevMode);
	};

	const handleLogout = async () => {
		await userLogout(enqueueSnackbar, router);
	};

	useEffect(() => {
		if (isDarkMode) {
			document.documentElement.setAttribute("data-theme", "dark");
		} else {
			document.documentElement.removeAttribute("data-theme");
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
							خانه
						</Link>
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
