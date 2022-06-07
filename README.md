# tuse

🔍 Team Universal Search Engine

Discord / GitHub などから横断検索するシンプルな検索エンジンです。チームや小規模コミュニティー内での運用を想定しています。

## 対応サービス

- GitHub (WIP)
  - コミット
  - リポジトリ
  - Issue / PR
  - メンバー
- Discord
  - メンバー
  - メッセージ
    - Discord API の仕様により、ユーザートークンが必要です (Bot アカウントでは動作しません)。
- Scrapbox (TODO)

## Getting Started

`.env.example` を参考に環境変数を設定します。

```console
$ cp .env.example .env
$ code .env
```

開発サーバーは以下のコマンドで起動します。http://localhost:3000 にサーバーが起動します。

```console
$ yarn
$ yarn dev
```
