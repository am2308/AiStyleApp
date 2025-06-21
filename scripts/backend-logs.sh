#!/bin/bash

STAGE=${1:-dev}
echo "📋 Viewing backend logs for stage: $STAGE"

if [ "$2" = "tail" ]; then
    echo "📡 Streaming live logs (Ctrl+C to stop)..."
    npx serverless logs -f app --stage $STAGE --tail
else
    echo "📜 Recent logs:"
    npx serverless logs -f app --stage $STAGE
fi
