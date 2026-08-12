import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <div className="text-2xl font-extrabold text-blue-600 tracking-tight">
        TaskMaster<span className="text-gray-900">.</span>
      </div>
      <div className="space-x-4">
        <Link
          href="/login"
          className="font-medium text-gray-600 hover:text-blue-600 transition"
        >
          Đăng nhập
        </Link>
        <Link
          href="/login"
          className="px-5 py-2.5 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          Bắt đầu miễn phí
        </Link>
      </div>
    </nav>
  );
}
