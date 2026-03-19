import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';
import { supabaseEnv } from '@/lib/supabase/env';

export function createClient() {
  return createBrowserClient<Database>(
    supabaseEnv.url,
    supabaseEnv.anonKey,
    {
      db: {
        schema: supabaseEnv.trackbitSchema as 'trackbit',
      },
    }
  );
}