"""
LaVerde Tienda — Test Suite
============================
Cómo correr:
    pip install pytest pytest-cov
    pytest test_api.py -v
    pytest test_api.py -v --cov=api --cov-report=term-missing
"""

import pytest
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# ── Importamos los módulos reales del proyecto ────────────────────────────────
from api.models import db, User, Product, CartItem, Favorite, Order
from api.routes import api as api_blueprint


# ── App de testing (SQLite en memoria, nunca toca producción) ─────────────────
@pytest.fixture(scope="function")
def app():
    app = Flask(__name__)
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "test-secret-key"
    app.url_map.strict_slashes = False

    db.init_app(app)
    JWTManager(app)
    CORS(app)
    app.register_blueprint(api_blueprint, url_prefix="/api")

    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


# ── Helpers ───────────────────────────────────────────────────────────────────
def register_and_login(client, email="test@test.com", password="Test1234"):
    """Registra un usuario y devuelve su JWT token."""
    client.post("/api/signup", json={
        "firstName": "Test",
        "lastName": "User",
        "email": email,
        "password": password,
    })
    res = client.post("/api/login", json={"email": email, "password": password})
    return res.get_json()["token"]


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def create_product(app, name="Manzana", price=100.0, stock=50):
    """Crea un producto directamente en la DB para usar en tests."""
    with app.app_context():
        p = Product(name=name, price=price, stock=stock, is_active=True)
        db.session.add(p)
        db.session.commit()
        return p.id


# ═══════════════════════════════════════════════════════════════════════════════
# 1. HEALTH
# ═══════════════════════════════════════════════════════════════════════════════

class TestHealth:
    def test_index_returns_200(self, client):
        res = client.get("/api/")
        assert res.status_code == 200
        data = res.get_json()
        assert "proyecto" in data

    def test_hello_returns_200(self, client):
        res = client.get("/api/hello")
        assert res.status_code == 200
        assert res.get_json()["message"] == "Backend conectado correctamente"


# ═══════════════════════════════════════════════════════════════════════════════
# 2. AUTH — SIGNUP
# ═══════════════════════════════════════════════════════════════════════════════

class TestSignup:
    def test_signup_exitoso(self, client):
        res = client.post("/api/signup", json={
            "firstName": "Jorge",
            "lastName": "Otero",
            "email": "jorge@test.com",
            "password": "password123",
        })
        assert res.status_code == 201
        assert "Cuenta creada" in res.get_json()["message"]

    def test_signup_email_duplicado(self, client):
        data = {"firstName": "A", "email": "dup@test.com", "password": "pass123"}
        client.post("/api/signup", json=data)
        res = client.post("/api/signup", json=data)
        assert res.status_code == 409

    def test_signup_sin_email(self, client):
        res = client.post("/api/signup", json={"password": "pass123"})
        assert res.status_code == 400

    def test_signup_sin_password(self, client):
        res = client.post("/api/signup", json={"email": "a@test.com"})
        assert res.status_code == 400


# ═══════════════════════════════════════════════════════════════════════════════
# 3. AUTH — LOGIN
# ═══════════════════════════════════════════════════════════════════════════════

class TestLogin:
    def test_login_exitoso_devuelve_token(self, client):
        client.post("/api/signup", json={
            "firstName": "Jorge", "email": "j@test.com", "password": "pass123"
        })
        res = client.post("/api/login", json={"email": "j@test.com", "password": "pass123"})
        assert res.status_code == 200
        data = res.get_json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == "j@test.com"

    def test_login_password_incorrecta(self, client):
        client.post("/api/signup", json={
            "firstName": "Jorge", "email": "j@test.com", "password": "correcta"
        })
        res = client.post("/api/login", json={"email": "j@test.com", "password": "incorrecta"})
        assert res.status_code == 401

    def test_login_email_inexistente(self, client):
        res = client.post("/api/login", json={"email": "noexiste@test.com", "password": "pass"})
        assert res.status_code == 401

    def test_login_sin_body(self, client):
        res = client.post("/api/login", json={})
        assert res.status_code == 400


