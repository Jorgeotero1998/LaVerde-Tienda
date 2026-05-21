#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt

cd src
flask db upgrade || true
flask init-db
flask insert-test-data
