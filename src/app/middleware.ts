// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin (side effect import)
import "@/lib/firebaseAdmin";

// Map user roles to their base paths
const rolePaths: Record<string, string> = {
  SuperAdmin: "/superadmin",
  HospitalAdmin: "/hospitals",
  Doctor: "/doctors",
  Receptionist: "/receptionists",
  LabTechnician: "/labtechnicians",
  Patient: "/patient",
};

export async function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("session")?.value;

  // Redirect if no session cookie
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }

  try {
    // Verify the session cookie with Firebase Admin
    const decoded = await getAuth().verifySessionCookie(sessionCookie, true);

    // Extract role from custom claims
    const userRole = (decoded as any).role as string;

    // Get allowed base path for role
    const allowedPath = rolePaths[userRole];

    // Redirect unknown roles to sign-in
    if (!allowedPath) {
      return NextResponse.redirect(new URL("/auth/sign-in", req.url));
    }

    const pathname = req.nextUrl.pathname;

    // Redirect users if they try to access a route outside their role
    if (!pathname.startsWith(allowedPath)) {
      return NextResponse.redirect(new URL(`${allowedPath}/dashboard`, req.url));
    }

    // Allow access
    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth error:", err);
    return NextResponse.redirect(new URL("/auth/sign-in", req.url));
  }
}

// Protect all role-specific routes
export const config = {
  matcher: [
    "/superadmin/:path*",
    "/hospitals/:path*",
    "/doctors/:path*",
    "/receptionists/:path*",
    "/labtechnicians/:path*",
    "/patient/:path*",
  ],
};