# ═══════════════════════════════════════════════════════════════════════════════
# 4. PERFIL (/me)
# ═══════════════════════════════════════════════════════════════════════════════

class TestPerfil:
    def test_get_perfil_autenticado(self, client):
        token = register_and_login(client, "me@test.com")
        res = client.get("/api/me", headers=auth_headers(token))
        assert res.status_code == 200
        assert res.get_json()["email"] == "me@test.com"

    def test_get_perfil_sin_token(self, client):
        res = client.get("/api/me")
        assert res.status_code == 401

    def test_update_perfil(self, client):
        token = register_and_login(client, "upd@test.com")
        res = client.put("/api/me", headers=auth_headers(token),
                         json={"firstName": "NuevoNombre"})
        assert res.status_code == 200
        assert res.get_json()["firstName"] == "NuevoNombre"


# ═══════════════════════════════════════════════════════════════════════════════
# 5. PRODUCTOS
# ═══════════════════════════════════════════════════════════════════════════════

class TestProductos:
    def test_get_products_lista_vacia(self, client):
        res = client.get("/api/products")
        assert res.status_code == 200
        assert res.get_json() == []

    def test_get_products_devuelve_productos(self, client, app):
        create_product(app, name="Tomate", price=80.0)
        res = client.get("/api/products")
        assert res.status_code == 200
        data = res.get_json()
        assert len(data) == 1
        assert data[0]["name"] == "Tomate"

    def test_get_product_por_id(self, client, app):
        pid = create_product(app, name="Lechuga", price=60.0)
        res = client.get(f"/api/products/{pid}")
        assert res.status_code == 200
        assert res.get_json()["name"] == "Lechuga"

    def test_get_product_inexistente(self, client):
        res = client.get("/api/products/9999")
        assert res.status_code == 404

    def test_get_products_filtrar_por_categoria(self, client, app):
        with app.app_context():
            db.session.add(Product(name="Manzana", price=100, stock=10,
                                   is_active=True, category="frutas"))
            db.session.add(Product(name="Zanahoria", price=50, stock=20,
                                   is_active=True, category="verduras"))
            db.session.commit()
        res = client.get("/api/products?category=frutas")
        assert res.status_code == 200
        data = res.get_json()
        assert len(data) == 1
        assert data[0]["name"] == "Manzana"

    def test_producto_inactivo_no_aparece(self, client, app):
        with app.app_context():
            p = Product(name="Oculto", price=10, stock=5, is_active=False)
            db.session.add(p)
            db.session.commit()
        res = client.get("/api/products")
        assert res.status_code == 200
        assert all(p["name"] != "Oculto" for p in res.get_json())


# ═══════════════════════════════════════════════════════════════════════════════
# 6. CARRITO
# ═══════════════════════════════════════════════════════════════════════════════

