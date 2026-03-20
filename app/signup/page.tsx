'use client';

import Link from 'next/link';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type FieldErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const normalizeAuthError = (message: string) => {
  const lower = message.toLowerCase();

  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'AN ACCOUNT WITH THIS EMAIL ALREADY EXISTS';
  }

  if (lower.includes('password should be at least')) {
    return 'PASSWORD DOES NOT MEET MINIMUM REQUIREMENTS';
  }

  if (lower.includes('too many requests')) {
    return 'TOO MANY ATTEMPTS. TRY AGAIN LATER';
  }

  return 'SIGNUP FAILED. PLEASE TRY AGAIN';
};

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckEmail, setShowCheckEmail] = useState(false);

  const validate = () => {
    const nextErrors: FieldErrors = {};

    if (!name.trim()) {
      nextErrors.name = 'DISPLAY NAME IS REQUIRED';
    }

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

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'CONFIRM YOUR PASSWORD';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'PASSWORDS DO NOT MATCH';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name },
        },
      });

      if (error) {
        setFormError(normalizeAuthError(error.message));
        return;
      }

      setShowCheckEmail(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0f1a] px-4 py-10 text-text-primary uppercase">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(57,255,20,0.09),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(255,68,204,0.08),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:auto,auto,100%_4px]" />

      <section className="relative z-10 w-full max-w-xl border-2 border-surface-500 bg-surface-800/95 p-6 shadow-[0_0_0_2px_rgba(17,20,40,1),8px_8px_0_rgba(0,0,0,0.6)] sm:p-8">
        <div className="mb-8 flex items-center gap-3 border-b-2 border-surface-500 pb-4">
          <div className="grid h-10 w-10 place-items-center border-2 border-brand-500 bg-surface-900 shadow-glow">
            <div className="grid grid-cols-3 gap-[2px]">
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-accent-400" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-accent-400" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-accent-400" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
              <span className="h-1.5 w-1.5 bg-accent-400" />
              <span className="h-1.5 w-1.5 bg-brand-500" />
            </div>
          </div>
          <div>
            <p className="font-display text-base text-brand-400">TRACKBIT</p>
            <p className="mt-1 text-2xs tracking-widest text-text-muted/80">NEW PLAYER REGISTRATION</p>
          </div>
        </div>

        {!showCheckEmail ? (
          <>
            <h1 className="mb-6 font-display text-sm leading-relaxed text-text-primary sm:text-base">CREATE YOUR ACCOUNT</h1>

            {formError ? (
              <div className="mb-5 border-2 border-danger-500 bg-danger-900/60 px-3 py-2 text-2xs text-danger-400">
                {formError}
              </div>
            ) : null}

            <form className="space-y-4" onSubmit={handleSignup}>
              <label className="block text-2xs tracking-wide text-brand-300">
                DISPLAY NAME
                <input
                  className="mt-2 w-full border-2 border-surface-500 bg-surface-900 px-3 py-3 text-2xs text-text-primary outline-none transition focus:border-brand-500 focus:shadow-glow"
                  placeholder="PLAYER ONE"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
                {fieldErrors.name ? (
                  <span className="mt-2 block border-2 border-danger-500 bg-danger-900/40 px-2 py-1 text-2xs text-danger-400">
                    {fieldErrors.name}
                  </span>
                ) : null}
              </label>

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

              <label className="block text-2xs tracking-wide text-brand-300">
                CONFIRM PASSWORD
                <input
                  className="mt-2 w-full border-2 border-surface-500 bg-surface-900 px-3 py-3 text-2xs text-text-primary outline-none transition focus:border-brand-500 focus:shadow-glow"
                  placeholder="RETYPE PASSWORD"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                {fieldErrors.confirmPassword ? (
                  <span className="mt-2 block border-2 border-danger-500 bg-danger-900/40 px-2 py-1 text-2xs text-danger-400">
                    {fieldErrors.confirmPassword}
                  </span>
                ) : null}
              </label>

              <button
                className="mt-1 w-full border-2 border-brand-400 bg-brand-600 px-4 py-3 font-display text-2xs text-surface-900 shadow-glow transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? 'LOADING...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <Link className="mt-6 block text-center text-2xs text-brand-300 hover:text-brand-200" href="/login">
              ALREADY A PLAYER? LOGIN {'->'}
            </Link>
          </>
        ) : (
          <div className="animate-fade-in">
            <h1 className="mb-4 font-display text-sm leading-relaxed text-brand-300 sm:text-base">CHECK YOUR EMAIL</h1>
            <p className="mb-6 border-2 border-brand-500 bg-surface-900 px-4 py-4 text-2xs leading-relaxed text-text-primary">
              WE SENT A CONFIRMATION LINK TO {email.toUpperCase()}. OPEN YOUR INBOX TO ACTIVATE YOUR TRACKBIT ACCOUNT.
            </p>
            <Link
              className="inline-block border-2 border-accent-400 bg-surface-700 px-4 py-3 font-display text-2xs text-accent-300 shadow-glow-accent transition hover:bg-surface-600"
              href="/login"
            >
              RETURN TO LOGIN {'->'}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}