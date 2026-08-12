export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tính năng nổi bật
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
              📋
            </div>
            <h3 className="text-xl font-bold mb-2">Kéo thả Kanban</h3>
            <p className="text-gray-600">
              Trực quan hóa luồng công việc. Cập nhật trạng thái Task chỉ với
              một thao tác kéo thả đơn giản.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
              ⚡
            </div>
            <h3 className="text-xl font-bold mb-2">Real-time SignalR</h3>
            <p className="text-gray-600">
              Nhận thông báo tức thì khi có công việc mới được giao hoặc sắp đến
              hạn mà không cần tải lại trang.
            </p>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 text-2xl">
              🛡️
            </div>
            <h3 className="text-xl font-bold mb-2">Kiến trúc bảo mật</h3>
            <p className="text-gray-600">
              Xây dựng trên nền tảng Clean Architecture & CQRS, đảm bảo hiệu
              suất cao và phân quyền dữ liệu chặt chẽ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
