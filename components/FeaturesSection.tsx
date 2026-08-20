const features = [
  {
    icon: "📋",
    title: "Quản lý tác vụ theo vòng đời",
    description:
      "Tạo, giao, ưu tiên và theo dõi các task theo trạng thái rõ ràng để không bỏ sót công việc quan trọng.",
    accent: "from-sky-500/20 to-cyan-500/10 text-sky-300 bg-sky-500/10",
  },
  {
    icon: "⏱️",
    title: "Theo dõi tiến độ theo thời gian",
    description:
      "Giám sát mức độ hoàn thành, nhắc việc sắp đến hạn và dự báo rủi ro dự án trước khi ảnh hưởng đến kế hoạch.",
    accent:
      "from-emerald-500/20 to-teal-500/10 text-emerald-300 bg-emerald-500/10",
  },
  {
    icon: "✅",
    title: "Phê duyệt & kiểm soát quyền truy cập",
    description:
      "Phân quyền theo vai trò, yêu cầu phê duyệt rõ ràng và kiểm soát truy cập dữ liệu hợp lý cho từng phòng ban.",
    accent:
      "from-violet-500/20 to-fuchsia-500/10 text-violet-300 bg-violet-500/10",
  },
  {
    icon: "📊",
    title: "Báo cáo vận hành cấp quản lý",
    description:
      "Hiển thị KPI, thống kê hiệu suất theo phòng ban và báo cáo tổng quan phục vụ ra quyết định nhanh hơn.",
    accent: "from-amber-500/20 to-orange-500/10 text-amber-300 bg-amber-500/10",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-slate-950 px-4 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
            Tính năng nổi bật
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Một hệ thống giúp doanh nghiệp vận hành trơn tru hơn
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/10"
            >
              <div
                className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.accent} text-2xl`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div
          id="workflow"
          className="mt-16 rounded-[28px] border border-slate-800 bg-slate-900/80 p-6 shadow-sm sm:p-8"
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
                Quy trình nội bộ
              </div>
              <h3 className="text-3xl font-black text-white">
                Từ ý tưởng đến hoàn thành, mọi thứ đều được kiểm soát.
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Hệ thống được thiết kế cho các tổ chức cần đồng bộ giữa kế
                hoạch, thực thi, báo cáo và kiểm tra chất lượng trong một môi
                trường do doanh nghiệp quản lý.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Lập kế hoạch",
                  text: "Khởi tạo dự án, gán owner, xác định mốc thời gian.",
                },
                {
                  step: "02",
                  title: "Phân công",
                  text: "Giao nhiệm vụ theo phòng ban và mức độ ưu tiên rõ ràng.",
                },
                {
                  step: "03",
                  title: "Theo dõi",
                  text: "Theo dõi tiến độ, báo cáo và điều chỉnh nhanh khi cần.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
                    {item.step}
                  </div>
                  <div className="mt-3 text-lg font-bold text-white">
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          id="reporting"
          className="mt-16 rounded-[28px] border border-slate-800 bg-slate-900 p-8 text-white shadow-sm"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-sky-300">
                Báo cáo quản lý
              </div>
              <h3 className="text-3xl font-black">
                Cập nhật KPI và tình hình hoạt động theo thời gian thực.
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { value: "24h", label: "Cập nhật dữ liệu" },
                { value: "8.4%", label: "Tăng năng suất" },
                { value: "92%", label: "Độ hài lòng" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-700 bg-white/5 p-4 text-center"
                >
                  <div className="text-2xl font-black text-white">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
