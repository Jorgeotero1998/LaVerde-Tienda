from sqlalchemy import inspect, text


def _user_table_sql(db):
    """Quote reserved table name on PostgreSQL."""
    if db.engine.dialect.name == "postgresql":
        return '"user"'
    return "user"


def ensure_user_admin_column(db):
    inspector = inspect(db.engine)
    if "user" not in inspector.get_table_names():
        return
    columns = {col["name"] for col in inspector.get_columns("user")}
    if "is_admin" not in columns:
        table = _user_table_sql(db)
        default = "FALSE" if db.engine.dialect.name == "postgresql" else "0"
        with db.engine.begin() as conn:
            conn.execute(
                text(f"ALTER TABLE {table} ADD COLUMN is_admin BOOLEAN DEFAULT {default} NOT NULL")
            )


def _upsert_user(db, User, *, email, password, first_name, last_name, is_admin=False):
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
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


def ensure_admin_user(db, User):
    created = _upsert_user(
        db,
        User,
        email="admin@laverde.com",
        password="admin1234",
        first_name="Admin",
        last_name="La Verde",
        is_admin=True,
    )
    db.session.commit()
    if created:
        logger_msg = "  -> Admin demo: admin@laverde.com / admin1234"
        print(logger_msg)


def ensure_demo_users(db, User):
    """Client demo account for live QA (idempotent)."""
    _upsert_user(
        db,
        User,
        email="demo@laverde.com",
        password="Demo1234!",
        first_name="Cliente",
        last_name="Demo",
        is_admin=False,
    )
    db.session.commit()
