import { NextRequest, NextResponse } from "next/server";
export async function middleware(req: NextRequest) {
  const token =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token");

  const isDashboardPath = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardPath && !token) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  if (!isDashboardPath && token && req.nextUrl.pathname === "/signin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const perfumeDetailMatch = req.nextUrl.pathname.match(
    /^\/dashboard\/perfumes\/([^\/]+)$/
  );
  if (perfumeDetailMatch) {
    const id = perfumeDetailMatch[1];
    const redirectUrl = new URL(`/collections/${id}`, req.url);
    return NextResponse.redirect(redirectUrl, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin"],
};
