# SzülőRadar

A kid-friendly places discovery application that helps parents find and share recommendations for family-friendly locations.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Make (optional, but recommended for easier commands)

> **Note:** If you're using Docker Compose V1 (older versions, common on Ubuntu), use the `-old` variants of commands (e.g., `make dev-old` instead of `make dev`). The regular commands work with Docker Compose V2.

### Getting Started

1. **Set up environment variables** (see [ENV_SETUP.md](ENV_SETUP.md) for details):
   ```bash
   cp .env.dev.example .env
   ```

2. **Start the development environment**:
   
   For Docker Compose V2 (default):
   ```bash
   make dev
   ```
   
   For Docker Compose V1 (older systems like Ubuntu):
   ```bash
   make dev-old
   ```

3. **Access the application**:
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Frontend: Open `frontend/index.html` in your browser

4. **Stop the development environment**:
   
   For Docker Compose V2:
   ```bash
   make dev-down
   ```
   
   For Docker Compose V1:
   ```bash
   make dev-down-old
   ```

## 👤 Test User Account

A test user is automatically seeded in the development database for authentication testing:

- **Email:** `test@example.com`
- **Password:** `TestPassword123!`

This test user is created via the migration file [`7bb6cf7c0f3d_add_test_user_for_auth_testing.py`](backend/alembic/versions/7bb6cf7c0f3d_add_test_user_for_auth_testing.py), ensuring you can log in to the backend immediately after setup. See [Authentication Usage](backend/AUTH_USAGE.md) for example login instructions.

## 📋 Available Commands

Run `make help` to see all available commands.

### Common Development Commands

**Docker Compose V2 (default):**
- `make dev` - Start development services with hot reload
- `make dev-down` - Stop development services and remove volumes
- `make dev-logs` - View backend logs
- `make shell` - Open a shell in the backend container
- `make db-shell` - Open PostgreSQL shell
- `make test` - Run tests

**Docker Compose V1 (older systems):**
- `make dev-old` - Start development services with hot reload
- `make dev-down-old` - Stop development services and remove volumes
- `make dev-logs-old` - View backend logs
- `make shell-old` - Open a shell in the backend container
- `make db-shell-old` - Open PostgreSQL shell
- `make test-old` - Run tests

All commands have `-old` variants for compatibility with Docker Compose V1. Use them if you encounter errors with the regular commands.

## 📚 Documentation

- [Environment Setup](ENV_SETUP.md) - Detailed environment variable configuration
- [Authentication Usage](backend/AUTH_USAGE.md) - Authentication and authorization guide
- [Docker Troubleshooting](DOCKER_TROUBLESHOOTING.md) - Common Docker issues and solutions

## 🏗️ Project Structure

- `backend/` - FastAPI backend application
- `frontend/` - Frontend HTML/CSS/JavaScript application
- `docker-compose.dev.yml` - Docker Compose configuration for development

## 🔧 Development

The backend runs with hot reload enabled, so changes to Python files will automatically restart the server. The frontend files can be edited directly and refreshed in the browser.