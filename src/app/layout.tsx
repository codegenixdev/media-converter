import type { Metadata } from 'next';
import './globals.css';

import { Inter } from 'next/font/google';

import { Header } from '@/app/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Media Converter',
	description: 'Media converter ',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Header />
				{children}
			</body>
		</html>
	);
}
