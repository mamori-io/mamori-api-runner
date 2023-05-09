#!/bin/sh

cd /app
source ./scripts/env.sh

yarn run ts-node ./scripts/sample-script.ts
