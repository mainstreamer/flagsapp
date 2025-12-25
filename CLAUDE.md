# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Flags App is a React-based flag guessing quiz game with user authentication via Telegram/OAuth2, score tracking, and a leaderboard system.

**Live App:** https://flags-app.izeebot.top

## Development Commands

```bash
# Install dependencies
yarn install

# Start development server (runs on http://localhost:3000)
yarn start

# Run tests
yarn test

# Production build
yarn build
```

### Backend Setup

```bash
# Initialize docker submodule for backend API
make init

# Run API backend (docker-compose)
make run

# Build docker containers
make build-containers
```

### Database

MySQL 5.7 at `127.0.0.1:3306` (user: root, pass: root, dbname: flags)

## Architecture

### Tech Stack
- **React 16** with Create React App
- **Redux** with Immutable.js for state management
- **React Router DOM** for routing
- **React Bootstrap** for UI components
- **Axios** for HTTP requests with Bearer token auth

### Key Directories

- `src/actions/` - Redux action creators
- `src/components/` - Presentational React components
  - `flags/` - Game components (FlagsApi.js is the main quiz game)
  - `home/` - Landing page with leaderboard
- `src/config/` - API endpoint and Axios configuration
- `src/containers/` - Redux-connected smart components
- `src/hooks/` - Custom React hooks (useOAuth for OAuth2 flow)
- `src/reducers/` - Redux reducers using Immutable.js

### State Management

Redux reducer in `src/reducers/initial.js` manages game state:
- `counter`, `question`, `answer`, `answerCode` - Quiz state
- `timer`, `maxTimer`, `sessionTimer` - 15-second countdown per question
- `lifes`, `lifesIcon` - 3 lives system with emoji indicators

Redux action types: `set`, `correct`, `incorrect`, `reset`, `tick`, `restartTimer`

### Authentication Flow

1. Telegram login button or OAuth2 popup (useOAuth hook)
2. Bearer token stored in localStorage
3. Axios interceptor auto-injects token on requests

### API Configuration

API endpoint configured in `src/config/Api.js` (default: `https://localhost:4430`)

Key endpoints:
- `GET /test` - Fetch next question
- `POST /api/login` - Telegram auth
- `POST /flags/correct/{answerCode}` - Record correct answer
- `POST /flags/scores` - Submit final score
- `GET /flags/scores` - Fetch leaderboard
- `GET /profile` - User stats

### Routes

- `/` - Home (leaderboard, login)
- `/flagsapi` - Main quiz game
- `/profile` - User profile with stats
