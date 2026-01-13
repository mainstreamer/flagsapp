.PHONY: help build up down rebuild dev test install clean logs sh network

CYAN := \033[0;36m
RESET := \033[0m

# Local compose file
LOCAL_COMPOSE := docker compose -f docker-compose.local.yml

# Default target
help: ## Show this help message
	@printf "\\nUsage: make $(CYAN)[target]$(RESET)\\n\\n"
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(CYAN)%-22s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort -f

install: ## Install dependencies
	@yarn install

dev: ## Start development server at http://localhost:3000
	@echo "Starting dev server at http://localhost:3000"
	@echo "Using API: $${REACT_APP_API_URL:-http://localhost:8000}"
	@echo "Using Auth: $${REACT_APP_AUTH_URL:-http://localhost:8547}"
	@yarn start

build: ## Build production bundle
	@yarn build

test: ## Run tests
	@yarn test

# Docker targets
docker-build: ## Build local Docker image
	@$(LOCAL_COMPOSE) build

docker-up: ## Start local Docker container
	@$(LOCAL_COMPOSE) up -d

docker-down: ## Stop local Docker container
	@$(LOCAL_COMPOSE) down

docker-rebuild: docker-down docker-build docker-up ## Rebuild and restart Docker container

docker-logs: ## Show Docker container logs
	@$(LOCAL_COMPOSE) logs -f

docker-sh: ## Shell into Docker container
	@$(LOCAL_COMPOSE) exec app sh

# Full local setup
local: docker-build docker-up ## Build and start local Docker setup
	@echo "App running at http://localhost:3001"

# Network setup
network: ## Create required Docker networks
	@docker network create backend-flags 2>/dev/null || true
	@docker network create openid_network 2>/dev/null || true
	@echo "Networks created (or already exist)"

# Cleanup
clean: ## Clean build artifacts
	@rm -rf build/
	@rm -rf node_modules/.cache/
	@echo "Cleaned build artifacts"

clean-all: clean ## Clean all (including node_modules)
	@rm -rf node_modules/
	@echo "Cleaned node_modules"
