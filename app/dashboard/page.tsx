"use client";

import { useEffect, useMemo, useState } from "react";
import api from "@/lib/apiClient";
import AppShell from "@/components/AppShell";
import { useCurrentUser } from "@/lib/auth";
import { statusLabel, statuses, type Task } from "@/lib/models";

export default function DashboardPage() {
  const user = useCurrentUser();
  const manager = user?.role === "Admin";
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (user?.id) {
      api
        .get<Task[]>(manager ? "/tasks" : "/tasks/my-tasks")
        .then((r) => setTasks(r.data));
    }
  }, [user?.id, manager]);

  const summary = useMemo(
    () =>
      statuses.map(
        (s) => [s, tasks.filter((t) => t.status === s).length] as const,
      ),
    [tasks],
  );

  const overdue = tasks.filter(
    (t) => t.dueDate && t.status !== "Done" && new Date(t.dueDate) < new Date(),
  );

  return (
    <AppShell title={manager ? "Tổng quan dự án" : "Tổng quan cá nhân"}>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white">
          Chào {manager ? "quản lý" : "bạn"} 👋
        </h2>
        <p className="mt-1 text-slate-300">
          Theo dõi tiến độ và tập trung vào những công việc cần ưu tiên.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map(([s, n]) => (
          <div
            key={s}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm"
          >
            <p className="text-sm font-semibold text-slate-300">
              {statusLabel[s]}
            </p>
            <p className="mt-3 text-3xl font-black text-white">{n}</p>
            <div className="mt-4 h-1.5 rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-sky-500"
                style={{
                  width: `${tasks.length ? (n / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-800 p-5">
            <h3 className="font-bold text-white">Công việc cần theo dõi</h3>
            <span className="text-xs font-bold text-rose-400">
              {overdue.length} quá hạn
            </span>
          </div>
          <div className="divide-y divide-slate-800">
            {tasks
              .filter((t) => t.status !== "Done")
              .slice(0, 6)
              .map((t) => (
                <div
                  className="flex items-center justify-between gap-4 p-5"
                  key={t.id}
                >
                  <div>
                    <p className="font-bold text-white">{t.title}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {t.projectName || "Dự án"} ·{" "}
                      {t.assigneeName || "Chưa giao"}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-300">
                    {t.dueDate
                      ? new Intl.DateTimeFormat("vi-VN").format(
                          new Date(t.dueDate),
                        )
                      : "Chưa đặt hạn"}
                  </span>
                </div>
              ))}
            {!tasks.length && (
              <p className="p-8 text-center text-sm text-slate-400">
                Chưa có dữ liệu công việc.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 p-6 text-white">
          <p className="text-sm font-bold text-sky-100">Tiến độ hoàn thành</p>
          <p className="mt-5 text-5xl font-black">
            {tasks.length
              ? Math.round(
                  (tasks.filter((t) => t.status === "Done").length /
                    tasks.length) *
                    100,
                )
              : 0}
            %
          </p>
          <p className="mt-3 text-sm text-sky-100">
            {tasks.filter((t) => t.status === "Done").length}/{tasks.length}{" "}
            công việc đã hoàn thành
          </p>
          <a
            href="/tasks"
            className="mt-8 inline-block rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-sky-400"
          >
            Mở bảng Kanban →
          </a>
        </section>
      </div>
    </AppShell>
  );
}
