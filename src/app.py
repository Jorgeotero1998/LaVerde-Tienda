import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INSTANCE_DIR = os.path.join(ROOT_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)
DEFAULT_DB = os.path.join(INSTANCE_DIR, "laverde.db").replace("\\", "/")

app = Flask(__name__)
app.url_map.strict_slashes = False
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB}")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "la-verde-jwt-secret-dev")
app.config["SECRET_KEY"] = os.getenv("FLASK_APP_KEY", "la-verde-flask-secret-dev")

db.init_app(app)
migrate = Migrate(app, db)
JWTManager(app)

_cors_raw = os.getenv("CORS_ORIGINS", "*")
_cors_origins: list[str] | str = (
    "*" if _cors_raw.strip() == "*" else [o.strip() for o in _cors_raw.split(",") if o.strip()]
)
CORS(app, resources={r"/api/*": {"origins": _cors_origins}})

setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix="/api")


def _bootstrap_database():
    """Ensure the schema and demo catalog exist at boot.

    Render's free tier uses an ephemeral filesystem, so a SQLite database can
    be reset between cold starts. This keeps the public demo functional by
    (re)creating tables and seeding the product catalog idempotently. It never
    raises, so a transient DB issue cannot take the whole app down.
    """
    if os.getenv("DISABLE_DB_BOOTSTRAP") == "1":
        return
    try:
        from api.catalog_seed import ensure_catalog
        from api.models import Product

        with app.app_context():
            db.create_all()
            ensure_catalog(db, Product)
    except Exception as exc:  # pragma: no cover - defensive, never crash boot
        app.logger.warning("Database bootstrap skipped: %s", exc)


_bootstrap_database()


@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
