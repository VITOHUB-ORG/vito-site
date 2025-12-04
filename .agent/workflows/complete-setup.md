---
description: Complete setup guide for the entire deployment
---

# Complete Deployment Setup Guide

This guide walks you through the complete setup from scratch to a fully automated CI/CD pipeline.

## ✅ Already Completed

1. ✅ Docker and Docker Compose installed on server
2. ✅ SSH key-based authentication configured
3. ✅ Application containerized (Frontend + Backend)
4. ✅ Jenkins server deployed
5. ✅ Code pushed to GitHub: https://github.com/VITOHUB-ORG/vito-site.git
6. ✅ Application running on server

## 🎯 Current Status

### Application Access
- **Frontend**: http://206.189.112.134:8081
- **Backend API**: http://206.189.112.134:8000
- **Jenkins**: http://206.189.112.134:8082
- **Original System**: http://206.189.112.134 (smartmtn.co.tz)

### Server Details
- **IP**: 206.189.112.134
- **User**: root
- **Project Path**: /root/vito

## 📋 Remaining Steps

### Step 1: Configure Jenkins (10 minutes)

#### 1.1 Access Jenkins
Open your browser: http://206.189.112.134:8082

#### 1.2 Get Initial Password
Run this command:
```bash
ssh root@206.189.112.134 "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
```

#### 1.3 Complete Setup Wizard
1. Paste the password and click "Continue"
2. Select "Install suggested plugins"
3. Wait for plugins to install
4. Create your admin user:
   - Username: (your choice)
   - Password: (your choice)
   - Full name: (your choice)
   - Email: info@vitohub.org
5. Keep Jenkins URL as: http://206.189.112.134:8082/
6. Click "Save and Finish" → "Start using Jenkins"

### Step 2: Add Docker Hub Credentials (5 minutes)

#### 2.1 Create Docker Hub Account (if you don't have one)
- Go to https://hub.docker.com
- Sign up for a free account
- Remember your username and password

#### 2.2 Add Credentials to Jenkins
1. In Jenkins, go to: **Manage Jenkins** → **Credentials**
2. Click on **(global)** domain
3. Click **Add Credentials** (top right)
4. Fill in:
   - **Kind**: Username with password
   - **Scope**: Global
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password
   - **ID**: `docker-hub-credentials` (MUST be exactly this)
   - **Description**: Docker Hub Credentials
5. Click **Create**

### Step 3: Update Jenkinsfile with Your Docker Hub Username (2 minutes)

Edit the `Jenkinsfile` in your repository and replace `your-dockerhub-username` with your actual Docker Hub username:

```groovy
DOCKER_IMAGE_BACKEND = 'YOUR_DOCKERHUB_USERNAME/vito-backend'
DOCKER_IMAGE_FRONTEND = 'YOUR_DOCKERHUB_USERNAME/vito-frontend'
```

Then commit and push:
```bash
git add Jenkinsfile
git commit -m "Update Docker Hub username"
git push
```

### Step 4: Create Jenkins Pipeline Job (5 minutes)

#### 4.1 Create New Pipeline
1. In Jenkins, click **New Item**
2. Enter name: `vito-deployment-pipeline`
3. Select **Pipeline**
4. Click **OK**

#### 4.2 Configure Pipeline
1. **General Section**:
   - Check "GitHub project"
   - Project url: `https://github.com/VITOHUB-ORG/vito-site/`

2. **Build Triggers** (Optional - for auto-deploy):
   - Check "GitHub hook trigger for GITScm polling"

3. **Pipeline Section**:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
   - **Repository URL**: `https://github.com/VITOHUB-ORG/vito-site.git`
   - **Credentials**: None (public repo)
   - **Branch Specifier**: `*/main`
   - **Script Path**: `Jenkinsfile`

4. Click **Save**

### Step 5: Install Docker in Jenkins Container (IMPORTANT - 3 minutes)

The Jenkins container needs Docker CLI to build images. Run this:

```bash
ssh root@206.189.112.134 "docker exec -u root jenkins bash -c 'apt-get update && apt-get install -y docker.io && usermod -aG docker jenkins'"
```

Then restart Jenkins:
```bash
ssh root@206.189.112.134 "docker restart jenkins"
```

Wait 30 seconds for Jenkins to restart, then access it again at http://206.189.112.134:8082

### Step 6: Run Your First Build (2 minutes)

1. Go to your pipeline: `vito-deployment-pipeline`
2. Click **Build Now**
3. Watch the build progress in **Build History**
4. Click on the build number (e.g., #1)
5. Click **Console Output** to see detailed logs

### Step 7: Set Up GitHub Webhook (Optional - Auto Deploy on Push)

#### 7.1 In GitHub
1. Go to: https://github.com/VITOHUB-ORG/vito-site/settings/hooks
2. Click **Add webhook**
3. Fill in:
   - **Payload URL**: `http://206.189.112.134:8082/github-webhook/`
   - **Content type**: application/json
   - **Which events**: Just the push event
4. Click **Add webhook**

Now every time you push to GitHub, Jenkins will automatically build and deploy!

## 🔧 Troubleshooting

### Jenkins Build Fails at "Build Backend/Frontend"
**Issue**: Docker command not found
**Solution**: Make sure you completed Step 5 (Install Docker in Jenkins)

### Jenkins Build Fails at "Push Images"
**Issue**: Authentication failed
**Solution**: 
1. Verify Docker Hub credentials are correct
2. Make sure credential ID is exactly `docker-hub-credentials`
3. Try logging into Docker Hub manually to verify credentials

### Jenkins Build Fails at "Deploy to Server"
**Issue**: SSH connection failed
**Solution**: The SSH key should already be configured. Verify with:
```bash
ssh root@206.189.112.134 "docker exec jenkins ssh -o StrictHostKeyChecking=no root@206.189.112.134 'echo success'"
```

### Application Not Accessible After Deployment
**Issue**: Containers not running
**Solution**: Check container status:
```bash
ssh root@206.189.112.134 "docker ps"
```

## 🎉 Success Criteria

After completing all steps, you should have:

1. ✅ Jenkins accessible and configured
2. ✅ Pipeline job created and connected to GitHub
3. ✅ Successful build that:
   - Builds Docker images
   - Pushes to Docker Hub
   - Deploys to production server
4. ✅ Application accessible at http://206.189.112.134:8081
5. ✅ (Optional) Auto-deployment on Git push

## 📚 Quick Reference Commands

```bash
# Check application status
ssh root@206.189.112.134 "docker ps"

# View backend logs
ssh root@206.189.112.134 "docker logs vito_backend --tail 50"

# View frontend logs
ssh root@206.189.112.134 "docker logs vito_frontend --tail 50"

# Restart application
ssh root@206.189.112.134 "cd /root/vito && docker-compose restart"

# Manual deployment
ssh root@206.189.112.134 "cd /root/vito && git pull && docker-compose up -d --build"

# Get Jenkins password
ssh root@206.189.112.134 "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
```

## 🚀 Next Steps After Setup

1. Configure domain name (vitohub.org) to point to 206.189.112.134
2. Set up SSL/HTTPS with Let's Encrypt
3. Configure production database (PostgreSQL recommended)
4. Set up monitoring and logging
5. Configure automated backups
