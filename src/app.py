import os
import click
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
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
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
    "DATABASE_URL", f"sqlite:///{DEFAULT_DB}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "la-verde-jwt-secret-dev")

db.init_app(app)
JWTManager(app)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
CORS(app, origins=[FRONTEND_URL])

setup_admin(app)
setup_commands(app)
app.register_blueprint(api, url_prefix="/api")

@app.cli.command("db")
@click.argument("args", nargs=-1)
def fake_db(args):
    db.create_all()

if __name__ == "__main__":
    PORT = int(os.environ.get("PORT", 3001))
    app.run(host="0.0.0.0", port=PORT, debug=True)