---
description: Deploy the application to production server
---

# Deployment Workflow

This workflow describes how to deploy the VitoTech application to the production server.

## Prerequisites
- Docker and Docker Compose installed on the server (✅ Already configured)
- SSH access to the server (✅ Already configured)
- Server IP: 206.189.112.134

## Deployment Steps

### 1. Build and Test Locally (Optional)
```bash
# Build the containers locally to test
docker-compose build
```

### 2. Sync Code to Server
```bash
# Sync the project files to the server (excluding node_modules, venv, etc.)
rsync -avz --exclude 'node_modules' --exclude 'venv' --exclude '.git' --exclude '__pycache__' ./ root@206.189.112.134:/root/vito
```

### 3. Deploy on Server
```bash
# SSH into the server and restart the containers
ssh root@206.189.112.134 "cd /root/vito && docker-compose down && docker-compose up -d --build"
```

### 4. Verify Deployment
```bash
# Check if containers are running
ssh root@206.189.112.134 "docker ps"

# Check application logs
ssh root@206.189.112.134 "docker logs vito_backend --tail 50"
ssh root@206.189.112.134 "docker logs vito_frontend --tail 50"
```

## Access Points

After deployment, the application is accessible at:
- **Frontend**: http://206.189.112.134:8081
- **Backend API**: http://206.189.112.134:8000
- **Jenkins CI/CD**: http://206.189.112.134:8082
- **Original System (smartmtn.co.tz)**: http://206.189.112.134 (Port 80)

## Troubleshooting

### Check Container Status
```bash
ssh root@206.189.112.134 "docker ps -a"
```

### View Container Logs
```bash
ssh root@206.189.112.134 "docker logs vito_backend"
ssh root@206.189.112.134 "docker logs vito_frontend"
```

### Restart Containers
```bash
ssh root@206.189.112.134 "cd /root/vito && docker-compose restart"
```

### Full Rebuild
```bash
ssh root@206.189.112.134 "cd /root/vito && docker-compose down && docker-compose up -d --build --force-recreate"
```
