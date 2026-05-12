import type { Metadata, Viewport } from "next";
import { Nanum_Myeongjo } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const font = Nanum_Myeongjo({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "축의계산기",
  description: "결혼식 축의금 정산 도우미. 하객 명단, 지출 관리, 양가 정산까지.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2E5E38",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={font.className}>
        {children}
        <Script src="//t1.kakaocdn.net/kas/static/ba.min.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
