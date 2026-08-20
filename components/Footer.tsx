import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-sm font-black text-slate-950">
              TF
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white">TaskFlow</div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Internal Ops
              </div>
            </div>
          </div>

          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Nền tảng quản lý công việc nội bộ dành cho doanh nghiệp, giúp các phòng ban phối hợp hiệu quả và nâng cao năng suất vận hành.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
          <Link href="#features" className="transition hover:text-white">
            Tính năng
          </Link>
          <Link href="#workflow" className="transition hover:text-white">
            Quy trình
          </Link>
          <Link href="#reporting" className="transition hover:text-white">
            Báo cáo
          </Link>
          <Link href="/login" className="transition hover:text-white">
            Đăng nhập
          </Link>
        </div>

        <div className="text-sm text-slate-400">
          © {currentYear} TaskFlow. Bảo mật nội bộ doanh nghiệp.
        </div>
      </div>
    </footer>
  );
}
