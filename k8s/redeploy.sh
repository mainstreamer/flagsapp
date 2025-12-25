#!/bin/bash
NAMESPACE="flags-ui"

echo "=== Redeploying flags-ui ==="

# Restart deployment to pull latest image
echo "Restarting deployment..."
kubectl rollout restart deployment/flags-ui -n $NAMESPACE

# Wait for rollout to complete
echo ""
echo "Waiting for flags-ui..."
kubectl rollout status deployment/flags-ui -n $NAMESPACE --timeout=120s

echo ""
echo "=== Redeploy Complete ==="
kubectl get pods -n $NAMESPACE
