import os
from flask import redirect, url_for, request, flash
from flask_admin import Admin, AdminIndexView, expose
from flask_admin.contrib.sqla import ModelView
from api.models import db, User, Product, Favorite, CartItem, Order, OrderItem


def _is_admin():
    """Verifica si hay una sesión admin activa."""
    return request.cookies.get("admin_logged_in") == os.environ.get("FLASK_APP_KEY", "sample key")


class SecureAdminIndex(AdminIndexView):
    @expose("/")
    def index(self):
        if not _is_admin():
            return redirect(url_for("admin_login"))
        return super().index()


class SecureModelView(ModelView):
    column_display_pk = True
    column_hide_backrefs = False

    def is_accessible(self):
        return _is_admin()

    def inaccessible_callback(self, name, **kwargs):
        return redirect(url_for("admin_login"))


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

    from flask import request, make_response, render_template_string
    from api.models import User

    LOGIN_HTML = """
    <!DOCTYPE html>
    <html>
    <head>
      <title>Admin — La Verde</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    </head>
    <body class="bg-light d-flex align-items-center justify-content-center" style="min-height:100vh">
      <div class="card shadow p-4" style="width:360px">
        <h4 class="mb-3 text-center">🌿 Admin La Verde</h4>
        {% if error %}<div class="alert alert-danger">{{ error }}</div>{% endif %}
        <form method="POST">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" name="email" class="form-control" required autofocus>
          </div>
          <div class="mb-3">
            <label class="form-label">Contraseña</label>
            <input type="password" name="password" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-success w-100">Ingresar</button>
        </form>
      </div>
    </body>
    </html>
    """

    @app.route("/admin-login", methods=["GET", "POST"])
    def admin_login():
        error = None
        if request.method == "POST":
            email = request.form.get("email")
            password = request.form.get("password")
            with app.app_context():
                user = User.query.filter_by(email=email, is_admin=True).first()
            if user and user.check_password(password):
                resp = make_response(redirect("/admin/"))
                resp.set_cookie(
                    "admin_logged_in",
                    os.environ.get("FLASK_APP_KEY", "sample key"),
                    httponly=True,
                    samesite="Lax",
                )
                return resp
            error = "Email o contraseña incorrectos, o no tenés permisos de admin."
        return render_template_string(LOGIN_HTML, error=error)

    @app.route("/admin-logout")
    def admin_logout():
        resp = make_response(redirect(url_for("admin_login")))
        resp.delete_cookie("admin_logged_in")
        return resp

    admin = Admin(app, name="La Verde Admin", index_view=SecureAdminIndex())
    admin.add_view(ProductView(Product, db.session))
    admin.add_view(UserView(User, db.session))
    admin.add_view(OrderView(Order, db.session))
    admin.add_view(SecureModelView(OrderItem, db.session))
    admin.add_view(SecureModelView(Favorite, db.session))
    admin.add_view(SecureModelView(CartItem, db.session))