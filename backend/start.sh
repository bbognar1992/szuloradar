#!/bin/bash
set -e

echo "Waiting for database to be ready..."
# Wait for database to be ready (docker-compose depends_on ensures it's healthy, but we'll double-check)
export PGPASSWORD=${POSTGRES_PASSWORD:-szuloradar_password}
until pg_isready -h db -U ${POSTGRES_USER:-szuloradar} -d ${POSTGRES_DB:-szuloradar} 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

echo "Checking for model changes and creating migrations..."
# Auto-generate migrations if there are model changes
# This will create a migration only if there are differences between models and database
set +e  # Temporarily disable exit on error for this command
alembic revision --autogenerate -m "auto migration $(date +%Y%m%d_%H%M%S)" 2>&1
AUTOGEN_EXIT_CODE=$?
set -e  # Re-enable exit on error

if [ $AUTOGEN_EXIT_CODE -eq 0 ]; then
  echo "Migration created successfully"
else
  echo "No new migrations needed (models match database state) or autogenerate completed"
fi

echo "Applying Alembic migrations..."
alembic upgrade head

# Load development data if LOAD_DEV_DATA is set to true
if [ "${LOAD_DEV_DATA:-false}" = "true" ]; then
    echo "Loading development data..."
    python3 load_dev_data.py || echo "Warning: Failed to load development data"
fi

echo "Starting application..."
exec "$@"

