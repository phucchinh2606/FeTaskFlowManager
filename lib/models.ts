export type Role = "Admin" | "User";

export type Task = {
  id: string; title: string; description?: string; status: string; priority: string;
  dueDate?: string; createdAt: string; projectId: string; projectName?: string;
  assigneeId?: string; assigneeName?: string;
};
export type Project = { id: string; name: string; description?: string; isArchived: boolean; createdById: string; createdAt: string };
export type User = { id: string; fullName: string; email: string; systemRole: Role; createdAt: string };
export type Comment = { id: string; content: string; createdAt: string; userId: string; authorEmail: string };

export const statuses = ["ToDo", "InProgress", "Review", "Done"];
export const statusLabel: Record<string, string> = { ToDo: "Cần làm", InProgress: "Đang làm", Review: "Chờ duyệt", Done: "Hoàn thành" };
export const priorityLabel: Record<string, string> = { Low: "Thấp", Medium: "Trung bình", High: "Cao" };
