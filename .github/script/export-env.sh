#!/bin/bash

echo "# Export GitHub Environment Variables"
env >> github-env.sh

echo "# Export GitHub Secrets"
echo "export URI_NEXT=\${{ secrets.URI_NEXT }}" >> github-env.sh
echo "export WEB_PATH=\${{ vars.WEB_PATH }}" >> github-env.sh
echo "export WEB_PORT=\${{ vars.WEB_PORT }}" >> github-env.sh