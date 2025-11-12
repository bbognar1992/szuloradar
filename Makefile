.PHONY: help build up down logs restart clean dev start rebuild

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the Docker images
	docker compose -f docker-compose.dev.yml build

rebuild: ## Rebuild the backend container (no cache)
	docker compose -f docker-compose.dev.yml build --no-cache backend
	docker compose -f docker-compose.dev.yml up -d backend

up: ## Start the services (production)
	docker compose up -d

start: ## Start the development services
	docker compose -f docker-compose.dev.yml up -d

down: ## Stop the services
	docker compose -f docker-compose.dev.yml down

logs: ## View logs
	docker compose -f docker-compose.dev.yml logs -f backend

restart: ## Restart the services
	docker compose -f docker-compose.dev.yml restart

clean: ## Stop services and remove volumes
	docker compose -f docker-compose.dev.yml down -v

dev: ## Start in development mode with hot reload
	docker compose -f docker-compose.dev.yml up -d

dev-logs: ## View development logs
	docker compose -f docker-compose.dev.yml logs -f backend

dev-down: ## Stop development services
	docker compose -f docker-compose.dev.yml down -v

shell: ## Open a shell in the backend container
	docker compose -f docker-compose.dev.yml exec backend /bin/bash

db-shell: ## Open PostgreSQL shell
	docker compose -f docker-compose.dev.yml exec db psql -U szuloradar -d szuloradar

test: ## Run tests (if implemented)
	docker compose -f docker-compose.dev.yml exec backend pytest

