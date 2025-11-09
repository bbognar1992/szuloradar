# Environment Variables Setup

## Quick Start for Development

1. **Copy the example file:**
   ```bash
   cp .env.dev.example .env
   ```

2. **Edit `.env` if needed** (the defaults work for local development)

3. **Run docker-compose from the root directory:**
   ```bash
   docker-compose -f docker-compose.dev.yml --env-file .env up -d
   ```
   
   Or use the Makefile:
   ```bash
   make dev
   ```

## Environment Variables

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT signing key (use a strong random key for production)

### Optional Variables

- `ALGORITHM` - JWT algorithm (default: HS256)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration (default: 30)
- `DEBUG` - Debug mode (default: True for dev)
- `CORS_ORIGINS` - Allowed CORS origins (JSON array)

## Example .env File

See `.env.dev.example` for a complete example with all variables documented.

## Security Notes

- Never commit `.env` files to git
- Use different `SECRET_KEY` values for development and production
- Generate strong keys for production: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

