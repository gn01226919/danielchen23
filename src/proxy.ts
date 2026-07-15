import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "dc23_admin_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function secret() {
  return (
    process.env.ADMIN_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    "unsigned-dev-session"
  );
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

function isValidAdminSession(raw: string | undefined): boolean {
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

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Supabase session 刷新（anon key only；secret 不進 proxy 邏輯以外）
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && anon) {
    const supabase = createServerClient(supabaseUrl, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });
    await supabase.auth.getUser();
  }

  if (!pathname.startsWith("/admin")) {
    return response;
  }

  if (pathname === "/admin/login") {
    if (isValidAdminSession(request.cookies.get(COOKIE)?.value)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (!isValidAdminSession(request.cookies.get(COOKIE)?.value)) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
