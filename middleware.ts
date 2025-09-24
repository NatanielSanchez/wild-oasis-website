import { MiddlewareConfig } from "next/server";
import { auth } from "@/app/_lib/auth";

export const middleware = auth;

export const config: MiddlewareConfig = {
  matcher: ["/account/:path*"],
};