class TestCarrito:
    def test_get_cart_sin_token_devuelve_401(self, client):
        res = client.get("/api/cart")
        assert res.status_code == 401

    def test_get_cart_vacio(self, client):
        token = register_and_login(client, "cart@test.com")
        res = client.get("/api/cart", headers=auth_headers(token))
        assert res.status_code == 200
        assert res.get_json() == []

    def test_agregar_producto_al_carrito(self, client, app):
        pid = create_product(app, name="Pera", price=90.0)
        token = register_and_login(client, "cart2@test.com")
        res = client.post("/api/cart", headers=auth_headers(token),
                          json={"product_id": pid, "quantity": 2})
        assert res.status_code == 201
        data = res.get_json()
        assert data["quantity"] == 2
        assert data["product_id"] == pid

    def test_agregar_mismo_producto_suma_cantidad(self, client, app):
        pid = create_product(app, name="Uva", price=150.0)
        token = register_and_login(client, "cart3@test.com")
        headers = auth_headers(token)
        client.post("/api/cart", headers=headers, json={"product_id": pid, "quantity": 1})
        res = client.post("/api/cart", headers=headers, json={"product_id": pid, "quantity": 3})
        assert res.status_code == 200
        assert res.get_json()["quantity"] == 4

    def test_eliminar_item_del_carrito(self, client, app):
        pid = create_product(app, name="Kiwi", price=200.0)
        token = register_and_login(client, "cart4@test.com")
        headers = auth_headers(token)
        client.post("/api/cart", headers=headers, json={"product_id": pid, "quantity": 1})
        res = client.delete(f"/api/cart/{pid}", headers=headers)
        assert res.status_code == 200
        cart = client.get("/api/cart", headers=headers).get_json()
        assert cart == []

    def test_vaciar_carrito(self, client, app):
        pid = create_product(app, name="Naranja", price=70.0)
        token = register_and_login(client, "cart5@test.com")
        headers = auth_headers(token)
        client.post("/api/cart", headers=headers, json={"product_id": pid, "quantity": 2})
        res = client.delete("/api/cart", headers=headers)
        assert res.status_code == 200
        assert client.get("/api/cart", headers=headers).get_json() == []

    def test_actualizar_cantidad_carrito(self, client, app):
        pid = create_product(app, name="Banana", price=50.0)
        token = register_and_login(client, "cart6@test.com")
        headers = auth_headers(token)
        client.post("/api/cart", headers=headers, json={"product_id": pid, "quantity": 1})
        res = client.put(f"/api/cart/{pid}", headers=headers, json={"quantity": 5})
        assert res.status_code == 200
        assert res.get_json()["quantity"] == 5

    def test_cart_producto_inexistente(self, client):
        token = register_and_login(client, "cart7@test.com")
        res = client.post("/api/cart", headers=auth_headers(token),
                          json={"product_id": 9999})
        assert res.status_code == 404


# ═══════════════════════════════════════════════════════════════════════════════
# 7. FAVORITOS
# ═══════════════════════════════════════════════════════════════════════════════

class TestFavoritos:
    def test_get_favoritos_sin_token(self, client):
        res = client.get("/api/favorites")
        assert res.status_code == 401

    def test_get_favoritos_vacio(self, client):
        token = register_and_login(client, "fav@test.com")
        res = client.get("/api/favorites", headers=auth_headers(token))
        assert res.status_code == 200
        assert res.get_json() == []

    def test_agregar_favorito(self, client, app):
        pid = create_product(app, name="Frutilla", price=300.0)
        token = register_and_login(client, "fav2@test.com")
        res = client.post("/api/favorites", headers=auth_headers(token),
                          json={"product_id": pid})
        assert res.status_code == 201
        assert res.get_json()["product_id"] == pid

    def test_favorito_duplicado(self, client, app):
        pid = create_product(app, name="Melón", price=250.0)
        token = register_and_login(client, "fav3@test.com")
        headers = auth_headers(token)
        client.post("/api/favorites", headers=headers, json={"product_id": pid})
        res = client.post("/api/favorites", headers=headers, json={"product_id": pid})
        assert res.status_code == 409

    def test_eliminar_favorito(self, client, app):
        pid = create_product(app, name="Mandarina", price=120.0)
        token = register_and_login(client, "fav4@test.com")
        headers = auth_headers(token)
        client.post("/api/favorites", headers=headers, json={"product_id": pid})
        res = client.delete(f"/api/favorites/{pid}", headers=headers)
        assert res.status_code == 200
        assert client.get("/api/favorites", headers=headers).get_json() == []


# ═══════════════════════════════════════════════════════════════════════════════
# 8. ÓRDENES
# ═══════════════════════════════════════════════════════════════════════════════

