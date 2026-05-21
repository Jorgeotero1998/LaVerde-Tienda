from sqlalchemy import inspect, text


def ensure_user_admin_column(db):
    inspector = inspect(db.engine)
    if "user" not in inspector.get_table_names():
        return
    columns = {col["name"] for col in inspector.get_columns("user")}
    if "is_admin" not in columns:
        with db.engine.begin() as conn:
            conn.execute(
                text("ALTER TABLE user ADD COLUMN is_admin BOOLEAN DEFAULT 0 NOT NULL")
            )


def ensure_admin_user(db, User):
    admin = User.query.filter_by(email="admin@laverde.com").first()
    if not admin:
        admin = User(
            first_name="Admin",
            last_name="La Verde",
            email="admin@laverde.com",
            is_active=True,
            is_admin=True,
        )
        admin.set_password("admin1234")
        db.session.add(admin)
        print("  -> Usuario admin: admin@laverde.com / admin1234")
    else:
        admin.is_admin = True
    db.session.commit()
