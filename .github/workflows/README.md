# GitHub Actions CI/CD Workflows

Automated CI/CD system for Email System using GitHub Actions.

## 📋 Workflows

### 1. CI - Build & Test (`ci.yml`)

**Trigger:** Push or Pull Request to `develop` or `main` branch

**Jobs:**

- **Lint & Type Check**: Check code quality with ESLint, TypeScript, and Prettier
- **Build**: Build the application for both staging and production
- **Security Scan**: Scan for vulnerabilities with Trivy and pnpm audit

### 2. Docker Build & Push (`docker-build.yml`)

**Trigger:** Push to `develop`/`main` branch or create a new tag

**Jobs:**

- Build Docker image with multi-stage build
- Push image to GitHub Container Registry (ghcr.io)
- Auto tag by branch, commit SHA, and semantic version
- Scan image with Trivy for vulnerabilities

### 3. Deploy to Staging (`deploy-staging.yml`)

**Trigger:** Push to `develop` branch or manual dispatch

**Jobs:**

- Deploy Docker image to staging server via SSH
- Automatic health check
- Cleanup old images

### 4. Deploy to Production (`deploy-production.yml`)

**Trigger:** Push to `main` branch, create tag, or manual dispatch

**Jobs:**

- Deploy Docker image to production server
- Create backup before deployment
- Auto rollback if health check fails
- Smoke tests after deployment

## 🔧 Required Configuration

### GitHub Secrets

You need to create the following secrets in repository settings:

#### Staging Environment

```
STAGING_HOST          # IP/domain of staging server
STAGING_USER          # SSH username
STAGING_SSH_KEY       # SSH private key
STAGING_PORT          # SSH port (default: 22)
```

#### Production Environment

```
PRODUCTION_HOST       # IP/domain of production server
PRODUCTION_USER       # SSH username
PRODUCTION_SSH_KEY    # SSH private key
PRODUCTION_PORT       # SSH port (default: 22)
```

#### Optional Secrets

```
ENV_FILE             # Content of .env file for build (if needed)
```

### GitHub Variables

Create variables in repository settings:

#### Staging

```
STAGING_URL          # URL to access staging (e.g.: https://staging.example.com)
STAGING_DEPLOY_PATH  # Deploy path on server (default: /opt/email-system)
STAGING_PORT         # Exposed port (default: 3000)
```

#### Production

```
PRODUCTION_URL           # Production URL (e.g.: https://example.com)
PRODUCTION_DEPLOY_PATH   # Deploy path on server (default: /opt/email-system)
PRODUCTION_PORT          # Exposed port (default: 3000)
```

### GitHub Environments

Create 2 environments in repository settings:

- `staging` - For staging deployment
- `production` - For production deployment (should enable protection rules)

## 📦 Server Configuration

### 1. Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Create deploy directory

```bash
sudo mkdir -p /opt/email-system
sudo chown $USER:$USER /opt/email-system
cd /opt/email-system
```

### 3. Copy docker-compose.ci.yml to server

```bash
# Scp from local
scp docker-compose.ci.yml user@server:/opt/email-system/

# Or clone from git
git clone <repo-url> .
```

### 4. Create Docker secrets

```bash
# Create .env file for container
cat > .env.secret << EOF
# API Keys
API_KEY=your_api_key_here
DATABASE_URL=your_db_url

# Add other environment variables...
EOF

# Create Docker secret
docker swarm init  # If swarm not initialized
docker secret create app_env .env.secret
rm .env.secret  # Remove file after creating secret
```

### 5. Configure GitHub Registry Authentication

```bash
# Login to GitHub Container Registry
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

### 6. Create SSH Key for GitHub Actions

```bash
# On server, create new SSH key for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github-actions
cat ~/.ssh/github-actions.pub >> ~/.ssh/authorized_keys

# Copy private key and add to GitHub Secrets
cat ~/.ssh/github-actions
```

## 🚀 Workflow Execution Flow

### Development Flow

```
1. Developer pushes code to develop branch
   ↓
2. CI workflow runs (lint, typecheck, build, security scan)
   ↓
3. Docker Build workflow builds image and pushes to ghcr.io
   ↓
4. Deploy Staging workflow automatically deploys to staging server
   ↓
5. QA testing on staging
```

### Production Flow

```
1. Merge develop → main or create release tag
   ↓
2. CI workflow runs on main branch
   ↓
3. Docker Build workflow builds production image
   ↓
4. Deploy Production workflow deploys to production
   ↓
5. Health check and smoke tests
```

## 🔍 Monitoring and Troubleshooting

### View workflow logs

```bash
# On GitHub UI: Actions tab → Select workflow run → View logs

# View container logs on server
docker-compose -f docker-compose.ci.yml logs -f
```

### Check health status

```bash
docker inspect email-system-ci | grep -A 10 Health
```

### Rollback (Production)

```bash
# List backup images
docker images | grep email-system-ci | grep backup

# Rollback to latest backup
docker-compose -f docker-compose.ci.yml down
docker tag email-system-ci:backup-YYYYMMDD-HHMMSS email-system-ci:latest
docker-compose -f docker-compose.ci.yml up -d
```

## 🔐 Security Best Practices

1. **Secrets Management**: Never commit secrets to git
2. **SSH Keys**: Use dedicated SSH keys for GitHub Actions
3. **Environment Protection**: Enable protection rules for production environment
4. **Image Scanning**: Always scan images with Trivy before deployment
5. **Docker Secrets**: Use Docker secrets instead of environment variables for sensitive data

## 📝 Customization

### Add tests to CI

Edit [ci.yml](.github/workflows/ci.yml) and add test job:

```yaml
test:
  name: Run Tests
  runs-on: ubuntu-latest
  needs: lint-and-typecheck
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v4
    - run: pnpm install --frozen-lockfile
    - run: pnpm test
```

### Add notification

Use Slack/Discord webhook to receive notifications when deploying:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Deployment to production completed!"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 🆘 Support

If you encounter issues:

1. Check logs in GitHub Actions UI
2. Check logs on server: `docker-compose logs`
3. Verify secrets and variables are configured correctly
4. Check network/firewall rules between GitHub Actions and server
