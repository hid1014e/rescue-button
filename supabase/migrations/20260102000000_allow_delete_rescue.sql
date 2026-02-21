-- 投稿・応援メッセージの削除を許可（RLS を有効にしている場合のみ実行）
-- 削除が 403 になる場合は、Supabase ダッシュボードの SQL エディタで以下を実行してください。
/*
DROP POLICY IF EXISTS "Anyone can delete posts" ON rescue_posts;
CREATE POLICY "Anyone can delete posts" ON rescue_posts FOR DELETE USING (true);

DROP POLICY IF EXISTS "Anyone can delete encouragements" ON rescue_encouragements;
CREATE POLICY "Anyone can delete encouragements" ON rescue_encouragements FOR DELETE USING (true);
*/
