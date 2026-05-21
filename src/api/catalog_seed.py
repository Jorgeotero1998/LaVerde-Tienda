"""
Catalogo La Verde: cada producto con image_url (Wikimedia Commons).
"""

from unicodedata import combining, normalize


def _key(value):
    text = normalize("NFKD", value or "")
    return "".join(ch for ch in text if not combining(ch)).casefold().strip()

LA_VERDE_CATALOG = [
    {
        "name": "Manzana Roja",
        "stock": 45,
        "unit": "kg",
        "category": "Frutas",
        "description": "Manzana gala, dulce y crujiente. Ideal para colaciones y ensaladas.",
        "price": 60,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/600px-Red_Apple.jpg",
    },
    {
        "name": "Banana",
        "stock": 55,
        "unit": "kg",
        "category": "Frutas",
        "description": "Banana de primera, madura y dulce.",
        "price": 35,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Banana-Fruit-2.jpg/600px-Banana-Fruit-2.jpg",
    },
    {
        "name": "Naranja Valencia",
        "stock": 40,
        "unit": "kg",
        "category": "Cítricos",
        "description": "Jugosa y rica en vitamina C. Perfecta para exprimir.",
        "price": 42,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Clementine_whole.jpg/600px-Clementine_whole.jpg",
    },
    {
        "name": "Limón",
        "stock": 35,
        "unit": "kg",
        "category": "Cítricos",
        "description": "Limon fresco, acido y aromatico para cocina y bebidas.",
        "price": 38,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lemons.jpg/600px-Lemons.jpg",
    },
    {
        "name": "Palta Hass",
        "stock": 28,
        "unit": "kg",
        "category": "Frutas",
        "description": "Palta cremosa, lista para guacamole o tostadas.",
        "price": 120,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Avocado_Hass_-_single_and_halved.jpg/600px-Avocado_Hass_-_single_and_halved.jpg",
    },
    {
        "name": "Frutilla",
        "stock": 22,
        "unit": "kg",
        "category": "Frutas",
        "description": "Frutillas rojas de estacion, dulces y aromaticas.",
        "price": 95,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Single_strawberry.jpg/600px-Single_strawberry.jpg",
    },
    {
        "name": "Uva Verde",
        "stock": 18,
        "unit": "kg",
        "category": "Frutas",
        "description": "Uvas sin semilla, crocantes y refrescantes.",
        "price": 88,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Kyoho-grape.jpg/600px-Kyoho-grape.jpg",
    },
    {
        "name": "Pera Williams",
        "stock": 26,
        "unit": "kg",
        "category": "Frutas",
        "description": "Pera jugosa de pulpa suave y dulce.",
        "price": 72,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Pears.jpg/600px-Pears.jpg",
    },
    {
        "name": "Lechuga Bola",
        "stock": 30,
        "unit": "pza",
        "category": "Verduras",
        "description": "Lechuga iceberg fresca y crocante.",
        "price": 30,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Iceberg_lettuce_in_SB.jpg/600px-Iceberg_lettuce_in_SB.jpg",
    },
    {
        "name": "Tomate Perita",
        "stock": 50,
        "unit": "kg",
        "category": "Verduras",
        "description": "Tomate maduro, ideal para salsas y ensaladas.",
        "price": 45,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/600px-Tomato_je.jpg",
    },
    {
        "name": "Zanahoria",
        "stock": 60,
        "unit": "kg",
        "category": "Verduras",
        "description": "Zanahoria naranja, firme y dulce.",
        "price": 28,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/600px-Vegetable-Carrot-Bundle-wStalks.jpg",
    },
    {
        "name": "Cebolla Blanca",
        "stock": 48,
        "unit": "kg",
        "category": "Verduras",
        "description": "Cebolla versatil para sofritos y guisos.",
        "price": 32,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Onion_on_white_background.jpg/600px-Onion_on_white_background.jpg",
    },
    {
        "name": "Papa",
        "stock": 70,
        "unit": "kg",
        "category": "Verduras",
        "description": "Papa lavada, firme para horno o pure.",
        "price": 25,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/600px-Patates.jpg",
    },
    {
        "name": "Morrón Rojo",
        "stock": 24,
        "unit": "kg",
        "category": "Verduras",
        "description": "Morron carnoso, dulce y colorido.",
        "price": 58,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Red_capsicum_and_cross_section.jpg/600px-Red_capsicum_and_cross_section.jpg",
    },
    {
        "name": "Zapallo Cabutia",
        "stock": 20,
        "unit": "kg",
        "category": "Verduras",
        "description": "Zapallo anco dulce, ideal para horno y cremas.",
        "price": 40,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/FruitingPumpkin.jpg/600px-FruitingPumpkin.jpg",
    },
    {
        "name": "Pepino",
        "stock": 32,
        "unit": "kg",
        "category": "Verduras",
        "description": "Pepino fresco para ensaladas y sandwiches.",
        "price": 36,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Cucumbers.jpg/600px-Cucumbers.jpg",
    },
    {
        "name": "Espinaca",
        "stock": 18,
        "unit": "atado",
        "category": "Verduras",
        "description": "Espinaca tierna en atado, lista para saltear.",
        "price": 34,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Spinach_leaves.JPG/600px-Spinach_leaves.JPG",
    },
    {
        "name": "Brócoli",
        "stock": 16,
        "unit": "pza",
        "category": "Verduras",
        "description": "Brocoli verde firme, rico en fibra.",
        "price": 48,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Broccoli_and_cross_section_edit.jpg/600px-Broccoli_and_cross_section_edit.jpg",
    },
    {
        "name": "Albahaca",
        "stock": 14,
        "unit": "atado",
        "category": "Hierbas",
        "description": "Albahaca fresca para pastas y pesto.",
        "price": 38,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Basil-Basilicum_photo-1.jpg/600px-Basil-Basilicum_photo-1.jpg",
    },
    {
        "name": "Perejil",
        "stock": 20,
        "unit": "atado",
        "category": "Hierbas",
        "description": "Manojo de perejil fresco y aromatico.",
        "price": 28,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Petroselinum_crispum_20101017.jpg/600px-Petroselinum_crispum_20101017.jpg",
    },
    {
        "name": "Cilantro",
        "stock": 16,
        "unit": "atado",
        "category": "Hierbas",
        "description": "Cilantro fresco para guacamole y ceviches.",
        "price": 30,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Coriander_plant.jpg/600px-Coriander_plant.jpg",
    },
    {
        "name": "Orégano Seco",
        "stock": 40,
        "unit": "pza",
        "category": "Condimentos",
        "description": "Oregano para pizzas, salsas y aderezos.",
        "price": 22,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Origanum_vulgare_-_harilik_pune.jpg/600px-Origanum_vulgare_-_harilik_pune.jpg",
    },
    {
        "name": "Ajo",
        "stock": 35,
        "unit": "kg",
        "category": "Condimentos",
        "description": "Cabezas de ajo seleccionadas, sabor intenso.",
        "price": 52,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Garlic_Thassos.jpg/600px-Garlic_Thassos.jpg",
    },
    {
        "name": "Huevo Rojo",
        "stock": 80,
        "unit": "docena",
        "category": "Pecuarios",
        "description": "Huevo de gallina fresco del dia.",
        "price": 55,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Fresh_eggs.jpg/600px-Fresh_eggs.jpg",
    },
    {
        "name": "Pechuga de Pollo",
        "stock": 12,
        "unit": "kg",
        "category": "Pecuarios",
        "description": "Pechuga sin hueso, ideal para plancha o horno.",
        "price": 249,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Chicken_breast.jpg/600px-Chicken_breast.jpg",
    },
    {
        "name": "Queso Crema",
        "stock": 25,
        "unit": "pza",
        "category": "Pecuarios",
        "description": "Queso crema untable, suave y cremoso.",
        "price": 68,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Cheese_platter.jpg/600px-Cheese_platter.jpg",
    },
    {
        "name": "Leche Entera",
        "stock": 36,
        "unit": "lt",
        "category": "Pecuarios",
        "description": "Leche entera pasteurizada 1 litro.",
        "price": 42,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Milk_glass.jpg/600px-Milk_glass.jpg",
    },
]


