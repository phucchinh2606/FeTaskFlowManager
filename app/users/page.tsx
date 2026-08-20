"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import AppShell from "@/components/AppShell";
import { useConfirm } from "@/components/ConfirmDialog";
import type { User } from "@/lib/models";

type Performance = {
  userId: string;
  fullName: string;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
};

type UserForm = {
  id?: string;
  fullName: string;
  email: string;
  password: string;
  systemRole: "Admin" | "User";
};

export default function UsersPage() {
  const confirm = useConfirm();
  const [users, setUsers] = useState<User[]>([]);
  const [performance, setPerformance] = useState<Performance[]>([]);
  const [form, setForm] = useState<UserForm | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [usersResponse, performanceResponse] = await Promise.all([
        api.get<User[]>("/users"),
        api.get<Performance[]>("/users/performance"),
      ]);
      setUsers(usersResponse.data);
      setPerformance(performanceResponse.data);
    } catch {
      setError("Không thể tải danh sách thành viên.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form) return;
    try {
      if (form.id) {
        await api.put(`/users/${form.id}`, {
          id: form.id,
          fullName: form.fullName,
          systemRole: form.systemRole,
        });
      } else {
        await api.post("/users", {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
        });
      }
      setForm(null);
      load();
    } catch {
      setError("Không thể lưu thông tin thành viên.");
    }
  };

  const remove = async (id: string) => {
    const confirmed = await confirm({
      title: "Xóa thành viên?",
      message: "Bạn có chắc muốn xóa thành viên này?",
      confirmLabel: "Xóa thành viên",
    });
    if (!confirmed) return;
    try {
      await api.delete(`/users/${id}`);
      load();
    } catch {
      setError("Không thể xóa thành viên đang có dữ liệu liên quan.");
    }
  };

  const perf = (id: string) => performance.find((item) => item.userId === id);

  return (
    <AppShell
      title="Thành viên"
      action={
        <button
          onClick={() =>
            setForm({
              fullName: "",
              email: "",
              password: "",
              systemRole: "User",
            })
          }
          className="rounded-xl bg-sky-500 px-4 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-sky-500/20"
        >
          + Thêm thành viên
        </button>
      }
    >
      {error && (
        <p className="mb-5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
        <table className="w-full text-left text-sm text-slate-200">
          <thead className="bg-slate-800/80 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="p-4">Thành viên</th>
              <th className="p-4">Vai trò</th>
              <th className="p-4">Đang xử lý</th>
              <th className="p-4">Hoàn thành</th>
              <th className="p-4">Quá hạn</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {users.map((member) => {
              const item = perf(member.id);
              return (
                <tr key={member.id}>
                  <td className="p-4">
                    <p className="font-bold text-white">{member.fullName}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {member.email}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-bold text-sky-300">
                      {member.systemRole === "Admin" ? "Manager" : "Member"}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white">
                    {item?.activeTasks ?? 0}
                  </td>
                  <td className="p-4 font-bold text-emerald-300">
                    {item?.completedTasks ?? 0}
                  </td>
                  <td className="p-4 font-bold text-rose-300">
                    {item?.overdueTasks ?? 0}
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <button
                      onClick={() =>
                        setForm({
                          id: member.id,
                          fullName: member.fullName,
                          email: member.email,
                          password: "",
                          systemRole: member.systemRole,
                        })
                      }
                      className="mr-3 text-xs font-bold text-sky-400"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => remove(member.id)}
                      className="text-xs font-bold text-rose-400"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/70 p-4">
          <form
            onSubmit={save}
            className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
          >
            <div className="flex justify-between">
              <h2 className="font-bold text-white">
                {form.id ? "Cập nhật thành viên" : "Thêm thành viên"}
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
              value={form.fullName}
              onChange={(event) =>
                setForm({ ...form, fullName: event.target.value })
              }
              placeholder="Họ và tên"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
            />
            {!form.id && (
              <>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  placeholder="Email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
                />
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm({ ...form, password: event.target.value })
                  }
                  placeholder="Mật khẩu tạm"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder:text-slate-500 outline-none focus:border-sky-400"
                />
              </>
            )}
            <select
              value={form.systemRole}
              onChange={(event) =>
                setForm({
                  ...form,
                  systemRole: event.target.value as "Admin" | "User",
                })
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-sky-400"
            >
              <option value="User">Member</option>
              <option value="Admin">Manager</option>
            </select>
            <button className="w-full rounded-xl bg-sky-500 py-3 font-bold text-slate-950">
              {form.id ? "Lưu thay đổi" : "Tạo tài khoản"}
            </button>
          </form>
        </div>
      )}
    </AppShell>
  );
}
