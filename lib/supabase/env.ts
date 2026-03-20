const requireEnv = (value: string | undefined, name: string): string => {
  if (!value) {
    if (typeof window !== 'undefined') {
      throw new Error('Missing required public configuration.');
    }

    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

export const supabaseEnv = {
  // Use static NEXT_PUBLIC references so values are inlined in client bundles.
  url: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: requireEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  defaultSchema: process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_SCHEMA ?? 'public',
  trackbitSchema: process.env.NEXT_PUBLIC_SUPABASE_TRACKBIT_SCHEMA ?? 'trackbit',
  trackbitStorageBucket: process.env.NEXT_PUBLIC_TRACKBIT_STORAGE_BUCKET ?? 'trackbit-assets',
} as const;
