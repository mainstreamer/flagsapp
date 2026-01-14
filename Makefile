.PHONY: help network dev prod-test build-prod down clean-docker sh logs

#CYAN  := \033[0;36m
#RESET := \033[0m
# Use printf to set variables so they work with any 'echo'
CYAN  := $(shell printf ' \033[0;36m')
RESET := $(shell printf ' \033[0m')

# Settings
COMPOSE_DEV  := docker compose
COMPOSE_PROD := docker compose -f docker-compose.yml -f docker-compose.local-prod.yml

init: network ## First-time setup: Create networks, clean environment, and start dev
	@echo "$(CYAN)Initializing Docker environment...$(RESET)"
	@$(COMPOSE_DEV) down -v --remove-orphans
	@echo "$(CYAN)Building and starting containers (this may take a few minutes)...$(RESET)"
	@$(COMPOSE_DEV) up --build -d
	@echo "$(CYAN)Installation complete!$(RESET)"
	@echo "Checking container status..."
	@$(COMPOSE_DEV) ps
	@echo "Follow logs with: $(CYAN)make logs$(RESET)"
	@echo "App will be available at: http://localhost:3000"

help: ## Show this help message
	@printf "\nUsage: make $(CYAN)[target]$(RESET)\n\n"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(CYAN)%-22s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST) | sort -f

network: ## Create required Docker networks
	@docker network create backend-flags 2>/dev/null || true
	@docker network create openid_network 2>/dev/null || true
	@echo "Networks verified."

# --- DEVELOPMENT ---
dev: network ## Start HOT-RELOAD development (Port 3000)
	@echo "Starting Dev Server (Node 18)..."
	@$(COMPOSE_DEV) up --build

# --- LOCAL PRODUCTION TESTING ---
prod-test: network ## Start LOCAL PROD container (Caddy, Port 3001)
	@echo "Building & Starting Production-like container (Caddy)..."
	@$(COMPOSE_PROD) up --build -d
	@echo "App running at http://localhost:3001"

# --- CI / REAL PRODUCTION ---
build-prod: ## Manually build the final production image (Caddy stage)
	@docker build --target production -t flags-app:latest .

# --- UTILS ---
down: ## Stop all local containers
	@$(COMPOSE_DEV) down --remove-orphans
	@$(COMPOSE_PROD) down --remove-orphans

sh: ## Drop into the running dev container shell
	@$(COMPOSE_DEV) exec react sh

logs: ## Tail logs from the dev container
	@$(COMPOSE_DEV) logs -f react

clean-docker: ## Nuclear option: remove volumes and orphans
	@$(COMPOSE_DEV) down -v --remove-orphans
	@docker system prune -f --filter "label=com.docker.compose.project"
	@echo "Docker environment cleaned."

reinstall: ## Wipe container modules and reinstall from scratch
	@echo "Hard resetting container dependencies..."
	@$(COMPOSE_DEV) down -v
	@$(COMPOSE_DEV) build --no-cache
	@$(COMPOSE_DEV) up -d
	@echo "Fresh dependencies installed inside the container."

npm-add: ## Add a new package (Usage: make npm-add PKG=axios)
	@$(COMPOSE_DEV) exec react npm install $(PKG)
	@echo "Package $(PKG) added and package.json updated via container."
