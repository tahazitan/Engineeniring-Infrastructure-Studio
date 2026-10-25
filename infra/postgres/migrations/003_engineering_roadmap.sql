CREATE TABLE IF NOT EXISTS engineering_roadmap_progress (
 item_id text PRIMARY KEY,
 status text NOT NULL DEFAULT 'planned' CHECK(status IN ('planned','in_progress','completed')),
 notes text NOT NULL DEFAULT '',
 updated_at timestamptz NOT NULL DEFAULT now()
);
