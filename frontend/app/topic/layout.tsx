"use client"

import Header from "../components/Header";
import ProtectedRoute from "../components/ProtectedRoute";

export default function TopicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoute>
          <Header />
          <main>{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
