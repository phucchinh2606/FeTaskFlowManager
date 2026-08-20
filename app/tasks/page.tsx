"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
  type HubConnection,
} from "@microsoft/signalr";
import api from "@/lib/apiClient";
import AppShell from "@/components/AppShell";
import { useConfirm } from "@/components/ConfirmDialog";
import { useCurrentUser } from "@/lib/auth";
import {
  priorityLabel,
  statusLabel,
  statuses,
  type Comment,
  type Project,
  type Task,
  type User,
} from "@/lib/models";

const chip = (value: string) =>
  value === "High"
    ? "bg-rose-500/15 text-rose-300"
    : value === "Done"
      ? "bg-emerald-500/15 text-emerald-300"
      : value === "InProgress"
        ? "bg-amber-500/15 text-amber-300"
        : "bg-slate-700 text-slate-200";

const date = (v?: string) =>
  v
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      }).format(new Date(v))
    : "Chưa đặt";

export default function TasksPage() {
  const confirm = useConfirm();
  const user = useCurrentUser();
  const manager = user?.role === "Admin";
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assigneeId: "",
    priority: "Medium",
    dueDate: "",
  });

  const connectionRef = useRef<HubConnection | null>(null);
  const selectedTaskIdRef = useRef<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const endpoint =
        manager && query.trim()
          ? "/tasks/search"
          : manager &&
              (statusFilter !== "All" ||
                priority !== "All" ||
                assigneeFilter !== "All")
            ? "/tasks/filter"
            : manager
              ? "/tasks"
              : "/tasks/my-tasks";

      const params =
        endpoint === "/tasks/search"
          ? { title: query }
          : endpoint === "/tasks/filter"
            ? {
                status: statusFilter === "All" ? undefined : statusFilter,
                priority: priority === "All" ? undefined : priority,
                assigneeId:
                  assigneeFilter === "All" ? undefined : assigneeFilter,
              }
            : undefined;

      const taskResponse = await api.get<Task[]>(endpoint, { params });
      setTasks(taskResponse.data);

      if (manager) {
        const [projectResponse, userResponse] = await Promise.all([
          api.get<Project[]>("/projects"),
          api.get<User[]>("/users"),
        ]);
        setProjects(projectResponse.data.filter((p) => !p.isArchived));
        setUsers(userResponse.data);
      }
    } catch {
      setError(
        "Không thể tải công việc. Vui lòng đăng nhập lại hoặc kiểm tra kết nối API.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    const loadTaskList = setTimeout(() => void load(), 0);
    return () => clearTimeout(loadTaskList);
  }, [user?.id, manager, priority, statusFilter, assigneeFilter, query]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.id) return;
    const hubUrl =
      (api.defaults.baseURL || "https://localhost:7096/api").replace(
        /\/api\/?$/,
        "",
      ) + "/hubs/notifications";
    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem("token") || "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on(
      "ReceiveComment",
      (incoming: Comment & { taskId: string }) => {
        if (selectedTaskIdRef.current !== incoming.taskId) return;
        setComments((previous) =>
          previous.some((comment) => comment.id === incoming.id)
            ? previous
            : [...previous, incoming],
        );
      },
    );

    connectionRef.current = connection;
    connection
      .start()
      .then(() => {
        if (selectedTaskIdRef.current)
          return connection.invoke("JoinTask", selectedTaskIdRef.current);
      })
      .catch(() =>
        setError("Không thể kết nối cập nhật bình luận thời gian thực."),
      );

    return () => {
      connectionRef.current = null;
      connection.stop();
    };
  }, [user?.id]);

  useEffect(() => {
    const taskId = selected?.id ?? null;
    selectedTaskIdRef.current = taskId;
    const connection = connectionRef.current;
    if (
      !connection ||
      connection.state !== HubConnectionState.Connected ||
      !taskId
    )
      return;

    connection.invoke("JoinTask", taskId);
    return () => {
      connection.invoke("LeaveTask", taskId).catch(() => undefined);
    };
  }, [selected?.id]);

  const filtered = useMemo(
    () =>
      tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) &&
          (priority === "All" || t.priority === priority),
      ),
    [tasks, query, priority],
  );

  const changeStatus = async (task: Task, status: string) => {
    try {
      setError("");
      await api.patch(`/tasks/${task.id}/status`, { status });
      setTasks((old) =>
        old.map((t) => (t.id === task.id ? { ...t, status } : t)),
      );
      setSelected((old) => (old?.id === task.id ? { ...old, status } : old));
    } catch {
      setError("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  const openTask = async (task: Task) => {
    setSelected(task);
    const { data } = await api.get<Comment[]>(`/tasks/${task.id}/comments`);
    setComments(data);
  };

  const addComment = async () => {
    if (!selected || !comment.trim()) return;
    await api.post(`/tasks/${selected.id}/comments`, { content: comment });
    setComment("");
    openTask(selected);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      assigneeId: form.assigneeId || null,
      dueDate: form.dueDate || null,
    };
    try {
      if (editing)
        await api.put(`/tasks/${editing.id}`, { ...payload, id: editing.id });
      else await api.post("/tasks", payload);
      setCreating(false);
      setEditing(null);
      setForm({
        title: "",
        description: "",
        projectId: "",
        assigneeId: "",
        priority: "Medium",
        dueDate: "",
      });
      await load();
    } catch {
      setError("Không thể lưu công việc.");
    }
  };

  const editTask = (task: Task) => {
    setEditing(task);
    setForm({
      title: task.title,
      description: task.description || "",
      projectId: task.projectId,
      assigneeId: task.assigneeId || "",
      priority: task.priority,
      dueDate: task.dueDate?.slice(0, 10) || "",
    });
    setCreating(true);
  };

  const deleteTask = async (task: Task) => {
    const confirmed = await confirm({
      title: "Xóa công việc?",
      message: "Công việc này sẽ bị xóa khỏi bảng công việc.",
      confirmLabel: "Xóa công việc",
    });
    if (!confirmed) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      setSelected(null);
      load();
    } catch {
      setError("Không thể xóa công việc.");
    }
  };

  return (
    <AppShell
      title={manager ? "Bảng công việc" : "Không gian làm việc"}
      action={
        manager ? (
          <button
            onClick={() => setCreating(true)}
            className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20"
          >
            + Tạo công việc
          </button>
        ) : null
      }
    >
      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên công việc…"
          className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
        />
        {manager && (
          <>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            >
              <option value="All">Mọi trạng thái</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
            >
              <option value="All">Mọi người phụ trách</option>
              {users.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.fullName}
                </option>
              ))}
            </select>
          </>
        )}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
        >
          <option value="All">Mọi ưu tiên</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
      </div>

      {!manager && <Urgent tasks={tasks} />}

      {error && (
        <div className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {selected && manager && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/80 p-3 text-sm text-slate-200">
          <span>
            Đang chọn: <b className="text-white">{selected.title}</b>
          </span>
          <span className="flex gap-3">
            <button
              onClick={() => editTask(selected)}
              className="font-bold text-sky-400"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={() => deleteTask(selected)}
              className="font-bold text-rose-400"
            >
              Xóa
            </button>
          </span>
        </div>
      )}

      {loading ? (
        <p className="py-16 text-center text-slate-400">Đang tải công việc…</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-4">
          {statuses.map((status) => (
            <section
              key={status}
              className="min-h-80 rounded-2xl border border-slate-800 bg-slate-900/70 p-3"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-200">
                  {statusLabel[status]}
                </h2>
                <span className="rounded-lg bg-slate-800 px-2 py-1 text-xs font-bold text-slate-300">
                  {filtered.filter((t) => t.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {filtered
                  .filter((t) => t.status === status)
                  .map((task) => (
                    <article
                      key={task.id}
                      onClick={() => openTask(task)}
                      className="cursor-pointer rounded-xl border border-slate-700 bg-slate-950/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-500/40 hover:shadow-lg"
                    >
                      <div className="mb-3 flex justify-between gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-bold ${chip(task.priority)}`}
                        >
                          {priorityLabel[task.priority]}
                        </span>
                        <span className="text-xs text-slate-400">
                          {date(task.dueDate)}
                        </span>
                      </div>
                      <h3 className="font-bold leading-snug text-white">
                        {task.title}
                      </h3>
                      <p className="mt-2 truncate text-xs text-slate-400">
                        {task.projectName || "Dự án"}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="max-w-32 truncate text-xs font-medium text-slate-300">
                          {task.assigneeName || "Chưa giao"}
                        </span>
                        <div className="flex items-center gap-2">
                          <select
                            aria-label="Cập nhật trạng thái"
                            onClick={(e) => e.stopPropagation()}
                            value={task.status}
                            onChange={(e) => changeStatus(task, e.target.value)}
                            className="max-w-24 rounded border border-slate-700 bg-slate-800 p-1 text-[10px] font-bold text-slate-200 outline-none"
                          >
                            {statuses.map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          {manager && (
                            <>
                              <button
                                type="button"
                                aria-label={`Chỉnh sửa ${task.title}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editTask(task);
                                }}
                                className="text-xs font-bold text-sky-400 hover:text-sky-300"
                              >
                                Sửa
                              </button>
                              <button
                                type="button"
                                aria-label={`Xóa ${task.title}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteTask(task);
                                }}
                                className="text-xs font-bold text-rose-400 hover:text-rose-300"
                              >
                                Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {creating && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/70 p-4">
          <form
            onSubmit={create}
            className="w-full max-w-lg space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-bold text-white">
                {editing ? "Cập nhật công việc" : "Tạo công việc"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Tên công việc"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
            />
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Mô tả"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                required
                disabled={!!editing}
                value={form.projectId}
                onChange={(e) =>
                  setForm({ ...form, projectId: e.target.value })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-sky-400 disabled:bg-slate-800"
              >
                <option value="">Chọn dự án</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <select
                value={form.assigneeId}
                onChange={(e) =>
                  setForm({ ...form, assigneeId: e.target.value })
                }
                className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-sky-400"
              >
                <option value="">Chưa giao</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName}
                  </option>
                ))}
              </select>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-sky-400"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-sky-400"
              />
            </div>
            <button className="w-full rounded-xl bg-sky-500 py-3 font-bold text-slate-950">
              {editing ? "Lưu thay đổi" : "Tạo công việc"}
            </button>
          </form>
        </div>
      )}

      {selected && (
        <aside className="fixed inset-y-0 right-0 z-30 w-full max-w-md overflow-y-auto border-l border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="flex justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                {selected.projectName}
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                {selected.title}
              </h2>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-xl text-slate-400 hover:text-white"
            >
              ×
            </button>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            {selected.description || "Chưa có mô tả."}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <p className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200">
              <b className="text-white">Trạng thái</b>
              <br />
              {statusLabel[selected.status]}
            </p>
            <p className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-slate-200">
              <b className="text-white">Hạn hoàn thành</b>
              <br />
              {date(selected.dueDate)}
            </p>
          </div>
          <h3 className="mt-7 font-bold text-white">Trao đổi</h3>
          <div className="mt-3 space-y-3">
            {comments.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm"
              >
                <p className="font-bold text-slate-200">{c.authorEmail}</p>
                <p className="mt-1 text-slate-300">{c.content}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addComment()}
              placeholder="Viết bình luận…"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
            />
            <button
              onClick={addComment}
              className="rounded-xl bg-sky-500 px-4 text-sm font-bold text-slate-950"
            >
              Gửi
            </button>
          </div>
        </aside>
      )}
    </AppShell>
  );
}

function Urgent({ tasks }: { tasks: Task[] }) {
  const [now] = useState(() => Date.now());
  const urgent = tasks.filter(
    (t) =>
      t.dueDate &&
      t.status !== "Done" &&
      new Date(t.dueDate) < new Date(now + 3 * 86400000),
  );

  return urgent.length ? (
    <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
      <b className="text-amber-100">Cần chú ý:</b> Bạn có {urgent.length} công
      việc đến hạn trong 3 ngày tới hoặc đã quá hạn.
    </div>
  ) : null;
}
