'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type FieldErrors = {
  email?: string;
  password?: string;
};

const normalizeAuthError = (message: string) => {
  const lower = message.toLowerCase();

  if (lower.includes('invalid login credentials')) {
    return 'INVALID EMAIL OR PASSWORD';
  }

  if (lower.includes('email not confirmed')) {
    return 'PLEASE CONFIRM YOUR EMAIL BEFORE LOGGING IN';
  }

  if (lower.includes('too many requests')) {
    return 'TOO MANY ATTEMPTS. TRY AGAIN LATER';
  }

  return 'LOGIN FAILED. PLEASE TRY AGAIN';
};

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const callbackError = (() => {
    const error = searchParams.get('error');
    const reason = searchParams.get('reason');

    const suffix = reason ? `: ${reason}` : '';

    if (error === 'missing_auth_code') {
      return `GOOGLE LOGIN FAILED: MISSING AUTH CODE${suffix}`;
    }

    if (error === 'auth_callback_failed') {
      return `GOOGLE LOGIN FAILED: AUTH CALLBACK ERROR${suffix}`;
    }

    if (error === 'oauth_provider_error') {
      return `GOOGLE LOGIN FAILED: PROVIDER ERROR${suffix}`;
    }

    return null;
  })();

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'EMAIL IS REQUIRED';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'ENTER A VALID EMAIL';
    }

    if (!password) {
      nextErrors.password = 'PASSWORD IS REQUIRED';
    } else if (password.length < 8) {
      nextErrors.password = 'PASSWORD MUST BE AT LEAST 8 CHARACTERS';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    setIsLoginLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setFormError(normalizeAuthError(error.message));
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected login error';
      setFormError(`LOGIN FAILED: ${message.toUpperCase()}`);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handleGoogleOAuth = async () => {
    setFormError(null);
    setIsGoogleLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setFormError(normalizeAuthError(error.message));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected Google OAuth error';
      setFormError(`GOOGLE LOGIN FAILED: ${message.toUpperCase()}`);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0f1a] px-4 py-10 text-text-primary uppercase">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(57,255,20,0.09),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,68,204,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:auto,auto,100%_4px]" />

      <section className="relative z-10 w-full max-w-xl border-2 border-surface-500 bg-surface-800/95 p-6 shadow-[0_0_0_2px_rgba(17,20,40,1),8px_8px_0_rgba(0,0,0,0.6)] sm:p-8">
        <div className="mb-8 flex items-center gap-3 border-b-2 border-surface-500 pb-4">
          <div className="grid h-10 w-10 place-items-center border-2 border-brand-500 bg-surface-900 shadow-glow">
            <div className="grid grid-cols-3 gap-[2px]">
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-text-primary" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-text-primary" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-text-primary" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-text-primary" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
            </div>
          </div>
          <div>
            <p className="font-display text-base text-brand-400">TRACKBIT</p>
            <p className="mt-1 text-2xs tracking-widest text-text-muted/80">SYSTEM ACCESS TERMINAL</p>
          </div>
        </div>

        <h1 className="mb-6 font-display text-sm leading-relaxed text-text-primary sm:text-base">WELCOME BACK, PLAYER</h1>

        {formError || callbackError ? (
          <div className="mb-5 border-2 border-danger-500 bg-danger-900/60 px-3 py-2 text-2xs text-danger-400">
            {formError ?? callbackError}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleLogin}>
          <label className="block text-2xs tracking-wide text-brand-300">
            EMAIL
            <input
              className="mt-2 w-full border-2 border-surface-500 bg-surface-900 px-3 py-3 text-2xs text-text-primary outline-none transition focus:border-brand-500 focus:shadow-glow"
              placeholder="PLAYER@TRACKBIT.GAME"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {fieldErrors.email ? (
              <span className="mt-2 block border-2 border-danger-500 bg-danger-900/40 px-2 py-1 text-2xs text-danger-400">
                {fieldErrors.email}
              </span>
            ) : null}
          </label>

          <label className="block text-2xs tracking-wide text-brand-300">
            PASSWORD
            <input
              className="mt-2 w-full border-2 border-surface-500 bg-surface-900 px-3 py-3 text-2xs text-text-primary outline-none transition focus:border-brand-500 focus:shadow-glow"
              placeholder="MIN 8 CHARACTERS"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {fieldErrors.password ? (
              <span className="mt-2 block border-2 border-danger-500 bg-danger-900/40 px-2 py-1 text-2xs text-danger-400">
                {fieldErrors.password}
              </span>
            ) : null}
          </label>

          <button
            className="mt-1 w-full border-2 border-brand-400 bg-brand-600 px-4 py-3 font-display text-2xs text-surface-900 shadow-glow transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoginLoading || isGoogleLoading}
            type="submit"
          >
            {isLoginLoading ? 'LOADING...' : 'LOGIN'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between gap-3 text-2xs">
          <a className="text-accent-400 hover:text-accent-300" href="#">
            FORGOT PASSWORD?
          </a>
          <span className="text-text-muted/70">-- OR --</span>
        </div>

        <button
          className="mt-4 w-full border-2 border-accent-400 bg-surface-700 px-4 py-3 font-display text-2xs text-accent-300 shadow-glow-accent transition hover:bg-surface-600 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isLoginLoading || isGoogleLoading}
          onClick={handleGoogleOAuth}
          type="button"
        >
          {isGoogleLoading ? 'LOADING...' : 'LOGIN WITH GOOGLE'}
        </button>

        <Link className="mt-6 block text-center text-2xs text-brand-300 hover:text-brand-200" href="/signup">
          NEW PLAYER? CREATE ACCOUNT {'->'}
        </Link>

        <div className="mt-8 flex items-end justify-between border-t-2 border-surface-500 pt-4 text-2xs text-text-muted/70">
          <span className="font-mono">HP: 100</span>
          <span className="font-mono text-accent-400">LEVEL 01</span>
        </div>
      </section>
    </main>
  );
}