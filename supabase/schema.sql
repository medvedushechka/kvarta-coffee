-- Execute in Supabase SQL Editor. Never expose the service-role key to the browser.
create table if not exists public.kvarta_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  interest text not null check (interest in ('subscription', 'order', 'question')),
  comment text not null default '',
  attribution jsonb not null default '{}'::jsonb
);
create index if not exists kvarta_leads_phone_time_idx on public.kvarta_leads (phone, created_at desc);
alter table public.kvarta_leads enable row level security;
revoke all on public.kvarta_leads from anon, authenticated;

-- Serialize requests per phone, avoiding a SELECT/INSERT race.
create or replace function public.submit_kvarta_lead(
  p_name text, p_phone text, p_interest text, p_comment text, p_attribution jsonb
) returns text language plpgsql security definer set search_path = '' as $$
begin
  if p_phone !~ '^\+375(25|29|33|44)[0-9]{7}$' then
    raise exception 'Invalid phone';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_phone, 0));
  if exists (
    select 1 from public.kvarta_leads
    where phone = p_phone and created_at > pg_catalog.now() - interval '10 minutes'
  ) then
    return 'duplicate';
  end if;
  insert into public.kvarta_leads(name, phone, interest, comment, attribution)
  values (p_name, p_phone, p_interest, coalesce(p_comment, ''), coalesce(p_attribution, '{}'::jsonb));
  return 'created';
end;
$$;
revoke all on function public.submit_kvarta_lead(text,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.submit_kvarta_lead(text,text,text,text,jsonb) to service_role;
