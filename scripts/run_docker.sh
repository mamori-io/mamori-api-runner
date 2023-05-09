#!/bin/sh

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
docker run --rm -t --network host -v $SCRIPT_DIR:/app/scripts mamori-api-runner  /app/scripts/run_script.sh

