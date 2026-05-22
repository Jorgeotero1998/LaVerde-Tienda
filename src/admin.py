import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from api.models import db, User, Product, Favorite, CartItem, Order, OrderItem


class SecureModelView(ModelView):
    """Vista base — en producción podrías agregar autenticación aquí."""
    column_display_pk = True
    column_hide_backrefs = False


class UserView(SecureModelView):
    column_list = ("id", "first_name", "last_name", "email", "is_active", "is_admin", "created_at")
    column_searchable_list = ("email", "first_name", "last_name")
    column_filters = ("is_active", "is_admin")
    form_excluded_columns = ("password", "favorites", "cart_items", "orders")


class ProductView(SecureModelView):
    column_list = ("id", "name", "category", "price", "stock", "unit", "is_active")
    column_filters = ("category", "is_active")
    column_searchable_list = ("name",)
    column_editable_list = ("price", "stock", "is_active")


class OrderView(SecureModelView):
    column_list = ("id", "user_id", "total", "status", "created_at")
    column_default_sort = ("created_at", True)
    column_filters = ("status",)


def setup_admin(app):
    app.secret_key = os.environ.get("FLASK_APP_KEY", "sample key")
    app.config["FLASK_ADMIN_SWATCH"] = "cerulean"
    admin = Admin(app, name="La Verde Admin", template_mode="bootstrap3")

    admin.add_view(ProductView(Product, db.session))
    admin.add_view(UserView(User, db.session))
    admin.add_view(OrderView(Order, db.session))
    admin.add_view(SecureModelView(OrderItem, db.session))
    admin.add_view(SecureModelView(Favorite, db.session))
    admin.add_view(SecureModelView(CartItem, db.session))
