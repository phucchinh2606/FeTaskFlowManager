"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/apiClient";
import AppShell from "@/components/AppShell";
import { useCurrentUser } from "@/lib/auth";
import type { Project } from "@/lib/models";

type ProjectForm = { id?: string; name: string; description: string };

export default function ProjectsPage() {
  const user = useCurrentUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<ProjectForm | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get<Project[]>("/projects");
      setProjects(data);
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
    if (
      !window.confirm(
        "Xóa dự án sẽ xóa cả các công việc thuộc dự án. Tiếp tục?",
      )
    )
      return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <AppShell
      title="Dự án"
      action={
        <button
          onClick={() => setForm({ name: "", description: "" })}
          className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
        >
          + Tạo dự án
        </button>
      }
    >
      {error && (
        <p className="mb-5 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                Đang hoạt động
              </span>
              <div className="flex gap-3 text-xs font-bold">
                <Link
                  href={`/projects/${project.id}`}
                  className="text-indigo-600"
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
                  className="text-indigo-600"
                >
                  Sửa
                </button>
                <button
                  onClick={() => remove(project.id)}
                  className="text-rose-600"
                >
                  Xóa
                </button>
              </div>
            </div>
            <h2 className="mt-5 text-lg font-bold">{project.name}</h2>
            <p className="mt-2 min-h-10 text-sm leading-6 text-slate-500">
              {project.description || "Chưa có mô tả dự án."}
            </p>
            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
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
        <p className="py-16 text-center text-slate-500">Chưa có dự án nào.</p>
      )}
      {form && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-900/30 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex justify-between">
              <h2 className="font-bold">
                {form.id ? "Cập nhật dự án" : "Dự án mới"}
              </h2>
              <button type="button" onClick={() => setForm(null)}>
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
              className="w-full rounded-xl border p-3"
            />
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              placeholder="Mô tả"
              className="w-full rounded-xl border p-3"
            />
            <button className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white">
              {form.id ? "Lưu thay đổi" : "Tạo dự án"}
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
