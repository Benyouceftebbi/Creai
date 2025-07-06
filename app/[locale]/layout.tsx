import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from '../context/theme-provider';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import FacebookPixel from '@/components/FacebookPixel';

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
title: 'CreativeAI – Instantly Generate Scroll-Stopping Ads with AI',
description: 'Turn product photos into high-converting ad images and videos in seconds. Powered by AI. No design skills needed. Just upload, prompt, and launch.'
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: "en" | "fr" | "ar" }>;
}) {
  const locale = await params;
  // Ensure `locale` is valid
  if (!locale || !routing.locales.includes(locale.locale)) {
    notFound(); // Redirect to 404 if invalid
  }

  // Fetch messages asynchronously
  const messages = await getMessages(locale);

  return (
    <html lang={locale.locale} suppressHydrationWarning>
      
      <body>
        <NextIntlClientProvider locale={locale.locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <img height="1" width="1" style="display:none"
              src="https://www.facebook.com/tr?id=613067405045316&ev=PageView&noscript=1" />
            `,
          }}
        />
              <FacebookPixel pixelId="613067405045316" />
            <AuthProvider>
              {children}
            <Toaster />
            </AuthProvider></ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
