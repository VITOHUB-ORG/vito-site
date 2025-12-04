---
description: Configure Jenkins CI/CD pipeline
---

# Jenkins Setup Workflow

This workflow guides you through setting up the Jenkins CI/CD pipeline for automated deployments.

## Access Jenkins

1. Open your browser and navigate to: **http://206.189.112.134:8082**

2. Get the initial admin password:
```bash
ssh root@206.189.112.134 "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
```

## Initial Configuration

### 1. Unlock Jenkins
- Paste the initial admin password from above
- Click "Continue"

### 2. Install Plugins
- Select "Install suggested plugins"
- Wait for the installation to complete

### 3. Create Admin User
- Fill in your admin user details
- Click "Save and Continue"

### 4. Instance Configuration
- Keep the default Jenkins URL: `http://206.189.112.134:8082/`
- Click "Save and Finish"

## Configure Credentials

### 1. Add Docker Hub Credentials
1. Go to: **Manage Jenkins** → **Credentials** → **System** → **Global credentials**
2. Click **Add Credentials**
3. Select **Username with password**
4. Fill in:
   - **Username**: Your Docker Hub username
   - **Password**: Your Docker Hub password
   - **ID**: `docker-hub-credentials` (IMPORTANT: Must match this exactly)
   - **Description**: Docker Hub Credentials
5. Click **Create**

### 2. Add SSH Private Key (Already configured)
The SSH key for server access is already set up on the Jenkins host machine.

## Create the Pipeline Job

### 1. Create New Item
1. Click **New Item**
2. Enter name: `vito-deployment-pipeline`
3. Select **Pipeline**
4. Click **OK**

### 2. Configure Pipeline
1. In the **Pipeline** section:
   - **Definition**: Select "Pipeline script from SCM"
   - **SCM**: Select "Git"
   - **Repository URL**: Enter your Git repository URL (e.g., `https://github.com/yourusername/vito.git`)
   - **Credentials**: Add your Git credentials if the repo is private
   - **Branch Specifier**: `*/main` or `*/master` (depending on your default branch)
   - **Script Path**: `Jenkinsfile`

2. Click **Save**

### 3. Update Jenkinsfile
Before running the pipeline, update the `Jenkinsfile` in your repository:

```groovy
// Replace these values in the Jenkinsfile:
DOCKER_IMAGE_BACKEND = 'your-dockerhub-username/vito-backend'
DOCKER_IMAGE_FRONTEND = 'your-dockerhub-username/vito-frontend'
```

## Push Code to Git Repository

### 1. Create a Git Repository
Create a new repository on GitHub, GitLab, or any Git hosting service.

### 2. Push Your Code
```bash
cd /Users/frankkiruma/Desktop/Projects/vito
git remote add origin <your-git-repo-url>
git push -u origin master
```

## Run the Pipeline

### 1. Trigger Build
1. Go to your pipeline job: `vito-deployment-pipeline`
2. Click **Build Now**
3. Watch the build progress in the **Build History**

### 2. Monitor Build
- Click on the build number (e.g., #1)
- Click **Console Output** to see detailed logs

## Pipeline Stages

The pipeline will execute these stages:

1. **Build Backend**: Creates Docker image for Django backend
2. **Build Frontend**: Creates Docker image for React frontend
3. **Push Images**: Pushes images to Docker Hub
4. **Deploy to Server**: SSHs to the server and updates containers

## Troubleshooting

### Build Fails at "Push Images"
- Verify Docker Hub credentials are correct
- Check the credential ID is exactly `docker-hub-credentials`

### Build Fails at "Deploy to Server"
- Verify SSH access from Jenkins container to the server
- Run: `ssh root@206.189.112.134 "docker exec jenkins ssh -o StrictHostKeyChecking=no root@206.189.112.134 'echo success'"`

### Docker Hub Image Names
- Make sure to update the image names in `Jenkinsfile` with your actual Docker Hub username
- Format: `dockerhub-username/image-name`

## Webhook Setup (Optional - For Auto-Deploy on Git Push)

### 1. In Jenkins
1. Go to your pipeline job configuration
2. Under **Build Triggers**, check **GitHub hook trigger for GITScm polling** (for GitHub)

### 2. In GitHub/GitLab
1. Go to your repository settings
2. Add a webhook:
   - **Payload URL**: `http://206.189.112.134:8082/github-webhook/` (for GitHub)
   - **Content type**: `application/json`
   - **Events**: Select "Just the push event"
3. Save

Now every time you push to your repository, Jenkins will automatically build and deploy!
