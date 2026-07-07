import click
from api.bootstrap import bootstrap_database
from api.catalog_seed import LA_VERDE_CATALOG
from api.models import db, Product


def setup_commands(app):
    @app.cli.command("init-db")
    def init_db():
        """Crea todas las tablas según los modelos actuales."""
        bootstrap_database(app, db)
        click.echo("Base de datos inicializada con catálogo y usuarios demo.")

    @app.cli.command("insert-test-data")
    @click.argument("count", default=0, required=False)
    def insert_test_data(count):
        """Sincroniza catálogo La Verde + usuarios demo (admin/cliente)."""
        bootstrap_database(app, db)
        click.echo(
            f"Bootstrap listo: {len(LA_VERDE_CATALOG)} productos, "
            "admin@laverde.com / admin1234, demo@laverde.com / Demo1234!"
        )

    @app.cli.command("reset-catalog")
    @click.confirmation_option(prompt="¿Borrar TODOS los productos y recargar catálogo?")
    def reset_catalog():
        """Borra productos y vuelve a cargar el catálogo completo."""
        Product.query.delete()
        db.session.commit()
        for item in LA_VERDE_CATALOG:
            db.session.add(Product(**item, is_active=True))
        db.session.commit()
        click.echo(f"Se cargaron {len(LA_VERDE_CATALOG)} productos con imagen.")
