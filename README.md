# SzülőRadar

A kid-friendly places discovery application that helps parents find and share recommendations for family-friendly locations.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Make (optional, but recommended for easier commands)

### Getting Started

1. **Set up environment variables** (see [ENV_SETUP.md](ENV_SETUP.md) for details):
   ```bash
   cp .env.dev.example .env
   ```

2. **Start the development environment**:
   ```bash
   make dev
   ```

3. **Access the application**:
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Frontend: Open `frontend/index.html` in your browser

4. **Stop the development environment**:
   ```bash
   make dev-down
   ```

## 📋 Available Commands

Run `make help` to see all available commands, or use:

- `make dev` - Start development services with hot reload
- `make dev-down` - Stop development services and remove volumes
- `make dev-logs` - View backend logs
- `make shell` - Open a shell in the backend container
- `make db-shell` - Open PostgreSQL shell
- `make test` - Run tests

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