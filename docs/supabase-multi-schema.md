# Supabase Multi-Schema Setup

This project uses one Supabase project with per-app PostgreSQL schemas.

## Current app map

- Shared auth: auth.users
- Trackbit app schema: trackbit

Future apps should use their own schema names and follow the same pattern.

## Files added

- SQL bootstrap: supabase/sql/000_bootstrap_trackbit.sql
- New schema template: supabase/sql/templates/001_new_project_schema_template.sql
- Supabase client factory: lib/supabase/factory.ts
- Trackbit schema client: lib/supabase/projects/trackbit.ts
- Types: lib/supabase/database.types.ts
- Keepalive workflow: .github/workflows/supabase-keepalive.yml

## One-time Supabase setup

1. Open Supabase SQL Editor.
2. Run supabase/sql/000_bootstrap_trackbit.sql.
3. In Supabase Dashboard, go to Project Settings > API.
4. In Exposed schemas, add trackbit and save.
5. In Database > Extensions, confirm pg_cron is enabled.
6. In Storage, confirm bucket trackbit-assets exists.

## Environment variables

Use these in local .env.local and Netlify environment settings:

- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SUPABASE_DEFAULT_SCHEMA=public
- NEXT_PUBLIC_SUPABASE_TRACKBIT_SCHEMA=trackbit
- NEXT_PUBLIC_TRACKBIT_STORAGE_BUCKET=trackbit-assets

## Using the Trackbit client

Client component usage:

```ts
import { createTrackbitBrowserClient } from '@/lib/supabase';

const supabase = createTrackbitBrowserClient();
const { data, error } = await supabase.from('habits').select('*');
```

Server usage:

```ts
import { createTrackbitServerClient } from '@/lib/supabase';

const supabase = createTrackbitServerClient();
const { data, error } = await supabase.from('tasks').select('*');
```

Admin-only usage (never client-side):

```ts
import { createTrackbitServiceClient } from '@/lib/supabase';

const supabase = createTrackbitServiceClient();
```

## Keepalive workflow

Workflow file: .github/workflows/supabase-keepalive.yml

It runs every 4 days and executes a real PostgREST table query:

- GET /rest/v1/keepalive_ping?select=id&limit=1
- Headers include apikey, Authorization bearer token, and Accept-Profile: trackbit

Required GitHub secrets:

- SUPABASE_URL
- SUPABASE_ANON_KEY

## Retention rules implemented

- Focus sessions older than 6 months: deleted by pg_cron
- Completed tasks older than 3 months: deleted by pg_cron
- Finance entries: retained
- Other tables: retained

Cron job name:

- trackbit_retention_cleanup

## Free tier monitoring checklist

Check these in Supabase Dashboard weekly:

1. Database size and table growth
2. Storage usage (trackbit-assets bucket)
3. Egress and bandwidth usage
4. API request volume spikes
5. Active connections and connection saturation
6. Auth MAU trends
7. Cron job status and failures

If close to limits, reduce payload sizes, paginate aggressively, archive old data, and clean storage objects not referenced by app rows.

## Adding a new app schema later

1. Copy supabase/sql/templates/001_new_project_schema_template.sql.
2. Replace {project_name} with the new app schema.
3. Add project client wrapper in lib/supabase/projects.
4. Add schema env key, for example NEXT_PUBLIC_SUPABASE_NEWAPP_SCHEMA.
5. Add new schema to Supabase exposed schemas in Dashboard API settings.
6. Keep RLS strict with auth.uid() ownership policies.