def ensure_catalog(db, Product):
    """Inserta productos nuevos y repara imagenes rotas o genericas."""
    added = 0
    fixed = 0
    catalog_keys = {_key(item["name"]) for item in LA_VERDE_CATALOG}
    rows_by_name = {}
    duplicate_rows = []

    for row in Product.query.order_by(Product.id).all():
        name_key = _key(row.name)
        if name_key in rows_by_name:
            duplicate_rows.append(row)
        else:
            rows_by_name[name_key] = row

    for item in LA_VERDE_CATALOG:
        row = rows_by_name.get(_key(item["name"]))
        if not row:
            db.session.add(Product(**item, is_active=True))
            added += 1
            continue
        img = (row.image_url or "").strip()
        bad = (
            not img
            or "placehold" in img.lower()
            or "unsplash" in img
            or "encrypted-tbn" in img
            or "clickabasto" in img
            or "grillhouse" in img
        )
        row.name = item["name"]
        row.category = item["category"]
        if bad:
            row.image_url = item["image_url"]
            fixed += 1
        if not row.description:
            row.description = item["description"]
        if row.stock is None or row.stock == 0:
            row.stock = item["stock"]

    for row in duplicate_rows:
        if _key(row.name) in catalog_keys:
            row.is_active = False

    db.session.commit()
    return added, fixed
