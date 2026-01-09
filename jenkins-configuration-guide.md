# Complete Jenkins CI/CD Pipeline Configuration Guide

## Table of Contents
1. [Initial Setup](#initial-setup)
2. [GitHub Integration](#github-integration)
3. [Email Notification Configuration](#email-notification-configuration)
4. [Pipeline Job Creation](#pipeline-job-creation)
5. [GitHub Webhook Setup](#github-webhook-setup)
6. [Security Best Practices](#security-best-practices)
7. [Troubleshooting](#troubleshooting)

---

## 1. Initial Setup

### Access Jenkins
After running the installation script, access Jenkins at the URL provided (check `jenkins-setup-info.txt`).

### First-Time Login
1. Use the **Initial Admin Password** from `jenkins-setup-info.txt`
2. Click **"Install suggested plugins"**
3. Create your **Admin User Account**:
   - Username: `admin` (or your preference)
   - Password: Choose a strong password
   - Email: Your email address (for notifications)

### Configure Global Settings

#### Set Jenkins URL
1. Go to **Manage Jenkins** → **Configure System**
2. Find **Jenkins Location**
3. Set **Jenkins URL**: `http://YOUR_SERVER_IP:JENKINS_PORT/jenkins`
4. Set **System Admin e-mail address**: Your email
5. Click **Save**

---

## 2. GitHub Integration

### Step 2.1: Create GitHub Personal Access Token (PAT)

1. Go to GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Click **"Generate new token (classic)"**
3. Set the following:
   - **Note**: `Jenkins CI/CD for Vito Project`
   - **Expiration**: 90 days (or your preference)
   - **Scopes**: Select:
     - ✅ `repo` (Full control of private repositories)
     - ✅ `admin:repo_hook` (Full control of repository hooks)
4. Click **Generate token**
5. **COPY THE TOKEN IMMEDIATELY** (you won't see it again!)

### Step 2.2: Add GitHub Credentials to Jenkins

1. In Jenkins, go to **Manage Jenkins** → **Manage Credentials**
2. Click on **System** → **Global credentials (unrestricted)**
3. Click **Add Credentials**
4. Configure:
   - **Kind**: `Secret text`
   - **Scope**: `Global`
   - **Secret**: Paste your GitHub Personal Access Token
   - **ID**: `github-token`
   - **Description**: `GitHub PAT for Vito Project`
5. Click **Create**

### Step 2.3: Add GitHub Username/Password Credentials (Alternative Method)

1. Click **Add Credentials** again
2. Configure:
   - **Kind**: `Username with password`
   - **Scope**: `Global`
   - **Username**: Your GitHub username
   - **Password**: Your GitHub Personal Access Token (paste here)
   - **ID**: `github-credentials`
   - **Description**: `GitHub Credentials`
3. Click **Create**

### Step 2.4: Add Docker Hub Credentials (for pushing images)

1. Click **Add Credentials** again
2. Configure:
   - **Kind**: `Username with password`
   - **Scope**: `Global`
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password
   - **ID**: `docker-hub-credentials`
   - **Description**: `Docker Hub Credentials`
3. Click **Create**

### Step 2.5: Configure SSH Keys for Server Deployment

If deploying to a remote server via SSH:

1. On Jenkins server, generate SSH key:
   ```bash
   docker exec -it jenkins ssh-keygen -t rsa -b 4096 -C "jenkins@ci-cd" -f /var/jenkins_home/.ssh/id_rsa -N ""
   ```

2. Copy public key to your production server:
   ```bash
   docker exec jenkins cat /var/jenkins_home/.ssh/id_rsa.pub
   # Copy this key to your server's ~/.ssh/authorized_keys
   ```

3. Add SSH key to Jenkins:
   - Go to **Manage Jenkins** → **Manage Credentials** → **Add Credentials**
   - **Kind**: `SSH Username with private key`
   - **ID**: `ssh-server-key`
   - **Username**: `root`
   - **Private Key**: Enter directly → Paste the private key
     ```bash
     docker exec jenkins cat /var/jenkins_home/.ssh/id_rsa
     ```
   - Click **Create**

---

## 3. Email Notification Configuration

### Step 3.1: Configure Email Server (SMTP)

1. Go to **Manage Jenkins** → **Configure System**
2. Scroll to **E-mail Notification** section
3. Configure SMTP settings:

#### For Gmail:
```
SMTP server: smtp.gmail.com
Use SMTP Authentication: ✅ YES
User Name: your-email@gmail.com
Password: Your App Password (NOT your Gmail password!)
Use SSL: ✅ YES
SMTP Port: 465
```

**To generate Gmail App Password:**
1. Go to Google Account → Security → 2-Step Verification → App passwords
2. Generate a new app password for "Mail"
3. Use this 16-character password in Jenkins

#### For Office365/Outlook:
```
SMTP server: smtp.office365.com
Use SMTP Authentication: ✅ YES
User Name: your-email@outlook.com
Password: Your email password
Use TLS: ✅ YES
SMTP Port: 587
```

#### For SendGrid (Recommended for production):
```
SMTP server: smtp.sendgrid.net
Use SMTP Authentication: ✅ YES
User Name: apikey
Password: Your SendGrid API Key
Use TLS: ✅ YES
SMTP Port: 587
```

4. Test configuration by checking **"Test configuration by sending test e-mail"**
5. Enter your email address and click **"Test configuration"**
6. Click **Save**

### Step 3.2: Configure Extended E-mail Notification

1. In the same **Configure System** page, scroll to **Extended E-mail Notification**
2. Configure:
   - **SMTP server**: Same as above (e.g., `smtp.gmail.com`)
   - **SMTP Port**: Same as above (e.g., `465`)
   - Click **Advanced**
   - **Use SMTP Authentication**: ✅ YES
   - **User Name**: Your email
   - **Password**: Your app password/API key
   - **Use SSL**: ✅ YES (or TLS depending on your provider)
   - **Default Content Type**: `HTML (text/html)`
   - **Default Recipients**: Your email address(es), comma-separated
   - **Default Subject**: `$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS`
   - **Default Content**: 
     ```html
     <h2>Build Notification</h2>
     <p><strong>Project:</strong> $PROJECT_NAME</p>
     <p><strong>Build Number:</strong> $BUILD_NUMBER</p>
     <p><strong>Build Status:</strong> $BUILD_STATUS</p>
     <p><strong>Commit Author:</strong> ${ENV, var="GIT_AUTHOR_NAME"} &lt;${ENV, var="GIT_AUTHOR_EMAIL"}&gt;</p>
     <p><strong>Commit Message:</strong> ${ENV, var="GIT_COMMIT_MSG"}</p>
     <p><strong>Build URL:</strong> <a href="$BUILD_URL">$BUILD_URL</a></p>
     <p><strong>Console Output:</strong> <a href="${BUILD_URL}console">${BUILD_URL}console</a></p>
     ```
3. Click **Save**

---

## 4. Pipeline Job Creation

### Step 4.1: Create Pipeline Job

1. From Jenkins dashboard, click **New Item**
2. Enter name: `Vito-CICD-Pipeline`
3. Select **Pipeline**
4. Click **OK**

### Step 4.2: Configure Pipeline

#### General Settings:
- **Description**: `Automated CI/CD pipeline for Vito project with GitHub integration`
- **Project url:** `https://github.com/VITOHUB-ORG/vito-site`

#### Build Triggers:
3. Scroll to **Build Triggers**
4. Check **GitHub hook trigger for GITScm polling**

#### Pipeline Settings:
5. Scroll to **Pipeline**
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
   - **Repository URL:** `https://github.com/VITOHUB-ORG/vito-site.git`
- **Credentials**: Select `github-credentials` (created earlier)
- **Branch Specifier**: `*/main` (or `*/master` depending on your default branch)
- **Script Path**: `Jenkinsfile`

#### Advanced Settings (Optional):
- **Lightweight checkout**: ✅ (faster checkout)

### Step 4.3: Save Configuration
Click **Save**

---

## 5. GitHub Webhook Setup

### Step 5.1: Configure Webhook in GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Configure:
   - **Payload URL**: `http://YOUR_SERVER_IP:JENKINS_PORT/github-webhook/`
     - Example: `http://206.189.112.134:9002/github-webhook/`
   - **Content type**: `application/json`
   - **Secret**: Leave empty (or add a secret for extra security)
   - **Which events would you like to trigger this webhook?**
     - ✅ Just the push event
   - **Active**: ✅ YES
4. Click **Add webhook**

### Step 5.2: Verify Webhook

1. Make a small commit to your repository
2. Go to GitHub → Settings → Webhooks → Click on your webhook
3. Scroll to **Recent Deliveries**
4. You should see a green checkmark ✅ for successful delivery
5. Check Jenkins - a new build should have started automatically!

---

## 6. Security Best Practices

### 6.1: Enable Jenkins Security

1. **Manage Jenkins** → **Configure Global Security**
2. **Security Realm**: Jenkins' own user database
   - ✅ Allow users to sign up: NO (disable after creating admin)
3. **Authorization**: 
   - ✅ Logged-in users can do anything
   - OR ✅ Matrix-based security (for fine-grained control)

### 6.2: Install Security Plugins

Install these plugins for enhanced security:
- **Role-based Authorization Strategy**
- **OWASP Dependency-Check**
- **Audit Trail**

### 6.3: Secure Credentials

- Never hardcode credentials in Jenkinsfile
- Always use Jenkins Credentials Store
- Use separate credentials for different environments
- Rotate credentials regularly

### 6.4: Firewall Configuration

Configure firewall to only allow necessary access:
```bash
# Allow Jenkins port from specific IPs only
sudo ufw allow from YOUR_IP to any port JENKINS_PORT

# Or allow from anywhere (less secure)
sudo ufw allow JENKINS_PORT/tcp
```

### 6.5: Enable HTTPS (Recommended for Production)

Use a reverse proxy (Nginx) to add HTTPS:

```nginx
server {
    listen 443 ssl;
    server_name jenkins.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:JENKINS_PORT;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 7. Troubleshooting

### Jenkins Not Starting
```bash
# Check container status
docker ps -a | grep jenkins

# View logs
docker logs -f jenkins

# Restart container
docker restart jenkins
```

### GitHub Webhook Not Triggering Builds

**Check:**
1. Webhook delivery status in GitHub (Settings → Webhooks)
2. Firewall allows incoming connections on Jenkins port
3. Jenkins URL is correct in webhook configuration
4. Build trigger is enabled in Jenkins job configuration

**Test webhook manually:**
```bash
curl -X POST http://YOUR_SERVER_IP:JENKINS_PORT/github-webhook/
```

### Email Notifications Not Working

**Check:**
1. SMTP settings are correct
2. App password is used (not regular password for Gmail)
3. Firewall allows outbound connections on SMTP port
4. Test email configuration in Jenkins settings

**View Jenkins logs:**
```bash
docker exec jenkins tail -f /var/jenkins_home/logs/tasks/Extended\ E-mail\ Notification.log
```

### Build Failing - Docker Permission Issues

If you see "permission denied" errors with Docker:
```bash
# Give Jenkins container access to Docker socket
docker exec -u root jenkins chmod 666 /var/run/docker.sock

# Or add jenkins user to docker group inside container
docker exec -u root jenkins usermod -aG docker jenkins
docker restart jenkins
```

### Can't Access Jenkins UI

**Check:**
1. Container is running: `docker ps | grep jenkins`
2. Port is accessible: `netstat -tuln | grep JENKINS_PORT`
3. Firewall allows the port: `sudo ufw status`
4. Try accessing from localhost: `curl http://localhost:JENKINS_PORT`

### Reset Admin Password

```bash
# Stop Jenkins
docker exec jenkins java -jar /var/jenkins_home/war/WEB-INF/jenkins-cli.jar -s http://localhost:8080/ safe-restart

# Or disable security temporarily
docker exec jenkins sed -i 's/<useSecurity>true<\/useSecurity>/<useSecurity>false<\/useSecurity>/g' /var/jenkins_home/config.xml
docker restart jenkins
```

---

## Additional Resources

- [Jenkins Official Documentation](https://www.jenkins.io/doc/)
- [GitHub Webhook Documentation](https://docs.github.com/en/webhooks)
- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Pipeline Syntax](https://www.jenkins.io/doc/book/pipeline/syntax/)

---

## Quick Commands Reference

```bash
# View Jenkins logs
docker logs -f jenkins

# Restart Jenkins
docker restart jenkins

# Stop Jenkins
docker-compose -f /root/vito/docker-compose.jenkins.yml down

# Start Jenkins
docker-compose -f /root/vito/docker-compose.jenkins.yml up -d

# Access Jenkins container shell
docker exec -it jenkins bash

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# View Jenkins home directory
docker exec jenkins ls -la /var/jenkins_home

# Backup Jenkins data
docker run --rm -v jenkins_home:/data -v $(pwd):/backup ubuntu tar czf /backup/jenkins-backup-$(date +%Y%m%d).tar.gz /data
```

---

**Configuration Complete!** Your Jenkins CI/CD pipeline is ready for automated deployments.
