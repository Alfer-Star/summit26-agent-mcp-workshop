#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
SERVER_PID=""
CLIENT_PID=""

cleanup() {
  echo ""
  echo "Stopping services..."
  [ -n "$CLIENT_PID" ] && kill "$CLIENT_PID" 2>/dev/null && echo "  Angular client stopped"
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null && echo "  Express server stopped"
  exit 0
}

trap cleanup INT TERM

echo "=== Installing dependencies ==="
echo "  Server..."
(cd "$ROOT/sn-webshop-server" && npm install --silent)
echo "  Client..."
(cd "$ROOT/sn-webshop-client" && npm install --silent)

echo ""
echo "=== Starting services ==="

(cd "$ROOT/sn-webshop-server" && npm run server:start) &
SERVER_PID=$!
echo "  Express server started (PID $SERVER_PID) -> http://localhost:3000"

(cd "$ROOT/sn-webshop-client" && npm run client:start) &
CLIENT_PID=$!
echo "  Angular client started (PID $CLIENT_PID) -> http://localhost:4200"

echo ""
echo "Shop is running. Press Ctrl+C to stop."
echo ""

wait
