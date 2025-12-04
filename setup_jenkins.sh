#!/bin/bash
set -e

echo "🚀 Setting up Jenkins for Docker builds..."

# Install Docker CLI in Jenkins container
echo "📦 Installing Docker CLI in Jenkins container..."
ssh root@206.189.112.134 "docker exec -u root jenkins bash -c 'apt-get update && apt-get install -y docker.io'"

# Add jenkins user to docker group
echo "👤 Adding jenkins user to docker group..."
ssh root@206.189.112.134 "docker exec -u root jenkins usermod -aG docker jenkins"

# Copy SSH key to Jenkins container for server deployment
echo "🔑 Setting up SSH key for deployment..."
ssh root@206.189.112.134 "docker cp ~/.ssh/id_rsa jenkins:/var/jenkins_home/.ssh/id_rsa"
ssh root@206.189.112.134 "docker cp ~/.ssh/id_rsa.pub jenkins:/var/jenkins_home/.ssh/id_rsa.pub"
ssh root@206.189.112.134 "docker exec -u root jenkins chown -R jenkins:jenkins /var/jenkins_home/.ssh"
ssh root@206.189.112.134 "docker exec -u root jenkins chmod 600 /var/jenkins_home/.ssh/id_rsa"

# Restart Jenkins to apply changes
echo "🔄 Restarting Jenkins..."
ssh root@206.189.112.134 "docker restart jenkins"

echo "✅ Setup complete! Waiting 30 seconds for Jenkins to restart..."
sleep 30

echo "🎉 Jenkins is ready! Access it at: http://206.189.112.134:8082"
echo ""
echo "📋 Next steps:"
echo "1. Get Jenkins password: ssh root@206.189.112.134 \"docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword\""
echo "2. Open http://206.189.112.134:8082 and complete the setup wizard"
echo "3. Add your Docker Hub credentials with ID: docker-hub-credentials"
echo "4. Create a pipeline job pointing to: https://github.com/VITOHUB-ORG/vito-site.git"
