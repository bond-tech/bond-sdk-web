#!/bin/sh
npm run build:dev
PORT=8080 serve dist
# node ./serveStatic.js
