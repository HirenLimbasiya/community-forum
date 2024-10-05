"use client";

import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TopicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ProtectedRoute>
        <Header />
        <main>{children}</main>
      </ProtectedRoute>
    </div>
  );
}
