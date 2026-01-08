#!/bin/bash
echo "Stopping Jenkins..."
docker-compose -f /root/vito/docker-compose.jenkins.yml down

echo "Removing old data..."
docker volume rm jenkins_home

echo "Updating configuration..."
# Create new config without the wizard disabled
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
      # Setup wizard enabled by default when this is removed

volumes:
  jenkins_home:
    driver: local
EOF

echo "Starting Jenkins..."
docker-compose -f /root/vito/docker-compose.jenkins.yml up -d

echo "Waiting for initialization (this takes about 60s)..."
until docker exec jenkins test -f /var/jenkins_home/secrets/initialAdminPassword; do
    echo -n "."
    sleep 5
done

echo ""
echo "==================================================="
echo "✅ CREDENTIALS GENERATED"
echo "==================================================="
echo "Username: admin"
echo "Password: $(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword)"
echo "URL:      http://206.189.112.134:9002/jenkins"
echo "==================================================="
