import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "dc23_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "dev-only-change-me-danielchen23"
  );
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function isValidSession(raw: string | undefined): boolean {
  if (!raw) return false;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  if (!payload.startsWith("ok:")) return false;
  const ts = Number(payload.slice(3));
  if (!Number.isFinite(ts)) return false;
  if (Date.now() - ts > MAX_AGE * 1000) return false;
  return true;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    if (isValidSession(request.cookies.get(COOKIE)?.value)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!isValidSession(request.cookies.get(COOKIE)?.value)) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
