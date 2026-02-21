-- 落ち込みレスキューボタン用テーブル定義

-- 投稿テーブル（view_token: 投稿者だけが「届いた応援一覧」を開く用）
CREATE TABLE IF NOT EXISTS rescue_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme text NOT NULL CHECK (theme IN ('work-study', 'relationships', 'future-anxiety', 'failure', 'general')),
  content text NOT NULL CHECK (char_length(content) <= 500),
  anonymous_id text NOT NULL,
  view_token text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 励ましメッセージテーブル（reaction: ワンタップリアクション 3択）
CREATE TABLE IF NOT EXISTS rescue_encouragements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES rescue_posts(id) ON DELETE CASCADE,
  message text NOT NULL CHECK (char_length(message) <= 300),
  anonymous_id text NOT NULL,
  reaction text CHECK (reaction IN ('a_bit_better', 'very_encouraged', 'still_struggling')),
  reacted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_rescue_posts_theme ON rescue_posts(theme);
CREATE INDEX IF NOT EXISTS idx_rescue_posts_created_at ON rescue_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rescue_encouragements_post_id ON rescue_encouragements(post_id);

-- RLSを有効化（必要に応じて）
-- ALTER TABLE rescue_posts ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rescue_encouragements ENABLE ROW LEVEL SECURITY;

-- 公開読み取り・書き込みポリシー（ゲスト参加のため）
-- CREATE POLICY "Anyone can read posts" ON rescue_posts FOR SELECT USING (true);
-- CREATE POLICY "Anyone can create posts" ON rescue_posts FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Anyone can read encouragements" ON rescue_encouragements FOR SELECT USING (true);
-- CREATE POLICY "Anyone can create encouragements" ON rescue_encouragements FOR INSERT WITH CHECK (true);

COMMENT ON TABLE rescue_posts IS '落ち込み投稿テーブル。匿名で投稿・閲覧可能。';
COMMENT ON TABLE rescue_encouragements IS '励ましメッセージテーブル。投稿に対する励ましを保存。';
