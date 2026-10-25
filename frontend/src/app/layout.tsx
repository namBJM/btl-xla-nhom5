import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resim — Khôi phục ảnh",
  description: "Không gian phục hồi ảnh cũ với cấu hình rõ ràng và trung thực.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
