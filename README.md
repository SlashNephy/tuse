# tuse

🔍 Team Universal Search Engine

さまざまなサービスから横断検索できる、シンプルな検索エンジンです。チームや小規模コミュニティー内での運用を想定しています。  
[プラグインシステム](https://github.com/SlashNephy/tuse/blob/master/providers) を導入しており、対象の検索ソースを増やすことができます。

![](https://raw.githubusercontent.com/SlashNephy/tuse/master/docs/screenshot1.png)

## Getting Started

`.env.example` を参考に環境変数を設定します。

```console
$ cp .env.example .env
$ code .env
```

### Docker

`docker-compose.yml` を用意します。`docker compose up` で起動します。

```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/slashnephy/tuse:master
    restart: always
    volumes:
      - ./.env:/app/.env:ro
      - ./config:/app/plugins/config:ro
    ports:
      - '3000:3000/tcp'
```

### Development

開発サーバーは以下のコマンドで起動します。http://localhost:3000 にサーバーが起動します。

```console
$ yarn
$ yarn dev
```
