#!/bin/bash

if [[ $(git log -1 --pretty=format:'%an') == *"[bot]" ]] ; then
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
else
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;
fi
