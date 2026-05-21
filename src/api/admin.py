import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db, User, Product, Favorite, CartItem, Order, OrderItem


def setup_admin(app):
    app.secret_key = os.environ.get("FLASK_APP_KEY", "la-verde-admin-key")
    app.config["FLASK_ADMIN_SWATCH"] = "cerulean"
    admin = Admin(app, name="La Verde Admin")
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Product, db.session))
    admin.add_view(ModelView(Favorite, db.session))
    admin.add_view(ModelView(CartItem, db.session))
    admin.add_view(ModelView(Order, db.session))
    admin.add_view(ModelView(OrderItem, db.session))
