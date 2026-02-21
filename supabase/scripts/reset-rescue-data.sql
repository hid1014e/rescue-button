-- 落ち込みレスキューボタン：お試しデータの完全リセット
-- Supabase ダッシュボード → SQL Editor で実行してください。

-- 1. 応援メッセージを先に削除（外部キー制約のため）
DELETE FROM rescue_encouragements;

-- 2. 投稿をすべて削除
DELETE FROM rescue_posts;

-- 実行後、rescue_posts と rescue_encouragements は空になります。
