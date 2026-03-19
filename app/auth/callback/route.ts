import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get('code');

  let appOrigin = requestUrl.origin;
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      appOrigin = new URL(process.env.NEXT_PUBLIC_APP_URL).origin;
    } catch {
      appOrigin = requestUrl.origin;
    }
  }

  if (!code) {
    return NextResponse.redirect(`${appOrigin}/login?error=missing_auth_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${appOrigin}/login?error=auth_callback_failed`);
  }

  return NextResponse.redirect(`${appOrigin}/dashboard`);
}