FROM node:24-alpine AS build

ARG VITE_KPM_API_BASE=
ENV VITE_KPM_API_BASE=${VITE_KPM_API_BASE}

WORKDIR /app
COPY apps/frontend/kpm-web/package.json apps/frontend/kpm-web/package-lock.json ./
RUN npm ci
COPY apps/frontend/kpm-web/ ./
RUN npm run build

FROM nginx:1.27-alpine

LABEL org.opencontainers.image.title="Kozen KPM frontend for Railway" \
      org.opencontainers.image.description="Nginx-hosted KPM web UI with Railway private-network API proxy"

ENV PORT=80

COPY railway/nginx.default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=5 CMD wget -qO- "http://127.0.0.1:${PORT:-80}/" >/dev/null 2>&1 || exit 1
