import {NextRequest, NextResponse} from "next/server";
export async function middleware(req: NextRequest) {

    const token = req.cookies.get("authjs.session-token");
    const isDashboardPath = req.nextUrl.pathname.startsWith("/dashboard");

    if (isDashboardPath && !token) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (!isDashboardPath && token && req.nextUrl.pathname === "/signin" ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*","/signin"],
};