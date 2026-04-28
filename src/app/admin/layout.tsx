import type { Metadata } from "next";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  title: "Admin — Alexa Tours",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F3E8" }}>
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
