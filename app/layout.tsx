import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MY BUS - Your Journey, Your Bus",
  description: "Book bus tickets across India with ease. Compare operators, prices, and amenities for the best travel experience.",
  applicationName: "MY BUS",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    title: "MY BUS",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6A1B9A" },
    { media: "(prefers-color-scheme: dark)", color: "#4A148C" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased bg-[#F8F0FC] text-[#1E293B]`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <Script
          src="https://readdy.ai/api/public/assistant/widget?projectId=243026cd-9cac-44e4-8a2d-a56ed55733dc"
          strategy="afterInteractive"
          data-mode="hybrid"
          data-voice-show-transcript="true"
          data-theme="light"
          data-size="compact"
          data-accent-color="#14B8A6"
          data-button-base-color="#6A1B9A"
          data-button-accent-color="#FFFFFF"
          data-main-label="Talk with MY BUS"
          data-start-button-text="Call"
          data-end-button-text="End"
          data-empty-chat-message="How can I help plan your journey?"
          data-empty-voice-message="Ask me about routes, prices, or bookings"
        />
      </body>
    </html>
  );
}
