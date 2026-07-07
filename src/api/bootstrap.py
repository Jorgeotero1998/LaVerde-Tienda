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
        return True
    except Exception as exc:
        logger.warning("Migration upgrade skipped: %s", exc)
        return False


def bootstrap_database(app, db):
    """Create schema, demo users, and product catalog. Safe to call on every boot."""
    from api.catalog_seed import ensure_catalog
    from api.db_utils import ensure_admin_user, ensure_demo_users, ensure_user_admin_column
    from api.models import Product, User

    with app.app_context():
        db.create_all()
        run_migrations(app)
        ensure_user_admin_column(db)
        ensure_admin_user(db, User)
        ensure_demo_users(db, User)
        added, fixed = ensure_catalog(db, Product)
        db.session.commit()
        logger.info(
            "Bootstrap OK — catalog +%s/~%s images, users seeded",
            added,
            fixed,
        )


def safe_bootstrap(app, db):
    """Never raises — logs failure for Render diagnostics."""
    try:
        bootstrap_database(app, db)
        return True
    except Exception as exc:
        logger.error("Database bootstrap failed: %s", exc, exc_info=True)
        return False
