import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-600 to-cyan-500 text-sm font-black text-white shadow-lg shadow-sky-500/25">
            TF
          </div>
          <div>
            <div className="text-lg font-black tracking-tight text-slate-900">
              TaskFlow
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Internal Ops
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="#features" className="text-sm font-medium text-slate-600 transition hover:text-sky-600">
            Tính năng
          </Link>
          <Link href="#workflow" className="text-sm font-medium text-slate-600 transition hover:text-sky-600">
            Quy trình
          </Link>
          <Link href="#reporting" className="text-sm font-medium text-slate-600 transition hover:text-sky-600">
            Báo cáo
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-200 hover:text-sky-700 sm:inline-flex"
          >
            Đăng nhập
          </Link>
          <Link
            href="/login"
            className="inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-sky-600"
          >
            Yêu cầu truy cập
          </Link>
        </div>
      </div>
    </nav>
  );
}
