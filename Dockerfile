FROM --platform=$BUILDPLATFORM node:19.2.0-bullseye-slim@sha256:50b76fc6dc5f03cb3d14c71b8564948aed2bc5124325f35830b2f3be21950af1 AS cache-app
WORKDIR /app

COPY ./app/.yarn/ ./.yarn/
COPY ./app/package.json ./app/.yarnrc.yml ./app/yarn.lock ./
RUN yarn --immutable

FROM --platform=$BUILDPLATFORM node:19.2.0-bullseye-slim@sha256:50b76fc6dc5f03cb3d14c71b8564948aed2bc5124325f35830b2f3be21950af1 AS build-app
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

COPY --from=cache-app /app/node_modules/ ./node_modules/
COPY ./app/ ./
RUN yarn build

FROM --platform=$BUILDPLATFORM node:19.2.0-bullseye-slim@sha256:50b76fc6dc5f03cb3d14c71b8564948aed2bc5124325f35830b2f3be21950af1 AS cache-providers
WORKDIR /providers

COPY ./providers/.yarn/ ./.yarn/
COPY ./providers/package.json ./providers/.yarnrc.yml ./providers/yarn.lock ./
RUN yarn --immutable

FROM --platform=$BUILDPLATFORM node:19.2.0-bullseye-slim@sha256:50b76fc6dc5f03cb3d14c71b8564948aed2bc5124325f35830b2f3be21950af1 AS build-providers
WORKDIR /providers

COPY --from=cache-providers /providers/node_modules/ ./node_modules/
COPY ./providers/ ./
RUN yarn bundle

FROM --platform=$TARGETPLATFORM node:19.2.0-bullseye-slim@sha256:50b76fc6dc5f03cb3d14c71b8564948aed2bc5124325f35830b2f3be21950af1 AS runtime
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
