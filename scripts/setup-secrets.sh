#!/bin/bash
# Script to setup Docker secrets securely
# Usage: ./scripts/setup-secrets.sh [staging|production]

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

ENVIRONMENT="${1:-staging}"

if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    log_error "Invalid environment: $ENVIRONMENT"
    echo "Usage: $0 [staging|production]"
    exit 1
fi

log_info "Setting up secrets for $ENVIRONMENT environment..."

# Check if running in Docker Swarm mode
if docker info 2>/dev/null | grep -q "Swarm: active"; then
    USE_SWARM=true
    log_info "Docker Swarm detected, using swarm secrets"
else
    USE_SWARM=false
    log_info "Standalone mode, secrets will be stored as files"
fi

ENV_FILE=".env.$ENVIRONMENT"

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    log_error "Environment file not found: $ENV_FILE"
    log_error "Please create it from .env.production.example"
    exit 1
fi

# Validate env file has required variables
REQUIRED_VARS=("DATABASE_URL" "SECRET_KEY" "JWT_SECRET")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" "$ENV_FILE"; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    log_error "Missing required variables in $ENV_FILE:"
    printf '%s\n' "${MISSING_VARS[@]}"
    exit 1
fi

# Create secret
if [ "$USE_SWARM" = true ]; then
    # Swarm mode - use docker secret
    SECRET_NAME="app_env"

    # Check if secret already exists
    if docker secret ls --format '{{.Name}}' | grep -q "^${SECRET_NAME}$"; then
        log_info "Secret $SECRET_NAME already exists"
        read -p "Do you want to recreate it? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Cannot update secret, must remove and recreate
            log_info "Removing old secret..."
            docker secret rm "$SECRET_NAME"

            log_info "Creating new secret..."
            cat "$ENV_FILE" | docker secret create "$SECRET_NAME" -
        fi
    else
        log_info "Creating secret..."
        cat "$ENV_FILE" | docker secret create "$SECRET_NAME" -
    fi

    log_info "Secret created successfully!"
    log_info "Verify with: docker secret ls"

else
    # Standalone mode - ensure file has correct permissions
    log_info "Setting file permissions (600 - owner read/write only)..."
    chmod 600 "$ENV_FILE"

    log_info "File permissions set successfully!"
    log_info "Secret file location: $(realpath "$ENV_FILE")"
fi

# Security warning
log_info ""
log_info "${YELLOW}SECURITY REMINDERS:${NC}"
echo "1. Never commit .env files to git"
echo "2. Use different secrets for each environment"
echo "3. Rotate secrets regularly"
echo "4. Limit access to secret files/docker secrets"
echo "5. Use a secret management service (Vault, AWS Secrets Manager, etc.) in production"

log_info ""
log_info "${GREEN}Setup complete!${NC}"
