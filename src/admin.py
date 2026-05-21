import os
from flask_admin import Admin
from api.models import db, Cliente, Product, Categoria, Proveedor, Order, OrderLine, OrderStatus
from flask_admin.contrib.sqla import ModelView

class CustomView(ModelView):
    column_display_pk = True
    column_hide_backrefs = False

class ProductView(ModelView):
    column_list = ('id', 'nombre', 'precio', 'stock', 'categoria', 'proveedor')
    column_filters = ('categoria.nombre', 'proveedor.nombre', 'precio')
    column_searchable_list = ('nombre',)
    column_editable_list = ('precio', 'stock')

class OrderView(ModelView):
    column_list = ('id', 'cliente', 'fecha', 'total_amount', 'status')
    column_default_sort = ('fecha', True)

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Tienda Admin', template_mode='bootstrap3')

    admin.add_view(ProductView(Product, db.session))
    admin.add_view(CustomView(Categoria, db.session))
    admin.add_view(CustomView(Proveedor, db.session))
    admin.add_view(CustomView(Cliente, db.session))
    admin.add_view(OrderView(Order, db.session))
    admin.add_view(CustomView(OrderLine, db.session))
    admin.add_view(CustomView(OrderStatus, db.session))
