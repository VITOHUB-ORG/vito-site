# Jenkins CI/CD Pipeline - Post-Installation Setup Checklist

## ✅ Prerequisites Completed
- [x] Java installed
- [x] Docker installed
- [x] Jenkins container running
- [x] Jenkinsfile created with email notifications
- [x] Docker Compose configuration updated

---

## 📋 Configuration Steps

### 1. Initialize Git Repository (If not already done)

```bash
cd /root/vito

# Initialize git if needed
git init

# Add your GitHub remote
git remote add origin https://github.com/VITOHUB-ORG/vito-site.git

# Or if repository already exists
git remote set-url origin https://github.com/VITOHUB-ORG/vito-site.git

# Verify remote
git remote -v

# Add all files
git add .

# Commit
git commit -m "Add Jenkins CI/CD pipeline configuration"

# Push to GitHub
git push -u origin main
# OR if your branch is 'master':
# git push -u origin master
```

---

### 2. Access Jenkins

**Jenkins URL:** `http://${SERVER_IP}:${JENKINS_PORT}/jenkins`

1. Open the URL in your browser
2. Get initial admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
3. Complete the setup wizard
4. Install suggested plugins
5. Create admin user

---

### 3. Configure GitHub Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Configure:
   - **Note:** `Jenkins CI/CD for Vito Project`
   - **Expiration:** 90 days (or your preference)
   - **Scopes:**
     - ✅ `repo` (Full control)
     - ✅ `admin:repo_hook` (Webhooks)
4. **COPY THE TOKEN** - you won't see it again!

---

### 4. Add Credentials to Jenkins

#### GitHub Credentials
1. Jenkins → Manage Jenkins → Manage Credentials
2. System → Global credentials → Add Credentials
3. Configure:
   - **Kind:** Username with password
   - **Username:** Your GitHub username
   - **Password:** Your GitHub Personal Access Token
   - **ID:** `github-credentials`
   - **Description:** GitHub Credentials
4. Click "Create"

#### Docker Hub Credentials
1. Click "Add Credentials" again
2. Configure:
   - **Kind:** Username with password
   - **Username:** Your Docker Hub username
   - **Password:** Your Docker Hub password
   - **ID:** `docker-hub-credentials`
   - **Description:** Docker Hub Credentials
3. Click "Create"

---

### 5. Configure Email Notifications

#### Step 1: Configure SMTP (Choose your email provider)

**For Gmail:**
1. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Generate new app password for "Mail"
2. In Jenkins → Manage Jenkins → Configure System:
   - **SMTP server:** `smtp.gmail.com`
   - **Use SMTP Authentication:** ✅ YES
   - **User Name:** your-email@gmail.com
   - **Password:** Your 16-character app password
   - **Use SSL:** ✅ YES
   - **SMTP Port:** 465

**For Office365/Outlook:**
- **SMTP server:** `smtp.office365.com`
- **SMTP Port:** 587
- **Use TLS:** ✅ YES

**For SendGrid (Recommended for production):**
- **SMTP server:** `smtp.sendgrid.net`
- **User Name:** `apikey`
- **Password:** Your SendGrid API Key
- **SMTP Port:** 587

#### Step 2: Configure Extended E-mail Notification
1. Same page, scroll to "Extended E-mail Notification"
2. Use same SMTP settings as above
3. Set **Default Recipients:** your-email@example.com
4. Test configuration
5. Click **Save**

---

### 6. Update Jenkinsfile Configuration

Edit `/root/vito/Jenkinsfile` and update these values:

```groovy
// Line 7-8: Update Docker Hub username
DOCKER_IMAGE_BACKEND = 'YOUR-DOCKERHUB-USERNAME/vito-backend'
DOCKER_IMAGE_FRONTEND = 'YOUR-DOCKERHUB-USERNAME/vito-frontend'

// Line 11: Verify server IP (should be correct)
SERVER_IP = '206.189.112.134'

// Line 20: Update email recipients
EMAIL_RECIPIENTS = 'your-email@example.com,another-email@example.com'
```

Then commit and push:
```bash
git add Jenkinsfile
git commit -m "Update Jenkinsfile with correct credentials and email"
git push origin main
```

---

### 7. Create Jenkins Pipeline Job

1. Jenkins Dashboard → New Item
2. Enter name: `Vito-CICD-Pipeline`
3. Select "Pipeline"
4. Click OK
5. Configure:
   - **Description:** Automated CI/CD pipeline for Vito project
   - **GitHub project:** `https://github.com/YOUR_USERNAME/YOUR_REPO`
   - **Build Triggers:**
     - ✅ GitHub hook trigger for GITScm polling
   - **Pipeline:**
     - **Definition:** Pipeline script from SCM
     - **SCM:** Git
     - **Repository URL:** `https://github.com/YOUR_USERNAME/YOUR_REPO.git`
     - **Credentials:** Select `github-credentials`
     - **Branch:** `*/main` (or `*/master`)
     - **Script Path:** `Jenkinsfile`
