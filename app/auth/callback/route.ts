import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/** OAuth may pass `next=` empty; `?? "/admin"` does not catch "", which redirects to site root. */
function safeNextPath(raw: string | null): string {
  if (raw == null || raw === "") return "/admin";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/admin";
  return raw;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));

  // On Vercel, request.url uses localhost internally — use x-forwarded-host for the real domain
  const forwardedHost = request.headers.get("x-forwarded-host");
  let baseUrl =
    process.env.NODE_ENV === "development" || !forwardedHost
      ? origin
      : `https://${forwardedHost}`;

  // Supabase may redirect to https://localhost which has no TLS server locally
  if (/https:\/\/(localhost|127\.0\.0\.1)/.test(baseUrl)) {
    baseUrl = baseUrl.replace("https://", "http://");
  }

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${baseUrl}${next}`);
    }
  }

  return NextResponse.redirect(`${baseUrl}/admin?error=auth_failed`);
}
