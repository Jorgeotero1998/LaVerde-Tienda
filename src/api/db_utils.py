from sqlalchemy import inspect, text

from api.models import User


def _users_table_sql(db):
    name = User.__tablename__
    if db.engine.dialect.name == "postgresql":
        return f'"{name}"'
    return name


def ensure_user_admin_column(db):
    table_name = User.__tablename__
    inspector = inspect(db.engine)
    tables = inspector.get_table_names()
    if table_name not in tables and "user" in tables:
        table_name = "user"
    if table_name not in tables:
        return
    columns = {col["name"] for col in inspector.get_columns(table_name)}
    if "is_admin" not in columns:
        table = f'"{table_name}"' if db.engine.dialect.name == "postgresql" else table_name
        default = "FALSE" if db.engine.dialect.name == "postgresql" else "0"
        with db.engine.begin() as conn:
            conn.execute(
                text(f"ALTER TABLE {table} ADD COLUMN is_admin BOOLEAN DEFAULT {default} NOT NULL")
            )


def _upsert_user(db, UserModel, *, email, password, first_name, last_name, is_admin=False):
    user = UserModel.query.filter_by(email=email).first()
    if not user:
        user = UserModel(
            first_name=first_name,
            last_name=last_name,
            email=email,
            is_active=True,
            is_admin=is_admin,
        )
        user.set_password(password)
        db.session.add(user)
        return True
    user.is_admin = is_admin or user.is_admin
    if not user.password:
        user.set_password(password)
    return False


def ensure_admin_user(db, UserModel):
    created = _upsert_user(
        db,
        UserModel,
        email="admin@laverde.com",
        password="admin1234",
        first_name="Admin",
        last_name="La Verde",
        is_admin=True,
    )
    db.session.commit()
    if created:
        print("  -> Admin demo: admin@laverde.com / admin1234")


def ensure_demo_users(db, UserModel):
    """Client demo account for live QA (idempotent)."""
    _upsert_user(
        db,
        UserModel,
        email="demo@laverde.com",
        password="Demo1234!",
        first_name="Cliente",
        last_name="Demo",
        is_admin=False,
    )
    db.session.commit()
