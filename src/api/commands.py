import click
from api.models import db, Product
from api.catalog_seed import ensure_catalog, LA_VERDE_CATALOG


def setup_commands(app):
    @app.cli.command("init-db")
    def init_db():
        """Crea todas las tablas según los modelos actuales."""
        db.create_all()
        click.echo("Base de datos inicializada.")

    @app.cli.command("insert-test-data")
    @click.argument("count", default=0, required=False)
    def insert_test_data(count):
        """Sincroniza catálogo La Verde (productos + imágenes)."""
        added, fixed = ensure_catalog(db, Product)
        click.echo(
            f"Catálogo listo: {len(LA_VERDE_CATALOG)} referencias, "
            f"+{added} nuevos, {fixed} imágenes reparadas."
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
