.PHONY: help build build-old up up-old down down-old logs logs-old restart restart-old clean clean-old dev dev-old start start-old rebuild rebuild-old dev-logs dev-logs-old dev-down dev-down-old shell shell-old db-shell db-shell-old test test-old

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the Docker images
	docker compose -f docker-compose.dev.yml build

build-old: ## Build the Docker images (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml build

rebuild: ## Rebuild the backend container (no cache)
	docker compose -f docker-compose.dev.yml build --no-cache backend
	docker compose -f docker-compose.dev.yml up -d backend

rebuild-old: ## Rebuild the backend container (no cache) (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml build --no-cache backend
	docker-compose -f docker-compose.dev.yml up -d backend

up: ## Start the services (production)
	docker compose up -d

up-old: ## Start the services (production) (for older Docker Compose V1)
	docker-compose up -d

start: ## Start the development services
	docker compose -f docker-compose.dev.yml up -d

start-old: ## Start the development services (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml up -d

down: ## Stop the services
	docker compose -f docker-compose.dev.yml down

down-old: ## Stop the services (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml down

logs: ## View logs
	docker compose -f docker-compose.dev.yml logs -f backend

logs-old: ## View logs (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml logs -f backend

restart: ## Restart the services
	docker compose -f docker-compose.dev.yml restart

restart-old: ## Restart the services (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml restart

clean: ## Stop services and remove volumes
	docker compose -f docker-compose.dev.yml down -v

clean-old: ## Stop services and remove volumes (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml down -v

dev: ## Start in development mode with hot reload
	docker compose -f docker-compose.dev.yml build --no-cache frontend
	docker compose -f docker-compose.dev.yml up -d

dev-old: ## Start in development mode with hot reload (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml build --no-cache frontend
	docker-compose -f docker-compose.dev.yml up -d

dev-logs: ## View development logs
	docker compose -f docker-compose.dev.yml logs -f backend

dev-logs-old: ## View development logs (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml logs -f backend

dev-down: ## Stop development services
	docker compose -f docker-compose.dev.yml down -v

dev-down-old: ## Stop development services (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml down -v

shell: ## Open a shell in the backend container
	docker compose -f docker-compose.dev.yml exec backend /bin/bash

shell-old: ## Open a shell in the backend container (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml exec backend /bin/bash

db-shell: ## Open PostgreSQL shell
	docker compose -f docker-compose.dev.yml exec db psql -U szuloradar -d szuloradar

db-shell-old: ## Open PostgreSQL shell (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml exec db psql -U szuloradar -d szuloradar

test: ## Run tests (if implemented)
	docker compose -f docker-compose.dev.yml exec backend pytest

test-old: ## Run tests (if implemented) (for older Docker Compose V1)
	docker-compose -f docker-compose.dev.yml exec backend pytest