6. Click **Save**

---

### 8. Configure GitHub Webhook

1. Go to your GitHub repository
2. Settings → Webhooks → Add webhook
3. Configure:
   - **Payload URL:** `http://206.189.112.134:9002/github-webhook/`
   - **Content type:** `application/json`
   - **Which events:** Just the push event
   - **Active:** ✅ YES
4. Click "Add webhook"
5. Verify it shows a green checkmark ✅

---

### 9. Configure SSH Access to Production Server

If deploying to a remote server (not the same server running Jenkins):

```bash
# Generate SSH key in Jenkins container
docker exec -it jenkins ssh-keygen -t rsa -b 4096 -C "jenkins@ci-cd" -f /var/jenkins_home/.ssh/id_rsa -N ""

# Get the public key
docker exec jenkins cat /var/jenkins_home/.ssh/id_rsa.pub

# Copy this key to your production server's ~/.ssh/authorized_keys
# Then test the connection:
docker exec jenkins ssh -o StrictHostKeyChecking=no root@206.189.112.134 "echo 'SSH connection successful'"
```

**If deploying to the SAME server (localhost):**
The Jenkinsfile needs to be modified to use local Docker commands instead of SSH.

---

### 10. Test the Pipeline

#### Manual Test:
1. Click "Build Now" on your pipeline job
2. Watch the build progress
3. Check your email for notifications

#### Automatic Test (Push to GitHub):
```bash
# Make a small change
echo "# Test commit" >> README.md
git add README.md
git commit -m "Test Jenkins webhook trigger"
git push origin main
```

4. Check Jenkins - a new build should start automatically
5. Check your email for commit and build notifications

---

## 🔒 Security Recommendations

### 1. Configure Firewall
```bash
# Allow Jenkins port from your IP only (most secure)
sudo ufw allow from YOUR_IP_ADDRESS to any port 9002

# Or allow from anywhere (less secure, but easier)
sudo ufw allow 9002/tcp

# Check firewall status
sudo ufw status
```

### 2. Enable Jenkins Security
1. Manage Jenkins → Configure Global Security
2. **Security Realm:** Jenkins' own user database
3. **Authorization:** Logged-in users can do anything
4. **Prevent Cross Site Request Forgery exploits:** ✅ YES
5. Save

### 3. Set Up HTTPS (Production)
Use Nginx as reverse proxy with Let's Encrypt SSL:
```bash
# Install Nginx and Certbot
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y

# Configure Nginx (create /etc/nginx/sites-available/jenkins)
# Then get SSL certificate
sudo certbot --nginx -d jenkins.yourdomain.com
```

---

## 📊 Monitoring and Maintenance

### View Jenkins Logs
```bash
docker logs -f jenkins
```

### Restart Jenkins
```bash
docker restart jenkins
```

### Backup Jenkins Data
```bash
# Create backup
docker run --rm -v jenkins_home:/data -v $(pwd):/backup ubuntu tar czf /backup/jenkins-backup-$(date +%Y%m%d).tar.gz /data

# Restore backup
docker run --rm -v jenkins_home:/data -v $(pwd):/backup ubuntu tar xzf /backup/jenkins-backup-YYYYMMDD.tar.gz -C /
```

### Update Jenkins
```bash
# Pull latest image
docker pull jenkins/jenkins:lts-jdk17

# Restart with new image
docker-compose -f /root/vito/docker-compose.jenkins.yml up -d
```

---

## 🎯 Final Verification

- [ ] Jenkins is accessible at `http://206.189.112.134:9002`
- [ ] GitHub credentials are configured
- [ ] DockerHub credentials are configured
- [ ] Email notifications are configured and tested
- [ ] Pipeline job is created
- [ ] GitHub webhook is configured and shows ✅
- [ ] Manual build completes successfully
- [ ] Automatic build triggers on git push
- [ ] Email notifications are received for commits
- [ ] Email notifications are received for build success/failure
- [ ] Deployment to production works
- [ ] Firewall is configured
- [ ] Regular backups are scheduled

---

## 🆘 Troubleshooting

### Jenkins Not Starting
```bash
docker logs jenkins
docker restart jenkins
```

### Webhook Not Triggering
- Check webhook delivery in GitHub
- Verify firewall allows port 9002
- Verify URL is correct: `http://206.189.112.134:9002/github-webhook/`

### Emails Not Sending
- Test SMTP settings in Jenkins
- Check email app password (for Gmail)
- View email logs: `docker exec jenkins tail -f /var/jenkins_home/logs/tasks/Extended\ E-mail\ Notification.log`

---

**Setup Guide:** See `jenkins-configuration-guide.md` for detailed instructions.

**Support Resources:**
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [GitHub Webhooks](https://docs.github.com/en/webhooks)
- [Docker Documentation](https://docs.docker.com/)
