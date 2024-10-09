'use client';

import Header from '@/layouts/header/Header';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import Image from 'next/image';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const searchParams = useSearchParams();
    const logout = searchParams.get('logout');

    useEffect(() => {
        if (logout === 'success') {
            router.replace('/auth/login');
            enqueueSnackbar('خروج از حساب کاربری', {
                variant: 'info',
            });
        }
    }, [searchParams]);

    return (
        <div className="inner-page auth-page">
            <div className="lt-container">
                <div className="auth-page-container">
                    <div className="auth-page-box">
                        <LoginForm />
                    </div>
                    <div className="auth-page-image">
                        <Image
                            src="/assets/images/front/login.svg"
                            width={700}
                            height={645}
                            alt="ورود"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
