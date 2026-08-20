"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/lib/auth";
import api from "@/lib/apiClient";

const links = [
  ["/dashboard", "▦", "Tổng quan"],
  ["/tasks", "✓", "Bảng công việc"],
  ["/projects", "◈", "Dự án"],
  ["/users", "◉", "Thành viên"],
] as const;

export default function AppShell({ children, title, action }: { children: React.ReactNode; title: string; action?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const isManager = user?.role === "Admin";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
        <Link href="/dashboard" className="flex h-20 items-center gap-3 px-7 text-xl font-black tracking-tight text-sky-400">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-sky-500 text-sm font-black text-slate-950">T</span>
          TaskFlow
        </Link>
        <div className="mx-5 border-t border-slate-800" />
        <nav className="flex-1 space-y-1 px-4 py-6">
          {links
            .filter(([, , label]) => isManager || (label !== "Dự án" && label !== "Thành viên"))
            .map(([href, icon, label]) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  pathname === href || (href === "/projects" && pathname.startsWith("/projects/"))
                    ? "bg-sky-500/15 text-sky-300"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            ))}
        </nav>
        <div className="m-4 rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-bold text-slate-100">{user?.email || "Tài khoản"}</p>
          <p className="mt-1 text-xs text-slate-400">{isManager ? "Quản lý dự án" : "Thành viên"}</p>
          <button
            onClick={async () => {
              try {
                await api.post("/auth/logout");
              } finally {
                localStorage.removeItem("token");
                router.push("/login");
              }
            }}
            className="mt-3 text-xs font-bold text-rose-400 hover:text-rose-300"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <main className="lg:ml-64">
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-5 backdrop-blur-lg lg:px-9">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">TaskFlow workspace</p>
            <h1 className="mt-1 text-xl font-bold text-white">{title}</h1>
          </div>
          {action}
        </header>
        <div className="p-5 lg:p-9">{children}</div>
      </main>
    </div>
  );
}
