import Link from "next/link";

const stats = [
  { label: "Dự án đang chạy", value: "128" },
  { label: "Tasks hoàn thành", value: "94.6%" },
  { label: "Đội ngũ tham gia", value: "24" },
];

export default function HeroSection() {
  return (
    <main className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.2),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">
              Nền tảng nội bộ doanh nghiệp
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Quản lý công việc nội bộ
              <span className="mt-3 block bg-gradient-to-r from-sky-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
                nhanh, minh bạch, hiệu quả.
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-300">
              TaskFlow giúp các phòng ban theo dõi tiến độ, phân công trách nhiệm,
              phê duyệt công việc và báo cáo vận hành trong một hệ thống tập trung,
              dễ sử dụng cho toàn công ty.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-sky-500 px-7 py-3.5 text-base font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
              >
                Vào hệ thống
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition hover:border-sky-400 hover:bg-sky-500/10"
              >
                Tìm hiểu thêm
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-white/5 p-4 backdrop-blur-sm">
                  <div className="text-2xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-sm text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-sky-500/20 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[28px] border border-slate-700 bg-slate-900/80 p-4 shadow-2xl shadow-sky-500/10 backdrop-blur-xl">
              <div className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Operations Center</div>
                  <div className="mt-1 text-lg font-semibold text-white">Dashboard tổng quan</div>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  Online
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-sky-200">Tổng tiến độ</div>
                  <div className="mt-3 text-3xl font-black text-white">86%</div>
                  <div className="mt-2 h-2 rounded-full bg-slate-800">
                    <div className="h-2 w-[86%] rounded-full bg-gradient-to-r from-sky-400 to-cyan-300" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Phê duyệt</div>
                  <div className="mt-3 text-3xl font-black text-white">17</div>
                  <div className="mt-2 text-sm text-emerald-300">+5 so với tuần trước</div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-200">Tasks theo phòng ban</div>
                  <div className="text-xs text-slate-400">Hôm nay</div>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Engineering", width: "82%", color: "bg-sky-400" },
                    { name: "Finance", width: "68%", color: "bg-emerald-400" },
                    { name: "HR", width: "54%", color: "bg-violet-400" },
                  ].map((item) => (
                    <div key={item.name}>
                      <div className="mb-1 flex justify-between text-xs text-slate-300">
                        <span>{item.name}</span>
                        <span>{item.width}</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className={`h-2 rounded-full ${item.color}`} style={{ width: item.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
