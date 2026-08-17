"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/apiClient";
import AppShell from "@/components/AppShell";
import { useCurrentUser } from "@/lib/auth";
import {
  priorityLabel,
  projectRoleLabel,
  statusLabel,
  statuses,
  type ProjectDetails,
} from "@/lib/models";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useCurrentUser();
  const [details, setDetails] = useState<ProjectDetails | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !id) return;
    setLoading(true);
    api
      .get<ProjectDetails>(`/projects/${id}/details`)
      .then(r => setDetails(r.data))
      .catch(() => setError("Không thể tải chi tiết dự án."))
      .finally(() => setLoading(false));
  }, [user?.id, id]);

  const summary = details?.taskSummary;

  return (
    <AppShell
      title="Chi tiết dự án"
      action={
        <Link href="/projects" className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50">
          ← Quay lại
        </Link>
      }
    >
      {loading && <p className="py-16 text-center text-slate-500">Đang tải...</p>}
      {error && <p className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      {details && (
        <div className="space-y-7">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${details.isArchived ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>
                  {details.isArchived ? "Đã lưu trữ" : "Đang hoạt động"}
                </span>
                <h2 className="mt-4 text-2xl font-black">{details.name}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {details.description || "Chưa có mô tả dự án."}
                </p>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>Tạo bởi <span className="font-bold text-slate-700">{details.createdByName || "Không rõ"}</span></p>
                <p className="mt-1">{new Intl.DateTimeFormat("vi-VN").format(new Date(details.createdAt))}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-3">
            <section className="rounded-2xl bg-indigo-600 p-6 text-white xl:col-span-1">
              <p className="text-sm font-bold text-indigo-100">Tiến độ hoàn thành</p>
              <p className="mt-5 text-5xl font-black">{summary?.progressPercentage ?? 0}%</p>
              <p className="mt-3 text-sm text-indigo-100">
                {summary?.completedTasks ?? 0}/{summary?.totalTasks ?? 0} công việc đã hoàn thành
              </p>
              <div className="mt-6 h-2 rounded-full bg-indigo-500">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${summary?.progressPercentage ?? 0}%` }} />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
              <h3 className="font-bold">Thống kê công việc</h3>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard label="Tổng công việc" value={summary?.totalTasks ?? 0} />
                <StatCard label="Đang làm" value={summary?.inProgressTasks ?? 0} accent="text-amber-600" />
                <StatCard label="Hoàn thành" value={summary?.completedTasks ?? 0} accent="text-emerald-600" />
                <StatCard label="Quá hạn" value={summary?.overdueTasks ?? 0} accent="text-rose-600" />
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {statuses.map(status => {
                  const count = summary?.statusCounts?.[status] ?? 0;
                  const pct = summary?.totalTasks ? (count / summary.totalTasks) * 100 : 0;
                  return (
                    <div key={status}>
                      <div className="mb-1 flex justify-between text-xs font-semibold text-slate-600">
                        <span>{statusLabel[status]}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white">
              <div className="border-b p-5">
                <h3 className="font-bold">Thành viên tham gia</h3>
                <p className="mt-1 text-xs text-slate-500">{details.members.length} người</p>
              </div>
              <div className="divide-y">
                {details.members.map(member => (
                  <div key={member.userId} className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <p className="font-bold">{member.fullName}</p>
                      <p className="mt-1 text-xs text-slate-500">{member.email}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                        {projectRoleLabel[member.projectRole] || member.projectRole}
                      </span>
                      <p className="mt-2 text-xs text-slate-400">{member.assignedTaskCount} công việc được giao</p>
                    </div>
                  </div>
                ))}
                {!details.members.length && (
                  <p className="p-8 text-center text-sm text-slate-500">Chưa có thành viên nào.</p>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b p-5">
                <div>
                  <h3 className="font-bold">Công việc gần đây</h3>
                  <p className="mt-1 text-xs text-slate-500">Cập nhật mới nhất trong dự án</p>
                </div>
                <Link href="/tasks" className="text-xs font-bold text-indigo-600">Mở bảng Kanban →</Link>
              </div>
              <div className="divide-y">
                {details.recentTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between gap-4 p-5">
                    <div>
                      <p className="font-bold">{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {task.assigneeName || "Chưa giao"} · {priorityLabel[task.priority] || task.priority}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-600">{statusLabel[task.status] || task.status}</span>
                      <p className="mt-1 text-xs text-slate-400">
                        {task.dueDate ? new Intl.DateTimeFormat("vi-VN").format(new Date(task.dueDate)) : "Chưa đặt hạn"}
                      </p>
                    </div>
                  </div>
                ))}
                {!details.recentTasks.length && (
                  <p className="p-8 text-center text-sm text-slate-500">Chưa có công việc nào trong dự án.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function StatCard({ label, value, accent = "text-slate-900" }: { label: string; value: number; accent?: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <p className={`mt-2 text-2xl font-black ${accent}`}>{value}</p>
    </div>
  );
}
