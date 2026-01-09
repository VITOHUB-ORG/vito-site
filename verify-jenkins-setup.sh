#!/bin/bash

###############################################################################
# JENKINS SETUP VERIFICATION SCRIPT
# Verify all components are installed and configured correctly
###############################################################################

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_header() { echo -e "\n${BLUE}━━━ $1 ━━━${NC}"; }

echo "═══════════════════════════════════════════════════════"
echo "  JENKINS CI/CD PIPELINE - SETUP VERIFICATION"
echo "═══════════════════════════════════════════════════════"

# Check Docker
print_header "Docker Installation"
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | tr -d ',')
    print_success "Docker installed: $DOCKER_VERSION"
else
    print_error "Docker not installed"
fi

if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version | cut -d' ' -f3 | tr -d ',')
    print_success "Docker Compose installed: $COMPOSE_VERSION"
else
    print_error "Docker Compose not installed"
fi

# Check Jenkins Container
print_header "Jenkins Container Status"
if docker ps | grep -q jenkins; then
    UPTIME=$(docker ps --format "{{.Status}}" --filter "name=jenkins")
    print_success "Jenkins container running: $UPTIME"
    
    # Check if Jenkins is responsive
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:9002/jenkins/ | grep -q "200\|403"; then
        print_success "Jenkins web interface is responsive"
    else
        print_warning "Jenkins web interface not responding properly"
    fi
else
    print_error "Jenkins container not running"
fi

# Check Ports
print_header "Port Configuration"
if netstat -tuln 2>/dev/null | grep -q ":9002"; then
    print_success "Port 9002 is listening (Jenkins)"
else
    print_warning "Port 9002 not listening"
fi

if netstat -tuln 2>/dev/null | grep -q ":50000"; then
    print_success "Port 50000 is listening (Jenkins Agent)"
else
    print_warning "Port 50000 not listening"
fi

# Check Files
print_header "Configuration Files"
[ -f "/root/vito/Jenkinsfile" ] && print_success "Jenkinsfile exists" || print_error "Jenkinsfile missing"
[ -f "/root/vito/docker-compose.jenkins.yml" ] && print_success "docker-compose.jenkins.yml exists" || print_error "docker-compose.jenkins.yml missing"
[ -f "/root/vito/jenkins-configuration-guide.md" ] && print_success "Configuration guide exists" || print_error "Configuration guide missing"
[ -f "/root/vito/SETUP_CHECKLIST.md" ] && print_success "Setup checklist exists" || print_error "Setup checklist missing"
[ -f "/root/vito/README-JENKINS-SETUP.md" ] && print_success "README exists" || print_error "README missing"

# Check Jenkinsfile Content
print_header "Jenkinsfile Configuration"
if grep -q "emailext" /root/vito/Jenkinsfile; then
    print_success "Email notifications configured"
else
    print_warning "Email notifications not configured"
fi

if grep -q "GIT_COMMIT_MSG" /root/vito/Jenkinsfile; then
    print_success "Git commit tracking enabled"
else
    print_warning "Git commit tracking not enabled"
fi

if grep -q "Pre-Deployment Backup" /root/vito/Jenkinsfile; then
    print_success "Pre-deployment backup configured"
else
    print_warning "Pre-deployment backup not configured"
fi

# Check Docker Volume
print_header "Docker Volumes"
if docker volume ls | grep -q jenkins_home; then
    VOLUME_SIZE=$(docker system df -v | grep jenkins_home | awk '{print $3}' | head -1)
    print_success "jenkins_home volume exists${VOLUME_SIZE:+ ($VOLUME_SIZE)}"
else
    print_warning "jenkins_home volume not found"
fi

# Check Jenkins Logs
print_header "Jenkins Status (from logs)"
if docker logs jenkins 2>&1 | grep -q "Jenkins is fully up and running"; then
    print_success "Jenkins initialization complete"
else
    print_warning "Jenkins may still be initializing"
fi

# Server Information
print_header "Server Information"
SERVER_IP=$(curl -s ifconfig.me 2>/dev/null || echo "Unknown")
print_info "Server IP: $SERVER_IP"
print_info "Jenkins URL: http://$SERVER_IP:9002"

# Check if admin password exists
print_header "Admin Access"
if docker exec jenkins test -f /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null; then
    PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null)
    print_success "Initial admin password available"
    echo "   Password: $PASSWORD"
elif docker exec jenkins test -f /var/jenkins_home/config.xml 2>/dev/null; then
    if docker exec jenkins grep -q "<useSecurity>true</useSecurity>" /var/jenkins_home/config.xml 2>/dev/null; then
        print_warning "Jenkins has existing configuration with security enabled"
        print_info "Run: bash reset-jenkins-admin.sh to reset password"
    else
        print_info "Jenkins security is disabled"
    fi
else
    print_warning "Unable to determine Jenkins security status"
fi

# Git Repository
print_header "Git Repository"
if [ -d "/root/vito/.git" ]; then
    print_success "Git repository initialized"
    REMOTE=$(git -C /root/vito remote get-url origin 2>/dev/null || echo "Not configured")
    print_info "Remote: $REMOTE"
else
    print_warning "Git repository not initialized"
    print_info "Run: git init && git remote add origin YOUR_REPO_URL"
fi

# Summary
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  VERIFICATION SUMMARY"
echo "═══════════════════════════════════════════════════════"
echo ""

if docker ps | grep -q jenkins && [ -f "/root/vito/Jenkinsfile" ]; then
    print_success "Core components installed successfully! ✨"
    echo ""
    print_info "Next Steps:"
    echo "  1. Access Jenkins setup/reset: bash reset-jenkins-admin.sh"
    echo "  2. Read the guide: cat README-JENKINS-SETUP.md"
    echo "  3. Follow checklist: cat SETUP_CHECKLIST.md"
else
    print_warning "Some components may need attention"
    echo ""
    print_info "Troubleshooting:"
    echo "  - View logs: docker logs -f jenkins"
    echo "  - Restart: docker restart jenkins"
    echo "  - Reinstall: bash jenkins-setup-complete.sh"
fi

echo ""
echo "═══════════════════════════════════════════════════════"
