import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "차트앱",
  description: "next js 차트앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
