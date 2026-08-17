export type Role = "Admin" | "User";

export type Task = {
  id: string; title: string; description?: string; status: string; priority: string;
  dueDate?: string; createdAt: string; projectId: string; projectName?: string;
  assigneeId?: string; assigneeName?: string;
};
export type Project = { id: string; name: string; description?: string; isArchived: boolean; createdById: string; createdAt: string };
export type ProjectMember = { userId: string; fullName: string; email: string; projectRole: string; joinedAt: string; assignedTaskCount: number };
export type ProjectTaskSummary = { totalTasks: number; completedTasks: number; inProgressTasks: number; overdueTasks: number; progressPercentage: number; statusCounts: Record<string, number> };
export type ProjectTaskBrief = { id: string; title: string; status: string; priority: string; dueDate?: string; assigneeName?: string };
export type ProjectDetails = Project & { createdByName?: string; members: ProjectMember[]; taskSummary: ProjectTaskSummary; recentTasks: ProjectTaskBrief[] };
export type User = { id: string; fullName: string; email: string; systemRole: Role; createdAt: string };
export type Comment = { id: string; content: string; createdAt: string; userId: string; authorEmail: string };

export const statuses = ["ToDo", "InProgress", "Review", "Done"];
export const statusLabel: Record<string, string> = { ToDo: "Cần làm", InProgress: "Đang làm", Review: "Chờ duyệt", Done: "Hoàn thành" };
export const priorityLabel: Record<string, string> = { Low: "Thấp", Medium: "Trung bình", High: "Cao" };
export const projectRoleLabel: Record<string, string> = { Manager: "Quản lý dự án", Member: "Thành viên", Contributor: "Tham gia qua công việc" };
