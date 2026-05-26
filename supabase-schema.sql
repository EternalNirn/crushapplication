-- Run this in your Supabase SQL Editor to create the table

create table crush_applications (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc', now()),
  full_name text not null,
  age integer not null,
  vibe text not null,
  best_quality text not null,
  red_flags text,
  rizz_sample text not null,
  love_language text not null,
  dealbreakers text,
  why_you text not null,
  rating_yourself integer not null check (rating_yourself between 1 and 10),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected'))
);

-- Optional: disable RLS for easy inserts (fine for a joke app)
alter table crush_applications enable row level security;

create policy "Anyone can submit an application"
  on crush_applications for insert
  with check (true);

-- If you want to view submissions, create an admin policy or just use the Supabase dashboard
