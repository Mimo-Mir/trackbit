const readRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
};

export const supabaseEnv = {
  url: readRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
  anonKey: readRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  defaultSchema: process.env.NEXT_PUBLIC_SUPABASE_DEFAULT_SCHEMA ?? 'public',
  trackbitSchema: process.env.NEXT_PUBLIC_SUPABASE_TRACKBIT_SCHEMA ?? 'trackbit',
  trackbitStorageBucket: process.env.NEXT_PUBLIC_TRACKBIT_STORAGE_BUCKET ?? 'trackbit-assets',
} as const;
