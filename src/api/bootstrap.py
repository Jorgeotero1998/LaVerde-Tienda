"""Idempotent database bootstrap for local dev and Render production."""

import logging

logger = logging.getLogger(__name__)


def normalize_database_url(url: str) -> str:
    """Render/Heroku often provide postgres:// — SQLAlchemy 2 expects postgresql://."""
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql://", 1)
    return url


def run_migrations(app):
    try:
        from flask_migrate import upgrade

        upgrade()
        logger.info("Alembic migrations applied")
    except Exception as exc:
        logger.warning("Migration upgrade skipped: %s", exc)


def bootstrap_database(app, db):
    """Create schema, demo admin, and product catalog. Safe to call on every boot."""
    from api.catalog_seed import ensure_catalog
    from api.db_utils import ensure_admin_user, ensure_demo_users, ensure_user_admin_column
    from api.models import Product, User

    with app.app_context():
        run_migrations(app)
        db.create_all()
        ensure_user_admin_column(db)
        ensure_admin_user(db, User)
        ensure_demo_users(db, User)
        added, fixed = ensure_catalog(db, Product)
        logger.info(
            "Bootstrap OK — catalog +%s/~%s images, admin ready",
            added,
            fixed,
        )
