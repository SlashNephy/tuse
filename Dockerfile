FROM --platform=$BUILDPLATFORM node:24.12.0-bullseye-slim@sha256:99c26b45ed43541718e38d5778792f38c0f3655dd0e1415f24c61782a62b0a1a AS cache-app
WORKDIR /app

COPY ./app/.yarn/ ./.yarn/
COPY ./app/package.json ./app/.yarnrc.yml ./app/yarn.lock ./
RUN yarn --immutable

FROM --platform=$BUILDPLATFORM node:24.12.0-bullseye-slim@sha256:99c26b45ed43541718e38d5778792f38c0f3655dd0e1415f24c61782a62b0a1a AS build-app
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY --from=cache-app /app/node_modules/ ./node_modules/
COPY ./app/ ./
RUN yarn build

FROM --platform=$BUILDPLATFORM node:24.12.0-bullseye-slim@sha256:99c26b45ed43541718e38d5778792f38c0f3655dd0e1415f24c61782a62b0a1a AS cache-providers
WORKDIR /providers

COPY ./providers/.yarn/ ./.yarn/
COPY ./providers/package.json ./providers/.yarnrc.yml ./providers/yarn.lock ./
RUN yarn --immutable

FROM --platform=$BUILDPLATFORM node:24.12.0-bullseye-slim@sha256:99c26b45ed43541718e38d5778792f38c0f3655dd0e1415f24c61782a62b0a1a AS build-providers
WORKDIR /providers

COPY --from=cache-providers /providers/node_modules/ ./node_modules/
COPY ./providers/ ./
RUN yarn bundle

FROM --platform=$TARGETPLATFORM node:24.12.0-bullseye-slim@sha256:99c26b45ed43541718e38d5778792f38c0f3655dd0e1415f24c61782a62b0a1a AS runtime
ENV NODE_ENV="production"
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
ENV TUSE_PLUGINS_DIR="/app/plugins"
WORKDIR /app
USER node

COPY --from=build-providers /app/plugins/ ./plugins/
COPY --from=build-app /app/package.json /app/next.config.js ./
COPY --from=build-app /app/public/ ./public/
COPY --from=build-app --chown=node:node /app/.next/standalone ./
COPY --from=build-app --chown=node:node /app/.next/static ./.next/static

ENTRYPOINT ["node", "server.js"]
