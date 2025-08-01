import type { Metadata } from "next";
import "./globals.css";
import { ModalProvider } from "@/providers/modal-provider";
import ReduxProvider from "@/providers/redux-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "رستوران ترخینه",
  description:
    "غذاهای سالم و گیاهی را همراه با مهمان‌نوازی بی‌نظیر ایرانی در رستوران‌های ترخینه تجربه کنید. به صورت آنلاین سفارش دهید و از محیط دلنشین و آرامش‌بخش لذت ببرید.",
  keywords: [
    "Tarkhineh restaurant chain",
    "Healthy food",
    "Vegetarian cuisine",
    "Online food ordering",
    "Appetizers and drinks",
    "Cozy atmosphere",
    "High-quality food",
    "Iranian hospitality",
    "Diverse menu",
    "Tarkhineh franchise",
    "رستوران‌های زنجیره‌ای ترخینه",
    "غذای سالم",
    "غذای گیاهی",
    "سفارش آنلاین غذا",
    "پیش‌غذا و نوشیدنی",
    "محیط دلنشین",
    "کیفیت بالای غذاها",
    "مهمان‌نوازی ایرانی",
    "منوی متنوع رستوران",
    "نمایندگی ترخینه",
  ],
  openGraph: {
    title: "رستوران های زنجیره ایی ترخینه - سالم و ارگانیک",
    description:
      "غذاهای سالم و گیاهی را همراه با مهمان‌نوازی بی‌نظیر ایرانی در رستوران‌های ترخینه تجربه کنید. به صورت آنلاین سفارش دهید و از محیط دلنشین و آرامش‌بخش لذت ببرید.",
    url: "https://tarkhineh-theta.vercel.app/",
    siteName: "ترخینه",
    images: [
      {
        url: "/Logo.svg",
        width: 1200,
        height: 630,
        alt: "Tarkhineh Restaurant",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@Tarkhineh",
    title: "Tarkhineh Restaurant",
    description:
      "Healthy food, vegetarian options, and cozy atmosphere at Tarkhineh.",
    images: ["/Logo.svg"],
  },
  alternates: {
    canonical: "https://tarkhineh-theta.vercel.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="ltr">
      <head>
        <link rel="icon" href="/Logo.svg" />
      </head>
      <body className={`font-estedad`}>
        <ReduxProvider>
          <AuthProvider>
            <ModalProvider />
            {children}
            <Toaster
              position="top-center"
              richColors
              expand={false}
              closeButton
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: "inherit",
                },
              }}
            />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
