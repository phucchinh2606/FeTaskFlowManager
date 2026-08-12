import Link from "next/link";

export default function HeroSection() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4 pt-32 pb-20">
      <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-4xl">
        Quản lý công việc hiệu quả với <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
          Kanban Board Thông Minh
        </span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl">
        Hệ thống quản lý dự án mạnh mẽ, tích hợp thông báo thời gian thực và
        kiến trúc hướng sự kiện. Giúp đội nhóm của bạn luôn đồng bộ và hoàn
        thành đúng hạn.
      </p>

      <div className="flex space-x-4">
        <Link
          href="/login"
          className="px-8 py-3.5 text-lg font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Trải nghiệm ngay
        </Link>
        <a
          href="#features"
          className="px-8 py-3.5 text-lg font-semibold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition"
        >
          Tìm hiểu thêm
        </a>
      </div>

      {/* Mockup Placeholder */}
      <div className="mt-16 w-full max-w-5xl p-4 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
          [ Hình ảnh Demo Giao diện Kanban Board sẽ hiển thị tại đây ]
        </div>
      </div>
    </main>
  );
}
