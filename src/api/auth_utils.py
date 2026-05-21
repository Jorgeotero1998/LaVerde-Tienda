from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import User


def admin_required(fn):
    """JWT + rol administrador."""

    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user or not user.is_admin:
            return jsonify({
                "error": "Acceso denegado. Se requiere rol administrador.",
            }), 403
        return fn(*args, **kwargs)

    return wrapper
