#!/bin/sh
# wait-on http://${CLIENT_HOST:-client}:${CLIENT_PORT:-8080}/index.html \
wait-on ${CYPRESS_BASE_URL} \
        --log \
        --interval 1000 \
        --delay 30 \
        --timeout 300
    && npx cypress run --headless --browser chrome --record
