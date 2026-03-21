import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams } = requestUrl;
  const code = searchParams.get('code');
  const oauthError = searchParams.get('error');
  const oauthErrorDescription = searchParams.get('error_description');

  // Use the current request origin so OAuth stays on the same host.
  // This avoids callback/session issues caused by stale NEXT_PUBLIC_APP_URL values.
  const appOrigin = requestUrl.origin;

  if (oauthError) {
    const loginUrl = new URL(`${appOrigin}/login`);
    loginUrl.searchParams.set('error', 'oauth_provider_error');
    if (oauthErrorDescription) {
      loginUrl.searchParams.set('reason', oauthErrorDescription);
    }
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    return NextResponse.redirect(`${appOrigin}/login?error=missing_auth_code&reason=No+authorization+code+received`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL(`${appOrigin}/login`);
    loginUrl.searchParams.set('error', 'auth_callback_failed');
    loginUrl.searchParams.set('reason', error.message);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(`${appOrigin}/dashboard`);
}