#!/usr/bin/env bash
set -euo pipefail

source /opt/hitechcloud-runtime/bootstrap/shared.sh
source /opt/hitechcloud-runtime/bootstrap/container.sh

hitechcloud_container_bootstrap
hitechcloud_runtime_shared_main "$@"
