#!/usr/bin/env bash
# Push the current branch to origin using the PAT stored in .github_pat.
# Usage: ./push.sh [branch]   (defaults to the current branch)
set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

node scripts/check-drafts.mjs

BRANCH="${1:-$(git branch --show-current)}"

git -c credential.helper= \
    -c "credential.helper=!'$DIR/.git-credential-helper.sh'" \
    push origin "$BRANCH" -u
