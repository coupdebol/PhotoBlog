#!/usr/bin/env bash
# git credential helper: serves the PAT from .github_pat without it
# ever appearing as a command-line argument or in shell history.
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOKEN_FILE="$DIR/.github_pat"

if [[ "${1:-}" != "get" ]]; then
  exit 0
fi

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Missing $TOKEN_FILE — see push.sh for setup." >&2
  exit 1
fi

echo "username=x-access-token"
echo "password=$(<"$TOKEN_FILE")"
