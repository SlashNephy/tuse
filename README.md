# tuse

ð Team Universal Search Engine

ãã¾ãã¾ãªãµã¼ãã¹ããæ¨ªæ­æ¤ç´¢ã§ãããã·ã³ãã«ãªæ¤ç´¢ã¨ã³ã¸ã³ã§ãããã¼ã ãå°è¦æ¨¡ã³ãã¥ããã£ã¼åã§ã®éç¨ãæ³å®ãã¦ãã¾ãã  
[ãã©ã°ã¤ã³ã·ã¹ãã ](https://github.com/SlashNephy/tuse/blob/master/providers) ãå°å¥ãã¦ãããå¯¾è±¡ã®æ¤ç´¢ã½ã¼ã¹ãå¢ãããã¨ãã§ãã¾ãã

![](https://raw.githubusercontent.com/SlashNephy/tuse/master/docs/screenshot1.png)

## Getting Started

`.env.example` ãåèã«ç°å¢å¤æ°ãè¨­å®ãã¾ãã

```console
$ cp .env.example .env
$ code .env
```

### Docker

`docker-compose.yml` ãç¨æãã¾ãã`docker compose up` ã§èµ·åãã¾ãã

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

éçºãµã¼ãã¼ã¯ä»¥ä¸ã®ã³ãã³ãã§èµ·åãã¾ããhttp://localhost:3000 ã«ãµã¼ãã¼ãèµ·åãã¾ãã

```console
$ yarn
$ yarn dev
```
