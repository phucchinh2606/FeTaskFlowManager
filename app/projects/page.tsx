"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/apiClient";
import AppShell from "@/components/AppShell";
import { useConfirm } from "@/components/ConfirmDialog";
import { useCurrentUser } from "@/lib/auth";
import type { Project } from "@/lib/models";

type ProjectForm = { id?: string; name: string; description: string };

export default function ProjectsPage() {
  const user = useCurrentUser();
  const confirm = useConfirm();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [form, setForm] = useState<ProjectForm | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get<Project[]>("/projects");
      setProjects(data);
      setSelectedIds(new Set());
    } catch {
      setError("Không thể tải danh sách dự án.");
    }
  };

  useEffect(() => {
    if (user?.id) load();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    try {
      if (form.id) await api.put(`/projects/${form.id}`, form);
      else await api.post("/projects", { ...form, createdById: user?.id });
      setForm(null);
      load();
    } catch {
      setError("Không thể lưu dự án.");
    }
  };

  const remove = async (id: string) => {
    const confirmed = await confirm({
      title: "Xóa dự án?",
      message: "Xóa dự án sẽ xóa cả các công việc thuộc dự án. Tiếp tục?",
      confirmLabel: "Xóa dự án",
    });
    if (!confirmed) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((current) =>
      current.size === projects.length
        ? new Set()
        : new Set(projects.map((project) => project.id)),
    );
  };

  const removeSelected = async () => {
    const selectedCount = selectedIds.size;
    const confirmed = await confirm({
      title: `Xóa ${selectedCount} dự án?`,
      message: "Các công việc thuộc những dự án này cũng sẽ bị xóa. Tiếp tục?",
      confirmLabel: "Xóa các dự án",
    });
    if (!confirmed) return;

    try {
      await api.post("/projects/bulk-delete", { ids: Array.from(selectedIds) });
      await load();
    } catch {
      setError("Không thể xóa các dự án đã chọn.");
    }
  };

  return (
    <AppShell
      title="Dự án"
      action={
        <button
          onClick={() => setForm({ name: "", description: "" })}
          className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20"
        >
          + Tạo dự án
        </button>
      }
    >
      {error && (
        <p className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </p>
      )}

      {projects.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={selectedIds.size === projects.length}
              onChange={toggleAll}
              className="size-4 accent-sky-500"
              aria-label="Chọn tất cả dự án"
            />
            <span>
              {selectedIds.size > 0
                ? `Đã chọn ${selectedIds.size} dự án`
                : "Chọn tất cả dự án"}
            </span>
          </label>
          {selectedIds.size > 0 && (
            <button
              onClick={removeSelected}
              className="rounded-lg bg-rose-500/15 px-3 py-2 text-sm font-bold text-rose-300 hover:bg-rose-500/25"
            >
              Xóa các dự án đã chọn
            </button>
          )}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-slate-400">
                <input
                  type="checkbox"
                  checked={selectedIds.has(project.id)}
                  onChange={() => toggleSelected(project.id)}
                  className="size-4 accent-sky-500"
                  aria-label={`Chọn dự án ${project.name}`}
                />
                Chọn
              </label>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                Đang hoạt động
              </span>
              <div className="flex gap-3 text-xs font-bold">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sky-400 hover:text-sky-300"
                >
                  Chi tiết
                </Link>
                <button
                  onClick={() =>
                    setForm({
                      id: project.id,
                      name: project.name,
                      description: project.description || "",
                    })
                  }
                  className="text-sky-400 hover:text-sky-300"
                >
                  Sửa
                </button>
                <button
                  onClick={() => remove(project.id)}
                  className="text-rose-400 hover:text-rose-300"
                >
                  Xóa
                </button>
              </div>
            </div>

            <h2 className="mt-5 text-lg font-bold text-white">
              {project.name}
            </h2>
            <p className="mt-2 min-h-10 text-sm leading-6 text-slate-400">
              {project.description || "Chưa có mô tả dự án."}
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
              <span>
                Tạo ngày{" "}
                {new Intl.DateTimeFormat("vi-VN").format(
                  new Date(project.createdAt),
                )}
              </span>
            </div>
          </article>
        ))}
      </div>

      {!projects.length && (
        <p className="py-16 text-center text-slate-400">Chưa có dự án nào.</p>
      )}

      {form && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/70 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex justify-between">
              <h2 className="font-bold text-white">
                {form.id ? "Cập nhật dự án" : "Dự án mới"}
              </h2>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              placeholder="Tên dự án"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
            />
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Mô tả"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
            />
            <button className="w-full rounded-xl bg-sky-500 py-3 font-bold text-slate-950">
              {form.id ? "Lưu thay đổi" : "Tạo dự án"}
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
