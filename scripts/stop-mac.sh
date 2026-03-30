#!/bin/bash
set -e

echo "Stopping Prelegal..."
docker stop prelegal && docker rm prelegal

echo "Prelegal stopped."
