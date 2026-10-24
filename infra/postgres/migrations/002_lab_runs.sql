CREATE TABLE IF NOT EXISTS lab_runs (
  id text PRIMARY KEY,
  project_slug text NOT NULL,
  action text NOT NULL CHECK(action IN ('deploy','status','verify','destroy')),
  state text NOT NULL CHECK(state IN ('running','success','failed')),
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  exit_code integer,
  stdout text NOT NULL DEFAULT '',
  stderr text NOT NULL DEFAULT '',
  timed_out boolean NOT NULL DEFAULT false,
  evidence_id text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lab_runs_project_idx ON lab_runs(project_slug, started_at DESC);
