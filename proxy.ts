import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const CLIP_HOST = "clip.kaichen.dev";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // ── Subdomain rewrite ──────────────────────────────────────────────────
  // clip.kaichen.dev → /clip path, so a single Next.js project can serve both
  // kaichen.dev/clip and clip.kaichen.dev seamlessly.
  if (host === CLIP_HOST && !pathname.startsWith("/clip") && !pathname.startsWith("/auth") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/clip" : `/clip${pathname}`;
    url.search = search;
    return NextResponse.rewrite(url);
  }

  // ── Supabase session refresh ──────────────────────────────────────────
  // Required for cookie-based auth across server components / actions.
  // (Next 16 calls this layer "proxy"; the API mirrors the legacy middleware.)
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return response;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    // Skip static + image + favicon assets to keep this layer lean.
    "/((?!_next/static|_next/image|favicon.ico|opengraph-image|apple-icon|icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf)$).*)",
  ],
};
