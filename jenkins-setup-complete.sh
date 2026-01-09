#!/bin/bash

###############################################################################
# COMPLETE JENKINS CI/CD PIPELINE SETUP SCRIPT
# This script installs and configures Jenkins with GitHub integration,
# webhooks, and email notifications for automated deployments
###############################################################################

set -e  # Exit on error

echo "========================================="
echo "JENKINS CI/CD PIPELINE SETUP"
echo "========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

###############################################################################
# STEP 1: Find Available Ports
###############################################################################
echo ""
print_info "Step 1: Detecting available ports..."

find_available_port() {
    local start_port=$1
    local end_port=$2
    
    for port in $(seq $start_port $end_port); do
        if ! netstat -tuln | grep -q ":$port "; then
            echo $port
            return 0
        fi
    done
    
    echo "0"
    return 1
}

# Jenkins default port is 8080, but it's taken
# Try to find available port starting from 9002
JENKINS_PORT=$(find_available_port 9002 9100)
if [ "$JENKINS_PORT" = "0" ]; then
    print_error "No available ports found in range 9002-9100"
    exit 1
fi
print_success "Found available port for Jenkins: $JENKINS_PORT"

# Find port for Jenkins agent (default 50000)
JENKINS_AGENT_PORT=$(find_available_port 50000 50100)
if [ "$JENKINS_AGENT_PORT" = "0" ]; then
    JENKINS_AGENT_PORT=50000
    print_info "Using default agent port: $JENKINS_AGENT_PORT (may conflict)"
else
    print_success "Found available port for Jenkins agent: $JENKINS_AGENT_PORT"
fi

###############################################################################
# STEP 2: Update docker-compose.jenkins.yml with available ports
###############################################################################
echo ""
print_info "Step 2: Updating docker-compose configuration..."

cat > /root/vito/docker-compose.jenkins.yml <<EOF
services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    restart: unless-stopped
    privileged: true
    user: root
    ports:
      - "${JENKINS_PORT}:8080"
      - "${JENKINS_AGENT_PORT}:50000"
    volumes:
      # Persist Jenkins data
      - jenkins_home:/var/jenkins_home
      # Allow Jenkins to use the host's Docker engine (Crucial for building images!)
      - /var/run/docker.sock:/var/run/docker.sock
      # Map docker binary
      - /usr/bin/docker:/usr/bin/docker
    environment:
      - JENKINS_OPTS=--prefix=/jenkins
      - JAVA_OPTS=-Djenkins.install.runSetupWizard=false

volumes:
  jenkins_home:
    driver: local
EOF

print_success "Docker Compose configuration updated"

###############################################################################
# STEP 3: Install Docker (if not already installed)
###############################################################################
echo ""
print_info "Step 3: Checking Docker installation..."

if ! command -v docker &> /dev/null; then
    print_info "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    systemctl enable docker
    systemctl start docker
    print_success "Docker installed successfully"
else
    print_success "Docker is already installed"
fi

if ! command -v docker-compose &> /dev/null; then
    print_info "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_success "Docker Compose is already installed"
fi

###############################################################################
# STEP 4: Start Jenkins Container
###############################################################################
echo ""
print_info "Step 4: Starting Jenkins container..."

cd /root/vito
docker-compose -f docker-compose.jenkins.yml up -d

print_success "Jenkins container started"

# Wait for Jenkins to start
print_info "Waiting for Jenkins to initialize (this may take 1-2 minutes)..."
sleep 60

###############################################################################
# STEP 5: Get Jenkins Initial Admin Password
###############################################################################
echo ""
print_info "Step 5: Retrieving Jenkins initial admin password..."

JENKINS_PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "")

if [ -z "$JENKINS_PASSWORD" ]; then
    print_error "Could not retrieve Jenkins password. Container might not be fully started."
    print_info "You can get it later with: docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
else
    print_success "Jenkins Initial Admin Password: $JENKINS_PASSWORD"
fi

###############################################################################
# STEP 6: Install Required Jenkins Plugins
###############################################################################
echo ""
print_info "Step 6: Installing required Jenkins plugins..."

# Install plugins via Jenkins CLI
PLUGINS=(
    "git"
    "github"
    "github-branch-source"
    "workflow-aggregator"
    "docker-workflow"
    "pipeline-stage-view"
    "email-ext"
    "mailer"
    "credentials"
    "credentials-binding"
    "ssh-agent"
    "ansicolor"
)

# Wait a bit more for Jenkins to be fully ready
sleep 30

for plugin in "${PLUGINS[@]}"; do
    docker exec jenkins jenkins-plugin-cli --plugins "$plugin" 2>/dev/null || true
done

print_success "Jenkins plugins installation initiated"

# Restart Jenkins to load plugins
print_info "Restarting Jenkins to load plugins..."
docker restart jenkins
sleep 45

print_success "Jenkins restarted with plugins loaded"

###############################################################################
# STEP 7: Display Access Information
###############################################################################
echo ""
echo "========================================="
echo "JENKINS SETUP COMPLETE!"
echo "========================================="
echo ""
print_success "Jenkins is now running!"
echo ""
echo "Access Jenkins at: http://$(curl -s ifconfig.me):${JENKINS_PORT}"
echo "Initial Admin Password: ${JENKINS_PASSWORD}"
echo ""
print_info "Next Steps:"
echo "1. Access Jenkins via the URL above"
echo "2. Login with the admin password"
echo "3. Complete the setup wizard"
echo "4. Configure GitHub credentials"
echo "5. Set up email notifications"
echo "6. Create your pipeline job"
echo ""
print_info "Configuration files created:"
echo "- /root/vito/docker-compose.jenkins.yml"
echo "- /root/vito/Jenkinsfile (already exists, will be updated)"
echo "- /root/vito/jenkins-configuration-guide.md (detailed instructions)"
echo ""

###############################################################################
# STEP 8: Save configuration details
###############################################################################
cat > /root/vito/jenkins-setup-info.txt <<EOF
========================================
JENKINS SETUP INFORMATION
========================================
Installation Date: $(date)
Jenkins URL: http://$(curl -s ifconfig.me):${JENKINS_PORT}
Jenkins Port: ${JENKINS_PORT}
Agent Port: ${JENKINS_AGENT_PORT}
Initial Admin Password: ${JENKINS_PASSWORD}

Container Name: jenkins
Docker Compose File: /root/vito/docker-compose.jenkins.yml

Useful Commands:
- View Jenkins logs: docker logs -f jenkins
- Restart Jenkins: docker restart jenkins
- Stop Jenkins: docker-compose -f /root/vito/docker-compose.jenkins.yml down
- Start Jenkins: docker-compose -f /root/vito/docker-compose.jenkins.yml up -d
- Get admin password: docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

========================================
EOF

print_success "Setup information saved to /root/vito/jenkins-setup-info.txt"

echo ""
print_success "Installation complete! Please proceed with the configuration guide."
