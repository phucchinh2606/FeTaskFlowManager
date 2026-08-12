"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import apiClient from "@/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();

  // State quản lý form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State quản lý trạng thái UI
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn form tự động reload trang
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Gọi API đến Backend .NET của bạn
      // Đảm bảo URL port 7123 khớp với port Backend thực tế của bạn
      const response = await apiClient.post(
        "/auth/login",
        {
          email,
          password,
        },
      );

      // Giả sử API Backend trả về { token: "eyJhbGci..." }
      const token = response.data.token;

      if (token) {
        // 1. Lưu JWT Token vào localStorage
        localStorage.setItem("token", token);

        // 2. Chuyển hướng người dùng vào trang Dashboard / Quản lý Task
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      // Xử lý lỗi (Sai mật khẩu, tài khoản không tồn tại...)
      if (
        typeof error === "object" && error !== null && "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response?.data?.message === "string"
      ) {
        setErrorMessage((error as { response: { data: { message: string } } }).response.data.message);
      } else {
        setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        {/* Header Form */}
        <div className="text-center mb-8">
          <Link
            href="/"
            className="text-2xl font-extrabold text-blue-600 tracking-tight cursor-pointer inline-block mb-2"
          >
            TaskMaster<span className="text-gray-900">.</span>
          </Link>
          <h2 className="text-xl font-bold text-gray-800">
            Chào mừng trở lại!
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Vui lòng đăng nhập để tiếp tục
          </p>
        </div>

        {/* Thông báo lỗi */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
            {errorMessage}
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="nhanvien@congty.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <Link href="#" className="text-sm text-blue-600 hover:underline">
                Quên mật khẩu?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 flex justify-center text-sm font-semibold text-white rounded-lg shadow-md transition ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {/* Footer Form */}
        <div className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            href="#"
            className="text-blue-600 font-semibold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
