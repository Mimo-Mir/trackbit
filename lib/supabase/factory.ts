import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';
import { supabaseEnv } from '@/lib/supabase/env';

export type SchemaName = keyof Database;

const buildClient = (key: string, schema: SchemaName): SupabaseClient<Database> =>
  createClient<Database>(supabaseEnv.url, key, {
    db: { schema },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

export const createBrowserSupabaseClient = (schema: SchemaName = 'public') =>
  buildClient(supabaseEnv.anonKey, schema);

export const createServerSupabaseClient = (schema: SchemaName = 'public') =>
  buildClient(supabaseEnv.anonKey, schema);

export const createServiceRoleSupabaseClient = (schema: SchemaName = 'public') => {
  if (!supabaseEnv.serviceRoleKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
  }

  return buildClient(supabaseEnv.serviceRoleKey, schema);
};
