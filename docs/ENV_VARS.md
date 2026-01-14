  Summary: How It Works Now

  For local development (yarn start)

  React picks up from: .env.development → http://localhost:8000

  For local production build (yarn build)

  React picks up from: .env.production → https://api.flags.izeebot.top

  For Docker builds

  Local dev (Dockerfile.local):
  docker build -f Dockerfile.local \
    --build-arg REACT_APP_API_URL=http://localhost:8000 \
    --build-arg REACT_APP_AUTH_URL=http://localhost:8547 \
    -t flagsapp-local .

  Production (Dockerfile via pipeline):
  - Uses GitHub repository variables (vars.REACT_APP_API_URL)
  - Falls back to Dockerfile defaults if not set

  Action Required: Add GitHub Repository Variables

  Go to GitHub → Repo Settings → Secrets and variables → Actions → Variables and add:
  ┌────────────────────┬───────────────────────────────┐
  │      Variable      │             Value             │
  ├────────────────────┼───────────────────────────────┤
  │ REACT_APP_API_URL  │ https://api.flags.izeebot.top │
  ├────────────────────┼───────────────────────────────┤
  │ REACT_APP_AUTH_URL │ https://auth.izeebot.top      │
  └────────────────────┴───────────────────────────────┘
  Using vars (variables) instead of secrets since these aren't sensitive - they're just URLs that end up in the JS bundle anyway.

  ---
  Key Points About React + .env Files

  1. CRA loads .env files at build time, not runtime
  2. Only REACT_APP_* prefixed vars are embedded
  3. Values get baked into the JS bundle - cannot change without rebuild
  4. Priority: .env.development.local > .env.local > .env.development > .env
