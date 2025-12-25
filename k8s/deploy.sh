#!/bin/bash
set -e

NAMESPACE="flags-ui"
ENV_FILE="${1:-./.env.prod}"

echo "=== Flags UI Kubernetes Deployment ==="

# Check if kubectl is available
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed"
    exit 1
fi

# Create secret from .env.prod file
if [ -f "$ENV_FILE" ]; then
    echo "Creating secret from $ENV_FILE..."
    kubectl create secret generic flags-ui-secrets \
        --from-env-file="$ENV_FILE" \
        -n $NAMESPACE \
        --dry-run=client -o yaml | kubectl apply -f -

    # Create ghcr.io credentials from GITH_KEY
    GITH_KEY=$(grep -E "^GITH_KEY=" "$ENV_FILE" | cut -d '=' -f2-)
    if [ -n "$GITH_KEY" ]; then
        echo "Creating ghcr.io registry credentials..."
        kubectl create secret docker-registry ghcr-credentials \
            --docker-server=ghcr.io \
            --docker-username=mainstreamer \
            --docker-password="$GITH_KEY" \
            -n $NAMESPACE \
            --dry-run=client -o yaml | kubectl apply -f -
    else
        echo "Warning: GITH_KEY not found in $ENV_FILE, skipping ghcr credentials"
    fi
else
    echo "Warning: $ENV_FILE not found"
    echo "Create the secret manually:"
    echo "  kubectl create secret generic flags-ui-secrets --from-env-file=.env.prod -n $NAMESPACE"
    read -p "Press Enter to continue without secret, or Ctrl+C to exit..."
fi


# Function to wait for deployment
wait_for_deployment() {
    local deployment=$1
    echo "Waiting for $deployment to be ready..."
    kubectl rollout status deployment/$deployment -n $NAMESPACE --timeout=120s
}

# Apply all manifests using kustomize
echo "Applying manifests..."
kubectl apply -k .

# Wait for deployment
echo ""
echo "Waiting for deployment to be ready..."
wait_for_deployment flags-ui

echo ""
echo "=== Deployment Complete ==="
echo ""
echo "Services:"
kubectl get svc -n $NAMESPACE
echo ""
echo "Pods:"
kubectl get pods -n $NAMESPACE
echo ""
echo "Access the app at: http://<node-ip>:31080"
