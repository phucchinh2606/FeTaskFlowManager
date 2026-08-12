import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 py-10 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-gray-600">
        {/* Logo & Copyright */}
        <div className="mb-6 md:mb-0 text-center md:text-left">
          <div className="text-xl font-extrabold text-blue-600 tracking-tight">
            TaskMaster<span className="text-gray-900">.</span>
          </div>
          <p className="text-sm mt-2">
            © {currentYear} Hệ thống quản lý công việc.{" "}
            <br className="md:hidden" />
            Dự án phát triển cá nhân.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link href="#" className="hover:text-blue-600 transition">
            Giới thiệu
          </Link>
          <Link href="#" className="hover:text-blue-600 transition">
            Chính sách bảo mật
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </footer>
  );
}
