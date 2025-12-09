import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ServiceHub',
  description: 'Home service booking website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.variable} font-sans antialiased bg-white`}>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              className:
                'bg-green-600 text-white font-semibold px-4 py-3 rounded-lg shadow-lg border border-green-400',
              iconTheme: {
                primary: 'white',
                secondary: '#16a34a',
              },
            },
            error: {
              className:
                'bg-red-600 text-white font-semibold px-4 py-3 rounded-lg shadow-lg border border-red-400',
              iconTheme: {
                primary: 'white',
                secondary: '#dc2626',
              },
            },
          }}
        />

        {/* Header */}
        <Header />

        {/* Main Page Body */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
