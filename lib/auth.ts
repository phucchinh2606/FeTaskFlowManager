import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import type { Role } from "./models";

type Claims = { sub?: string; role?: Role; exp?: number; email?: string; "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: Role };

export function currentUser() {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const claims = jwtDecode<Claims>(token);
    if (claims.exp && claims.exp * 1000 < Date.now()) return null;
    return { id: claims.sub ?? "", email: claims.email ?? "", role: claims.role ?? claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? "User" };
  } catch { return null; }
}

/**
 * Reads browser-only authentication state only after hydration. This keeps the
 * first client render identical to the server render.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<ReturnType<typeof currentUser>>(null);
  useEffect(() => { setUser(currentUser()); }, []);
  return user;
}
