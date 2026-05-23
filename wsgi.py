import click
from src.app import app
from api.models import db

@app.cli.command("db")
@click.argument("args", nargs=-1)
def fake_db(args):
    with app.app_context():
        db.create_all()

if __name__ == "__main__":
    app.run()