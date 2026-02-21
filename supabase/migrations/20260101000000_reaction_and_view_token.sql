-- ① ワンタップリアクション用: 励ましにリアクションを保存
ALTER TABLE rescue_encouragements
  ADD COLUMN IF NOT EXISTS reaction text CHECK (reaction IN ('a_bit_better', 'very_encouraged', 'still_struggling')),
  ADD COLUMN IF NOT EXISTS reacted_at timestamptz;

-- 投稿者だけが「届いた応援一覧」を開けるようにするトークン
ALTER TABLE rescue_posts
  ADD COLUMN IF NOT EXISTS view_token text UNIQUE;

CREATE INDEX IF NOT EXISTS idx_rescue_encouragements_reaction ON rescue_encouragements(post_id) WHERE reaction IS NOT NULL;
COMMENT ON COLUMN rescue_encouragements.reaction IS 'a_bit_better=ちょっと元気出た, very_encouraged=すごく励まされた, still_struggling=今はまだしんどい';
