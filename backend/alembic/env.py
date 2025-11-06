from logging.config import fileConfig
import os

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# Import your Base and models
from database import Base
import models  # This imports all models via models/__init__.py

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set the sqlalchemy.url from settings or environment
# Try to get from config settings first, fall back to environment variable or alembic.ini
try:
    from config import settings
    database_url = settings.database_url
except Exception as e:
    # Fall back to environment variable or use alembic.ini default
    database_url = os.getenv(
        "DATABASE_URL",
        config.get_main_option("sqlalchemy.url")
    )
    if not database_url or database_url == "driver://user:pass@localhost/dbname":
        raise ValueError(
            "DATABASE_URL not found. Please set it in your .env file or environment variables. "
            f"Error loading config: {e}"
        )

# If running locally (not in Docker), replace "db" host with "localhost"
# Check if we're in Docker by looking for /.dockerenv or checking if "db" hostname resolves
def is_running_in_docker():
    """Check if we're running inside a Docker container"""
    return os.path.exists("/.dockerenv") or os.path.exists("/proc/self/cgroup")

# If not in Docker and database_url contains "@db:", replace with "@localhost:"
if not is_running_in_docker() and database_url and "@db:" in database_url:
    database_url = database_url.replace("@db:", "@localhost:")

# Only set if we have a valid URL and it's not already set in alembic.ini
if database_url and database_url != "driver://user:pass@localhost/dbname":
    config.set_main_option("sqlalchemy.url", database_url)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

