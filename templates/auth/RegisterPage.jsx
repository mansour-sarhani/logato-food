"use client";

import Container from "@mui/material/Container";
import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="page-wrapper">
			<Container>
				<div className="auth-page-container">
					<div className="auth-page-box">
						<RegisterForm />
					</div>
					<div className="auth-page-image">
						<Image
							src="/assets/images/front/register.svg"
							width={700}
							height={645}
							alt="ثبت نام"
						/>
					</div>
				</div>
			</Container>
		</div>
	);
}
