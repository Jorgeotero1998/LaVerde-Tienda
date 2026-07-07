import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from sqlalchemy import text
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from api.bootstrap import normalize_database_url, safe_bootstrap

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INSTANCE_DIR = os.path.join(ROOT_DIR, "instance")
os.makedirs(INSTANCE_DIR, exist_ok=True)
DEFAULT_DB = os.path.join(INSTANCE_DIR, "laverde.db").replace("\\", "/")

app = Flask(__name__)
app.url_map.strict_slashes = False
_db_url = normalize_database_url(os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB}"))
app.config["SQLALCHEMY_DATABASE_URI"] = _db_url
_engine_opts: dict = {"pool_pre_ping": True, "pool_recycle": 280}
if _db_url.startswith("postgresql"):
    _engine_opts["connect_args"] = {"sslmode": "require"}
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = _engine_opts
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "la-verde-jwt-secret-dev")
app.config["SECRET_KEY"] = os.getenv("FLASK_APP_KEY", "la-verde-flask-secret-dev")

db.init_app(app)
migrate = Migrate(app, db)
JWTManager(app)

_default_cors = "https://laverde-frontend.onrender.com,http://localhost:3000,http://127.0.0.1:3000"
_cors_raw = os.getenv("CORS_ORIGINS", _default_cors)
_cors_origins: list[str] | str = (
    "*" if _cors_raw.strip() == "*" else [o.strip() for o in _cors_raw.split(",") if o.strip()]
)
CORS(
    app,
    resources={r"/api/*": {"origins": _cors_origins}},
    supports_credentials=True,
)

setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix="/api")


def _bootstrap_database():
    """Ensure schema, demo users, and catalog exist at boot (Render-safe)."""
    if os.getenv("DISABLE_DB_BOOTSTRAP") == "1":
        return
    safe_bootstrap(app, db)


_bootstrap_database()


@app.route("/health")
@app.route("/api/health")
def health():
    db_ok = True
    try:
        db.session.execute(text("SELECT 1"))
    except Exception:
        db_ok = False
    status = "ok" if db_ok else "degraded"
    code = 200 if db_ok else 503
    return jsonify({"status": status, "database": "connected" if db_ok else "unavailable"}), code


if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)
