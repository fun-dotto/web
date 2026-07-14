# Dotto Web

[![CI](https://github.com/fun-dotto/web/actions/workflows/ci.yml/badge.svg)](https://github.com/fun-dotto/web/actions/workflows/ci.yml)

## セットアップ

1. `.env.example` を参考に `.env.local` を作成
2. 依存関係をインストール
3. 開発サーバーを起動

```bash
mise setup
pnpm dev
```

## Storybook

コンポーネントカタログを `http://localhost:6006` で起動します。

```bash
pnpm storybook
```

静的ファイルを生成する場合は `pnpm build-storybook` を実行します。

## Firebase App Check

このプロジェクトは Firebase App Check（reCAPTCHA v3）を利用します。

- `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY` を設定すると App Check が有効になります
- ローカル検証では `NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN` が利用できます
  - `true` を設定するとデバッグトークンを自動生成
  - 固定値を設定するとその値を利用

App Check トークンは自動リフレッシュを有効化しています。
