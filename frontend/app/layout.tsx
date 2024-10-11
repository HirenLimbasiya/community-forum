import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "./ReduxProvider";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Community Forum",
  description: "Official Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ReduxProvider>{children}</ReduxProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
