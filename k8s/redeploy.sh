## ./redeploy.sh                # Deploy latest
## ./redeploy.sh v0.1.5         # Deploy specific version
## ./redeploy.sh a1b2c3d        # Deploy specific commit

NAMESPACE="flags-ui"
DEPLOYMENT="flags-ui"
IMAGE="ghcr.io/mainstreamer/flagsapp"

VERSION="${1:-latest}"

echo "=== Deploying flags-ui:$VERSION ==="
echo ""

# Show current version before change
CURRENT=$(kubectl get deployment/$DEPLOYMENT -n $NAMESPACE -o jsonpath='{.spec.template.spec.containers[0].image}' 2>/dev/null)
echo "Current: $CURRENT"
echo "Target:  $IMAGE:$VERSION"
echo ""

# Set the specific image version
kubectl set image deployment/$DEPLOYMENT \
     flags-ui=$IMAGE:$VERSION \
    -n $NAMESPACE

# Wait for rollout
kubectl rollout status deployment/$DEPLOYMENT -n $NAMESPACE --timeout=120s

echo ""
echo "=== Deploy Complete ==="
kubectl get pods -n $NAMESPACE
