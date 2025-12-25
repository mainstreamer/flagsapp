# Stage 1: Build the React application
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source code
COPY . .

# Build the production bundle
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN if [ -f yarn.lock ]; then yarn build; else npm run build; fi

# Stage 2: Serve with Caddy
FROM caddy:2-alpine

# Copy built files from builder stage
COPY --from=builder /app/build /srv

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
