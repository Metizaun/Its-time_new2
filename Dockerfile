FROM node:20-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=optional --no-audit --no-fund

COPY . .

# SHOW_FULL_SITE is read while the home page is built (the route is static), so it is a build-time switch:
#   docker build --build-arg SHOW_FULL_SITE=true .   publishes the full site
# Without the argument the maintenance page is what ships. Env files are not part of the build context.
ARG SHOW_FULL_SITE=""
ENV SHOW_FULL_SITE=$SHOW_FULL_SITE
# Umami (analytics). Public values, inlined at build time; leave empty to ship without tracking.
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID=""
ARG NEXT_PUBLIC_UMAMI_SRC=""
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_UMAMI_SRC=$NEXT_PUBLIC_UMAMI_SRC
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID=""
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
RUN npm run build
RUN npm prune --omit=dev
# package-lock.json is written on Windows, so it only lists sharp's Windows binary and `npm ci` skips the Linux one.
# Without it next/image cannot resize or convert and serves every image at full size.
# Installed after the prune, which would otherwise remove it, and checked so a missing binary fails the build.
RUN ARCH="$(node -p process.arch)" \
  && npm install --no-save --omit=dev --no-audit --no-fund \
     "@img/sharp-linux-${ARCH}@0.34.5" "@img/sharp-libvips-linux-${ARCH}@1.2.4" \
  && node -e "require('sharp')"

FROM node:20-bookworm-slim AS runner

ARG RELEASE_SHA="unknown"
LABEL org.opencontainers.image.revision=$RELEASE_SHA

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.ts ./next.config.ts

EXPOSE 3000

CMD ["npm", "run", "start"]
