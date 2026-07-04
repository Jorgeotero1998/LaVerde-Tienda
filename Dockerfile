FROM python:3.13-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN python -m pip install --upgrade pip && pip install -r requirements.txt

COPY src ./src
COPY wsgi.py ./wsgi.py

EXPOSE 3001

CMD ["sh", "-c", "python -c \"from src.app import app; from api.models import db; ctx=app.app_context(); ctx.push(); db.create_all()\" && gunicorn \"src.app:app\" --bind 0.0.0.0:3001 --workers 2 --timeout 120"]