class TestOrdenes:
    def test_get_orders_sin_token(self, client):
        res = client.get("/api/orders")
        assert res.status_code == 401

    def test_get_orders_vacio(self, client):
        token = register_and_login(client, "ord@test.com")
        res = client.get("/api/orders", headers=auth_headers(token))
        assert res.status_code == 200
        assert res.get_json() == []

    def test_crear_orden_desde_carrito(self, client, app):
        pid = create_product(app, name="Papa", price=40.0, stock=100)
        token = register_and_login(client, "ord2@test.com")
        headers = auth_headers(token)
        # Agregar al carrito
        client.post("/api/cart", headers=headers,
                    json={"product_id": pid, "quantity": 3})
        # Confirmar orden
        res = client.post("/api/orders", headers=headers)
        assert res.status_code == 201
        data = res.get_json()
        assert data["status"] == "confirmed"
        assert data["total"] == 120.0  # 3 × 40
        assert len(data["items"]) == 1

    def test_crear_orden_vacia_el_carrito(self, client, app):
        pid = create_product(app, name="Cebolla", price=30.0, stock=100)
        token = register_and_login(client, "ord3@test.com")
        headers = auth_headers(token)
        client.post("/api/cart", headers=headers, json={"product_id": pid, "quantity": 1})
        client.post("/api/orders", headers=headers)
        cart = client.get("/api/cart", headers=headers).get_json()
        assert cart == []

    def test_crear_orden_carrito_vacio(self, client):
        token = register_and_login(client, "ord4@test.com")
        res = client.post("/api/orders", headers=auth_headers(token))
        assert res.status_code == 400

    def test_orden_aparece_en_historial(self, client, app):
        pid = create_product(app, name="Ajo", price=200.0, stock=50)
        token = register_and_login(client, "ord5@test.com")
        headers = auth_headers(token)
        client.post("/api/cart", headers=headers, json={"product_id": pid, "quantity": 1})
        client.post("/api/orders", headers=headers)
        orders = client.get("/api/orders", headers=headers).get_json()
        assert len(orders) == 1
        assert orders[0]["total"] == 200.0


# ═══════════════════════════════════════════════════════════════════════════════
# 9. FORGOT PASSWORD
# ═══════════════════════════════════════════════════════════════════════════════

class TestForgotPassword:
    def test_email_registrado(self, client):
        client.post("/api/signup", json={
            "firstName": "A", "email": "fp@test.com", "password": "pass"
        })
        res = client.post("/api/forgot-password", json={"email": "fp@test.com"})
        assert res.status_code == 200

    def test_email_no_registrado(self, client):
        res = client.post("/api/forgot-password", json={"email": "noexiste@test.com"})
        assert res.status_code == 404

    def test_sin_email(self, client):
        res = client.post("/api/forgot-password", json={})
        assert res.status_code == 400


# ═══════════════════════════════════════════════════════════════════════════════
# 10. AISLAMIENTO — cada usuario solo ve sus propios datos
# ═══════════════════════════════════════════════════════════════════════════════

class TestAislamiento:
    def test_usuario_no_ve_carrito_ajeno(self, client, app):
        pid = create_product(app, name="Ciruela", price=180.0)
        token_a = register_and_login(client, "a@test.com")
        token_b = register_and_login(client, "b@test.com")
        # Usuario A agrega al carrito
        client.post("/api/cart", headers=auth_headers(token_a),
                    json={"product_id": pid, "quantity": 2})
        # Usuario B tiene carrito vacío
        cart_b = client.get("/api/cart", headers=auth_headers(token_b)).get_json()
        assert cart_b == []

    def test_usuario_no_ve_favoritos_ajenos(self, client, app):
        pid = create_product(app, name="Durazno", price=220.0)
        token_a = register_and_login(client, "fa@test.com")
        token_b = register_and_login(client, "fb@test.com")
        client.post("/api/favorites", headers=auth_headers(token_a),
                    json={"product_id": pid})
        favs_b = client.get("/api/favorites", headers=auth_headers(token_b)).get_json()
        assert favs_b == []

    def test_usuario_no_ve_ordenes_ajenas(self, client, app):
        pid = create_product(app, name="Palta", price=350.0)
        token_a = register_and_login(client, "oa@test.com")
        token_b = register_and_login(client, "ob@test.com")
        client.post("/api/cart", headers=auth_headers(token_a),
                    json={"product_id": pid, "quantity": 1})
        client.post("/api/orders", headers=auth_headers(token_a))
        orders_b = client.get("/api/orders", headers=auth_headers(token_b)).get_json()
        assert orders_b == []
