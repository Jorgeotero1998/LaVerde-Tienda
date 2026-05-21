import os
from functools import wraps

import cloudinary
import cloudinary.uploader
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from api.models import db, User, Product, Favorite, CartItem, Order, OrderItem
from api.auth_utils import admin_required

api = Blueprint("api", __name__)

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


def cloudinary_ready():
    return bool(
        os.getenv("CLOUDINARY_CLOUD_NAME")
        and os.getenv("CLOUDINARY_API_KEY")
        and os.getenv("CLOUDINARY_API_SECRET")
    )


def _upload_to_cloudinary(file):
    return cloudinary.uploader.upload(
        file,
        folder="la-verde/products",
        resource_type="image",
    )


# --- HEALTH --------------------------------------------------------------------

@api.route("/hello", methods=["GET"])
def hello():
    return jsonify({"message": "Backend conectado correctamente"}), 200


def send_welcome_email(email):
    return requests.post(
        f"https://api.mailgun.net/v3/{os.getenv('MAILGUN_DOMAIN')}/messages",
        auth=("api", os.getenv("MAILGUN_API_KEY")),
        data={"from": f"Tienda AI <mailgun@{os.getenv('MAILGUN_DOMAIN')}>",
              "to": [email],
              "subject": "Bienvenido a nuestra tienda",
              "text": "Gracias por registrarte en nuestra plataforma."})


@api.route('/signup', methods=['POST'])
def git_signup():
    body = request.get_json()
    if not body or not body.get("email") or not body.get("password"):
        return jsonify({"error": "Email y contraseña son requeridos"}), 400
    if User.query.filter_by(email=body["email"]).first():
        return jsonify({"error": "Ya existe una cuenta con ese email"}), 409
    user = User(
        first_name=body.get("firstName", ""),
        last_name=body.get("lastName", ""),
        email=body["email"],
        is_active=True,
        is_admin=False,
    )
    user.set_password(body["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Cuenta creada con éxito"}), 201


@api.route("/forgot-password", methods=["POST"])
def forgot_password():
    body = request.get_json()
    if not body or not body.get("email"):
        return jsonify({"error": "El email es requerido"}), 400
    user = User.query.filter_by(email=body["email"]).first()
    if not user:
        return jsonify({"error": "No encontramos una cuenta con ese email."}), 404
    return jsonify({
        "message": "Si el email está registrado, recibirás instrucciones para restablecer tu contraseña.",
    }), 200


@api.route("/login", methods=["POST"])
def login():
    body = request.get_json()
    if not body or not body.get("email") or not body.get("password"):
        return jsonify({"error": "Email y contraseña son requeridos"}), 400
    user = User.query.filter_by(email=body["email"]).first()
    if not user or not user.check_password(body["password"]):
        return jsonify({"error": "Email o contraseña incorrectos"}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200


# --- USUARIO -------------------------------------------------------------------

@api.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


@api.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({"error": "Usuario no encontrado"}), 404
    body = request.get_json()
    if body.get("firstName"):
        user.first_name = body["firstName"]
    if body.get("lastName"):
        user.last_name = body["lastName"]
    if body.get("email"):
        user.email = body["email"]
    if body.get("password"):
        user.set_password(body["password"])
    db.session.commit()
    return jsonify(user.serialize()), 200


# --- CLOUDINARY (admin) --------------------------------------------------------

@api.route("/upload/image", methods=["POST"])
@admin_required
def upload_image():
    if not cloudinary_ready():
        return jsonify({
            "error": "Cloudinary no está configurado. Agregá las variables en .env o usá URL de imagen.",
        }), 503
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400
    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "Archivo inválido"}), 400
    try:
        result = _upload_to_cloudinary(file)
        return jsonify({"image_url": result["secure_url"]}), 200
    except Exception as exc:
        return jsonify({"error": f"Error al subir imagen: {exc}"}), 500


# --- PRODUCTOS -----------------------------------------------------------------

@api.route("/products", methods=["GET"])
def get_products():
    category = request.args.get("category")
    query = Product.query.filter_by(is_active=True)
    if category:
        query = query.filter_by(category=category)
    products = query.all()
    return jsonify([p.serialize() for p in products]), 200


