#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/shared.sh"

: "${HITECHCLOUD_MODEL_PROXY_BASE_URL_DEFAULT:=http://127.0.0.1:3060/api/v1/model-proxy}"
export HITECHCLOUD_MODEL_PROXY_BASE_URL_DEFAULT

hitechcloud_runtime_shared_main "$@"
