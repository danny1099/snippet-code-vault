import type { Metadata } from "next";
import { globalFont } from "@/config/fonts";
import { I18nProvider } from "@/lib/providers";
import "@/globals.css";

interface RootLayoutProps extends Children {
  params: Promise<{ locale: string }>;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en">
      <body className={`${globalFont.className} antialiased`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Code Vault",
  description:
    "It is a modern platform for managing code snippets with social, collaborative, and productivity capabilities.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/images/app-logo.svg",
        href: "/images/app-logo.svg",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/images/app-logo-dark.svg",
        href: "/images/app-logo-dark.svg",
      },
    ],
  },
};
