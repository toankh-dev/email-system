#!/bin/bash
# Deployment script with proper error handling and rollback
# Usage: ./scripts/deploy.sh [staging|production]

set -euo pipefail  # Exit on error, undefined vars, pipe failures
IFS=$'\n\t'

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-staging}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_RETENTION=5  # Keep last 5 backups

# Logging functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    log_error "Invalid environment: $ENVIRONMENT"
    echo "Usage: $0 [staging|production]"
    exit 1
fi

log_info "Starting deployment to $ENVIRONMENT..."

# Change to project directory
cd "$PROJECT_DIR" || exit 1

# Determine compose file
if [ "$ENVIRONMENT" = "staging" ]; then
    COMPOSE_FILE="docker-compose.ci.yml"
    CONTAINER_NAME="email-system-ci"
else
    COMPOSE_FILE="docker-compose.yml"
    CONTAINER_NAME="email-system"
fi

# Check if compose file exists
if [ ! -f "$COMPOSE_FILE" ]; then
    log_error "Compose file not found: $COMPOSE_FILE"
    exit 1
fi

# Function to create backup
create_backup() {
    log_info "Creating backup..."
    BACKUP_TAG="${CONTAINER_NAME}:backup-$(date +%s)"

    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        docker commit "$CONTAINER_NAME" "$BACKUP_TAG" 2>/dev/null || true
        log_info "Backup created: $BACKUP_TAG"
    else
        log_warn "No running container to backup"
    fi
}

# Function to cleanup old backups
cleanup_backups() {
    log_info "Cleaning up old backups..."
    docker images --format '{{.Repository}}:{{.Tag}}' | \
        grep "^${CONTAINER_NAME}:backup-" | \
        sort -r | \
        tail -n +$((BACKUP_RETENTION + 1)) | \
        xargs -r docker rmi 2>/dev/null || true
}

# Function to health check
health_check() {
    log_info "Running health check..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker exec "$CONTAINER_NAME" node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" 2>/dev/null; then
            log_info "Health check passed!"
            return 0
        fi

        log_warn "Health check attempt $attempt/$max_attempts failed, retrying..."
        sleep 2
        ((attempt++))
    done

    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Function to rollback
rollback() {
    log_error "Deployment failed! Rolling back..."

    # Stop current container
    docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true

    # Find latest backup
    LATEST_BACKUP=$(docker images --format '{{.Repository}}:{{.Tag}}' | \
        grep "^${CONTAINER_NAME}:backup-" | \
        sort -r | \
        head -n 1)

    if [ -n "$LATEST_BACKUP" ]; then
        log_info "Rolling back to: $LATEST_BACKUP"
        docker tag "$LATEST_BACKUP" "${CONTAINER_NAME}:latest"
        docker-compose -f "$COMPOSE_FILE" up -d

        if health_check; then
            log_info "Rollback successful"
        else
            log_error "Rollback health check failed! Manual intervention required."
        fi
    else
        log_error "No backup found for rollback! Manual intervention required."
    fi

    exit 1
}

# Set trap to rollback on error
trap 'rollback' ERR

# Main deployment steps
log_info "Step 1: Creating backup..."
create_backup

log_info "Step 2: Pulling latest images..."
if [ "$ENVIRONMENT" = "staging" ]; then
    export NODE_ENV=staging
    export CI_COMMIT_SHA="${CI_COMMIT_SHA:-$(git rev-parse --short HEAD)}"
    export CI_COMMIT_BRANCH="${CI_COMMIT_BRANCH:-$(git branch --show-current)}"
    export BUILD_TIME="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
fi

docker-compose -f "$COMPOSE_FILE" pull

log_info "Step 3: Stopping old container..."
docker-compose -f "$COMPOSE_FILE" down

log_info "Step 4: Starting new container..."
docker-compose -f "$COMPOSE_FILE" up -d --force-recreate --no-build

log_info "Step 5: Waiting for application to start..."
sleep 15

log_info "Step 6: Running health check..."
if ! health_check; then
    log_error "Health check failed!"
    rollback
fi

log_info "Step 7: Cleaning up..."
docker image prune -f
cleanup_backups

log_info "${GREEN}Deployment to $ENVIRONMENT completed successfully!${NC}"

# Show container status
log_info "Container status:"
docker ps --filter "name=$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
