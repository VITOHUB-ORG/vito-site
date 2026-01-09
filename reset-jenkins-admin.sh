#!/bin/bash

###############################################################################
# JENKINS ADMIN PASSWORD RESET SCRIPT
# This script helps reset or create the admin user for Jenkins
###############################################################################

echo "=========================================="
echo "JENKINS ADMIN PASSWORD RESET"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${YELLOW}ℹ $1${NC}"; }

echo "This script will help you access Jenkins by:"
echo "1. Temporarily disabling security to create/reset admin user"
echo "2. Or creating a fresh Jenkins installation"
echo ""

read -p "Choose option (1=Reset Admin, 2=Fresh Install): " -n 1 -r
echo ""

if [[ $REPLY == "1" ]]; then
    print_info "Disabling Jenkins security temporarily..."
    
    # Backup config.xml
    docker exec jenkins cp /var/jenkins_home/config.xml /var/jenkins_home/config.xml.backup
    print_success "Backed up config.xml"
    
    # Disable security
    docker exec jenkins sed -i 's/<useSecurity>true<\/useSecurity>/<useSecurity>false<\/useSecurity>/g' /var/jenkins_home/config.xml
    docker exec jenkins sed -i 's/<authorizationStrategy.*\/>/<!-- authorizationStrategy disabled -->/g' /var/jenkins_home/config.xml
    docker exec jenkins sed -i 's/<securityRealm.*\/>/<!-- securityRealm disabled -->/g' /var/jenkins_home/config.xml
    
    # Restart Jenkins
    print_info "Restarting Jenkins..."
    docker restart jenkins
    sleep 15
    
    SERVER_IP=$(curl -s ifconfig.me)
    
    echo ""
    print_success "Security temporarily disabled!"
    echo ""
    echo "=========================================="
    echo "ACCESS JENKINS NOW:"
    echo "=========================================="
    echo ""
    echo "1. Open: http://${SERVER_IP}:9002/jenkins"
    echo "2. Go to: Manage Jenkins → Manage Users"
    echo "3. Create new admin user or reset password"
    echo "4. Enable security: Manage Jenkins → Configure Global Security"
    echo "   - Security Realm: Jenkins' own user database"
    echo "   - Authorization: Logged-in users can do anything"
    echo "5. Save and login with your new credentials"
    echo ""
    echo "To restore original security settings:"
    echo "  docker exec jenkins cp /var/jenkins_home/config.xml.backup /var/jenkins_home/config.xml"
    echo "  docker restart jenkins"
    echo ""
    
elif [[ $REPLY == "2" ]]; then
    print_info "Creating fresh Jenkins installation..."
    
    read -p "This will DELETE all existing Jenkins data. Continue? (yes/no): " confirm
    if [[ $confirm != "yes" ]]; then
        echo "Cancelled."
        exit 1
    fi
    
    # Stop and remove container
    docker-compose -f /root/vito/docker-compose.jenkins.yml down
    
    # Remove volume
    docker volume rm jenkins_home 2>/dev/null || true
    
    # Update docker-compose to enable setup wizard
    cat > /root/vito/docker-compose.jenkins.yml <<EOF
services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    restart: unless-stopped
    privileged: true
    user: root
    ports:
      - "9002:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
      - /usr/bin/docker:/usr/bin/docker
    environment:
      - JENKINS_OPTS=--prefix=/jenkins

volumes:
  jenkins_home:
    driver: local
EOF
    
    print_success "Updated docker-compose.yml"
    
    # Start fresh
    docker-compose -f /root/vito/docker-compose.jenkins.yml up -d
    
    print_info "Waiting for Jenkins to start (60 seconds)..."
    sleep 60
    
    # Get password
    PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null || echo "")
    
    SERVER_IP=$(curl -s ifconfig.me)
    
    echo ""
    print_success "Fresh Jenkins installation created!"
    echo ""
    echo "=========================================="
    echo "ACCESS JENKINS:"
    echo "=========================================="
    echo ""
    echo "URL: http://${SERVER_IP}:9002/jenkins"
    echo "Initial Admin Password: ${PASSWORD}"
    echo ""
    echo "If password is empty, wait a minute and run:"
    echo "  docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
    echo ""
    
    # Save info
    cat > /root/vito/jenkins-fresh-install-info.txt <<EOF
Fresh Jenkins Installation
==========================
Date: $(date)
URL: http://${SERVER_IP}:9002
Initial Admin Password: ${PASSWORD}

Get password again:
  docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
EOF
    
    print_success "Installation info saved to jenkins-fresh-install-info.txt"
else
    echo "Invalid option. Exiting."
    exit 1
fi

echo ""
print_success "Done!"
