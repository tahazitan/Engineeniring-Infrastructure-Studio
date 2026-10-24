CREATE TABLE IF NOT EXISTS projects (
  slug text PRIMARY KEY,
  title text NOT NULL,
  domain text NOT NULL,
  summary text NOT NULL,
  stack jsonb NOT NULL DEFAULT '[]'::jsonb,
  objectives jsonb NOT NULL DEFAULT '[]'::jsonb,
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  test_plan jsonb NOT NULL DEFAULT '[]'::jsonb,
  topology jsonb NOT NULL DEFAULT '{"nodes":[],"edges":[]}'::jsonb,
  configuration text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','in_progress','verified')),
  public_visible boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS projects_public_idx ON projects(public_visible, status);
CREATE TABLE IF NOT EXISTS evidence (
  id text PRIMARY KEY,
  project_slug text NOT NULL REFERENCES projects(slug) ON DELETE CASCADE,
  filename text NOT NULL,
  content_type text NOT NULL,
  bytes integer NOT NULL,
  sha256 text NOT NULL,
  object_key text NOT NULL,
  caption text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS evidence_project_idx ON evidence(project_slug,created_at DESC);
