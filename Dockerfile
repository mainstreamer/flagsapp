# --- Stage 1: Base ---
FROM node:18-alpine AS base

# Receive IDs from docker-compose
ARG USER_ID=1000
ARG GROUP_ID=1000

# Alpine-specific way to adjust 'node' user to match your host
RUN apk add --no-cache shadow && \
    if [ ${USER_ID:-0} -ne 0 ] && [ ${GROUP_ID:-0} -ne 0 ]; then \
        userdel -f node && \
        if getent group node ; then groupdel node; fi && \
        groupadd -g ${GROUP_ID} node && \
        useradd -l -u ${USER_ID} -g node node && \
        install -d -m 0755 -o node -g node /app; \
    fi

WORKDIR /app
# From now on, the container acts as "you"
USER node

# 3. Copy dependency files first (for caching)
COPY --chown=node:node package.json yarn.lock* package-lock.json* ./

# Use frozen-lockfile for consistency
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi
# --- Stage 2: Development (Hot Reload) ---
FROM base AS development
ENV NODE_OPTIONS=--openssl-legacy-provider
# No COPY . . here! We use bind mounts in docker-compose.
EXPOSE 3000
CMD ["npm", "start"]

# --- Stage 3: Builder (Compilation) ---
FROM base AS builder
COPY . .
# Args to bake URLs into the JS bundle
ARG REACT_APP_API_URL
ARG REACT_APP_AUTH_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_AUTH_URL=$REACT_APP_AUTH_URL
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# --- Stage 4: Production (Caddy) ---
FROM caddy:2-alpine AS production
# Set the working directory for Caddy
WORKDIR /usr/share/caddy
# Copy built files from the builder stage
COPY --from=builder /app/build /usr/share/caddy
# Copy your optimized Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
# Use the config file we just copied
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]