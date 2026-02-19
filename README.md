# 落ち込みレスキューボタン (Falling Down Rescue Button)

落ち込んだら、ここで励ましを受け取ろう。匿名で匿名な応援。

## 概要

ユーザーが「落ち込んだこと」を投稿し、他のユーザーがそれに「励まし」を送ることで、匿名で励まし合いを体験できるミニゲーム。非同期モデルで、リアルタイムマッチングに依存しない。

## 機能

- **テーマ選択**: 5つの落ち込みテーマから選択
- **投稿機能**: 匿名で落ち込みを投稿
- **励まし機能**: 他のユーザーの投稿に励ましメッセージを送る
- **BuddyShare誘導**: ゲーム完了後にBuddyShareへのリンクを表示

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下を設定：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BUDDYSHARE_URL=https://myapp.vercel.app
```

### 3. Supabaseテーブルの作成

Supabase Dashboard → SQL Editor で `supabase/schema.sql` を実行

### 4. 開発サーバーの起動

```bash
npm run dev
```

## プロジェクト構造

```
rescue-button/
├── app/
│   ├── page.tsx              # トップページ
│   ├── theme-select/         # テーマ選択
│   ├── posts/                # 投稿一覧
│   ├── post/create/          # 投稿作成
│   ├── encourage/            # 励まし入力
│   └── complete/             # 完了画面
├── lib/
│   └── supabase.ts           # Supabaseクライアント
└── supabase/
    └── schema.sql            # データベーススキーマ
```

## デプロイ

Vercelにデプロイする場合：

1. GitHubにプッシュ
2. Vercelでプロジェクトをインポート
3. 環境変数を設定
4. デプロイ

## ライセンス

Private
