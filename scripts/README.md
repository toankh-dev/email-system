# Deployment Scripts

Các scripts để deploy và quản lý ứng dụng một cách an toàn.

## Scripts có sẵn

### 1. `deploy.sh` - Deployment Script

Deploy ứng dụng với automatic rollback nếu có lỗi.

**Features:**

- ✅ Automatic backup trước khi deploy
- ✅ Health check sau deployment
- ✅ Automatic rollback nếu health check fail
- ✅ Cleanup old backups
- ✅ Proper error handling

**Usage:**

```bash
# Deploy to staging
chmod +x scripts/deploy.sh
./scripts/deploy.sh staging

# Deploy to production
./scripts/deploy.sh production
```

**Environment Variables (cho staging):**

- `CI_COMMIT_SHA` - Git commit SHA (auto-detected)
- `CI_COMMIT_BRANCH` - Git branch name (auto-detected)
- `BUILD_TIME` - Build timestamp (auto-generated)

---

### 2. `setup-secrets.sh` - Setup Docker Secrets

Setup secrets một cách an toàn cho từng environment.

**Features:**

- ✅ Validate required environment variables
- ✅ Support Docker Swarm secrets
- ✅ Support standalone file-based secrets
- ✅ Proper file permissions (600)
- ✅ Security reminders

**Usage:**

```bash
# Setup staging secrets
chmod +x scripts/setup-secrets.sh

# Copy example file
cp .env.production.example .env.staging

# Edit with your values
nano .env.staging

# Run setup
./scripts/setup-secrets.sh staging
```

**Required Variables:**

- `DATABASE_URL` - Database connection string
- `SECRET_KEY` - Application secret key
- `JWT_SECRET` - JWT signing secret

---

## Deployment Workflow

### First Time Setup

1. **Chuẩn bị environment file:**

   ```bash
   cp .env.production.example .env.production
   nano .env.production  # Fill in your secrets
   ```

2. **Setup secrets:**

   ```bash
   ./scripts/setup-secrets.sh production
   ```

3. **Deploy:**
   ```bash
   ./scripts/deploy.sh production
   ```

### Regular Deployment

```bash
# Just run deploy script
./scripts/deploy.sh production
```

---

## Security Best Practices

### ✅ DO:

- Store secrets in environment variables or secret management systems
- Use different secrets for staging and production
- Rotate secrets regularly
- Limit access to deployment scripts
- Review deployment logs
- Test in staging before production

### ❌ DON'T:

- Commit `.env` files to git
- Share secrets via chat/email
- Use same secrets across environments
- Skip health checks
- Deploy without backup

---

## Troubleshooting

### Deployment Failed

**Check logs:**

```bash
docker-compose -f docker-compose.yml logs --tail=100
```

**Manual rollback:**

```bash
# List backups
docker images | grep backup

# Rollback to specific backup
docker tag email-system:backup-TIMESTAMP email-system:latest
docker-compose up -d
```

### Health Check Failing

**Check application logs:**

```bash
docker exec email-system tail -f /var/log/app.log
```

**Manual health check:**

```bash
docker exec email-system node -e "require('http').get('http://localhost:3000/api/health', (r) => console.log(r.statusCode))"
```

### Secrets Not Loading

**Check secret file permissions:**

```bash
ls -la .env.production
# Should be: -rw------- (600)
```

**Fix permissions:**

```bash
chmod 600 .env.production
```

**For Swarm secrets:**

```bash
docker secret ls
docker secret inspect app_env
```

---

## CI/CD Integration

### GitLab CI/CD

Scripts được thiết kế để work với GitLab CI/CD pipeline trong `.gitlab-ci.yml.example`.

**Environment Variables cần set trong GitLab:**

- `SSH_PRIVATE_KEY` - SSH key for deployment
- `STAGING_SERVER` - Staging server hostname
- `STAGING_USER` - SSH username for staging
- `PRODUCTION_SERVER` - Production server hostname
- `PRODUCTION_USER` - SSH username for production
- `DATABASE_URL` - Database connection (masked variable)
- `SECRET_KEY` - App secret (masked variable)
- `JWT_SECRET` - JWT secret (masked variable)

### GitHub Actions

Tương tự, có thể adapt cho GitHub Actions:

```yaml
- name: Deploy to production
  run: |
    chmod +x scripts/deploy.sh
    ./scripts/deploy.sh production
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    SECRET_KEY: ${{ secrets.SECRET_KEY }}
```

---

## Advanced Usage

### Custom Health Check Endpoint

Sửa trong `deploy.sh`:

```bash
# Change this line
docker exec "$CONTAINER_NAME" node -e "require('http').get('http://localhost:3000/YOUR_ENDPOINT', ...)"
```

### Custom Backup Retention

```bash
# Edit deploy.sh
BACKUP_RETENTION=10  # Keep last 10 backups
```

### Pre-deployment Hooks

Thêm vào `deploy.sh` trước Step 1:

```bash
log_info "Running pre-deployment tasks..."
# Your custom tasks here
./scripts/run-migrations.sh
./scripts/warm-cache.sh
```

---

## Monitoring

### Check Deployment Status

```bash
# Container status
docker ps -a | grep email-system

# Resource usage
docker stats email-system

# Recent logs
docker logs email-system --tail=100 --follow
```

### Rollback Statistics

```bash
# List all backups with timestamps
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.CreatedAt}}" | grep backup
```

---

## Support

Nếu gặp vấn đề, check:

1. Container logs: `docker logs email-system`
2. Deployment script logs
3. Health check endpoint: `/api/health`
4. Docker compose config: `docker-compose config`
