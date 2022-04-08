#!/bin/sh
wait-on http://${CLIENT_HOST:-client}:${CLIENT_PORT:-8080}/index.html \
    && npx cypress run --headless --browser chrome --record
