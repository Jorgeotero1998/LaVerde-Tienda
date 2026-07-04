import os
import sys

sys.path.append(os.path.join(os.getcwd(), "src"))
from app import app
from api.catalog_seed import ensure_catalog
from api.models import Product, db

with app.app_context():
    added, fixed = ensure_catalog(db, Product)
    print(f"Agregados: {added}, Reparados: {fixed}")