@api.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return jsonify({"error": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200


@api.route("/products", methods=["POST"])
@admin_required
def create_product():
    body = request.get_json()
    if not body or not body.get("name") or not body.get("price"):
        return jsonify({"error": "Nombre y precio son requeridos"}), 400
    product = Product(
        name=body["name"],
        description=body.get("description", ""),
        price=float(body["price"]),
        stock=int(body.get("stock", 0)),
        unit=body.get("unit", "pza"),
        category=body.get("category", ""),
        image_url=body.get("image_url", ""),
        is_active=True,
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.serialize()), 201


@api.route("/products/<int:product_id>", methods=["PUT"])
@admin_required
def update_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    body = request.get_json()
    if body.get("name"):
        product.name = body["name"]
    if body.get("description") is not None:
        product.description = body["description"]
    if body.get("price"):
        product.price = float(body["price"])
    if body.get("stock") is not None:
        product.stock = int(body["stock"])
    if body.get("unit"):
        product.unit = body["unit"]
    if body.get("category"):
        product.category = body["category"]
    if body.get("image_url"):
        product.image_url = body["image_url"]
    db.session.commit()
    return jsonify(product.serialize()), 200


@api.route("/products/<int:product_id>", methods=["DELETE"])
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    product.is_active = False
    db.session.commit()
    return jsonify({"message": "Producto eliminado"}), 200


@api.route("/products/<int:product_id>/image", methods=["POST"])
@admin_required
def upload_product_image(product_id):
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    if not cloudinary_ready():
        return jsonify({"error": "Cloudinary no configurado"}), 503
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400
    file = request.files["file"]
    try:
        result = _upload_to_cloudinary(file)
        product.image_url = result["secure_url"]
        db.session.commit()
        return jsonify(product.serialize()), 200
    except Exception as exc:
        return jsonify({"error": f"Error al subir imagen: {exc}"}), 500


# --- FAVORITOS -----------------------------------------------------------------

@api.route("/favorites", methods=["GET"])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    favs = Favorite.query.filter_by(user_id=int(user_id)).all()
    return jsonify([f.serialize() for f in favs]), 200


@api.route("/favorites", methods=["POST"])
@jwt_required()
def add_favorite():
    user_id = get_jwt_identity()
    body = request.get_json()
    if not body or not body.get("product_id"):
        return jsonify({"error": "product_id es requerido"}), 400
    existing = Favorite.query.filter_by(
        user_id=int(user_id), product_id=body["product_id"]
    ).first()
    if existing:
        return jsonify({"error": "Ya está en favoritos"}), 409
    fav = Favorite(user_id=int(user_id), product_id=body["product_id"])
    db.session.add(fav)
    db.session.commit()
    return jsonify(fav.serialize()), 201


@api.route("/favorites/<int:product_id>", methods=["DELETE"])
@jwt_required()
def delete_favorite(product_id):
    user_id = get_jwt_identity()
    fav = Favorite.query.filter_by(
        user_id=int(user_id), product_id=product_id
    ).first()
    if not fav:
        return jsonify({"error": "Favorito no encontrado"}), 404
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"message": "Favorito eliminado"}), 200


# --- CARRITO -------------------------------------------------------------------

@api.route("/cart", methods=["GET"])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    items = CartItem.query.filter_by(user_id=int(user_id)).all()
    return jsonify([item.serialize() for item in items]), 200


@api.route("/cart", methods=["POST"])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    body = request.get_json()
    if not body or not body.get("product_id"):
        return jsonify({"error": "product_id es requerido"}), 400
    product = Product.query.get(body["product_id"])
    if not product:
        return jsonify({"error": "Producto no encontrado"}), 404
    quantity = int(body.get("quantity", 1))
    existing = CartItem.query.filter_by(
        user_id=int(user_id), product_id=body["product_id"]
    ).first()
    if existing:
        existing.quantity += quantity
        db.session.commit()
        return jsonify(existing.serialize()), 200
    item = CartItem(
        user_id=int(user_id),
        product_id=body["product_id"],
        quantity=quantity,
    )
    db.session.add(item)
    db.session.commit()
    return jsonify(item.serialize()), 201


@api.route("/cart/<int:product_id>", methods=["PUT"])
@jwt_required()
def update_cart_item(product_id):
    user_id = get_jwt_identity()
    body = request.get_json()
    item = CartItem.query.filter_by(
        user_id=int(user_id), product_id=product_id
    ).first()
    if not item:
        return jsonify({"error": "Item no encontrado en el carrito"}), 404
    quantity = int(body.get("quantity", 1))
    if quantity <= 0:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item eliminado del carrito"}), 200
    item.quantity = quantity
    db.session.commit()
    return jsonify(item.serialize()), 200


@api.route("/cart/<int:product_id>", methods=["DELETE"])
@jwt_required()
def remove_from_cart(product_id):
    user_id = get_jwt_identity()
    item = CartItem.query.filter_by(
        user_id=int(user_id), product_id=product_id
    ).first()
    if not item:
        return jsonify({"error": "Item no encontrado en el carrito"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item eliminado del carrito"}), 200


@api.route("/cart", methods=["DELETE"])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    CartItem.query.filter_by(user_id=int(user_id)).delete()
    db.session.commit()
    return jsonify({"message": "Carrito vaciado"}), 200


# --- ÓRDENES -------------------------------------------------------------------

@api.route("/orders", methods=["GET"])
@jwt_required()
def get_orders():
    user_id = get_jwt_identity()
    orders = (
        Order.query.filter_by(user_id=int(user_id))
        .order_by(Order.created_at.desc())
        .all()
    )
    return jsonify([o.serialize() for o in orders]), 200


@api.route("/orders", methods=["POST"])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    cart_items = CartItem.query.filter_by(user_id=int(user_id)).all()
    if not cart_items:
        return jsonify({"error": "El carrito está vacío"}), 400
    total = sum(item.product.price * item.quantity for item in cart_items)
    order = Order(user_id=int(user_id), total=total, status="confirmed")
    db.session.add(order)
    db.session.flush()
    for item in cart_items:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            unit_price=item.product.price,
        )
        db.session.add(order_item)
    CartItem.query.filter_by(user_id=int(user_id)).delete()
    db.session.commit()
    return jsonify(order.serialize()), 201
