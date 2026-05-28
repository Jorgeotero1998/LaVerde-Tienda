import sys, os
sys.path.append(os.path.join(os.getcwd(), 'src'))
from app import app
from api.models import db, Product
from api.catalog_seed import ensure_catalog

with app.app_context():
    added, fixed = ensure_catalog(db, Product)
    print(f'Agregados: {added}, Reparados: {fixed}')