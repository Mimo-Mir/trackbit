import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
  createServiceRoleSupabaseClient,
} from '@/lib/supabase/factory';
import { supabaseEnv } from '@/lib/supabase/env';

export const TRACKBIT_SCHEMA = supabaseEnv.trackbitSchema as 'trackbit';
export const TRACKBIT_STORAGE_BUCKET = supabaseEnv.trackbitStorageBucket;

export const createTrackbitBrowserClient = () =>
  createBrowserSupabaseClient(TRACKBIT_SCHEMA);

export const createTrackbitServerClient = () =>
  createServerSupabaseClient(TRACKBIT_SCHEMA);

export const createTrackbitServiceClient = () =>
  createServiceRoleSupabaseClient(TRACKBIT_SCHEMA);
