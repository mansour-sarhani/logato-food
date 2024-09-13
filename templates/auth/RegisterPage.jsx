"use client";

import Header from "@/layouts/header/Header";
import Image from "next/image";
import RegisterForm from "@/components/forms/RegisterForm";

export default function RegisterPage() {
	return (
		<div className="inner-page auth-page">
			<Header />
			<div className="lt-container">
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
			</div>
		</div>
	);
}
