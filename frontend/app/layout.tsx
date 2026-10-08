import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConnectWell — Make room for connection",
  description: "Meaningful community connections for the people you love.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
