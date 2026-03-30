#!/bin/bash
set -e

cd "$(dirname "$0")/.."

echo "Building Prelegal Docker image..."
docker build -t prelegal .

echo "Starting Prelegal..."
docker rm -f prelegal 2>/dev/null || true
docker run -d -p 8000:8000 --env-file .env --name prelegal prelegal

echo "Prelegal is running at http://localhost:8000"
