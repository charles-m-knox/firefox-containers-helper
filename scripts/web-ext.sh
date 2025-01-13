#!/bin/bash -e

# This script is not intended to be used anymore since the `web-ext` tool
# does not seem to have a way to publish release notes to AMO.
# But it does serve as a good reference for future use.

web-ext build -s "./dist" --overwrite-dest

echo -n "Enter your JWT issuer key from addons.mozilla.org: "
read API_KEY

echo -n "Enter your JWT secret from addons.mozilla.org: "
read -s API_SECRET
echo

# echo -n "Enter the extension ID: "
# read ADDON_ID
# echo

web-ext sign -s "./dist" --api-key "${API_KEY}" --api-secret "${API_SECRET}" # --id "${ADDON_ID}"
