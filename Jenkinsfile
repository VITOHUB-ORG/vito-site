pipeline {
    agent any

    environment {
        // Credentials ID from Jenkins (You must create these in Jenkins)
        DOCKER_REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_IMAGE_BACKEND = 'your-dockerhub-username/vito-backend'
        DOCKER_IMAGE_FRONTEND = 'your-dockerhub-username/vito-frontend'
        
        // Server Details
        SERVER_IP = '206.189.112.134'
        SERVER_USER = 'root'
        // We assume Jenkins has SSH access via key (ssh-copy-id)
    }

    stages {
        stage('Build Backend') {
            steps {
                script {
                    echo 'Building Backend Docker Image...'
                    // Build the image
                    sh "docker build -t $DOCKER_IMAGE_BACKEND:latest ./VitoTechWebsiteBackend"
                    sh "docker build -t $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER} ./VitoTechWebsiteBackend"
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building Frontend Docker Image...'
                    // Build the image
                    sh "docker build -t $DOCKER_IMAGE_FRONTEND:latest ./VitoTechWebsiteFrontend"
                    sh "docker build -t $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER} ./VitoTechWebsiteFrontend"
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    echo 'Pushing Images to Docker Hub...'
                    // Login to Docker Hub using Jenkins credentials
                    withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        
                        // Push Backend
                        sh "docker push $DOCKER_IMAGE_BACKEND:latest"
                        sh "docker push $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER}"
                        
                        // Push Frontend
                        sh "docker push $DOCKER_IMAGE_FRONTEND:latest"
                        sh "docker push $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Deploy to Server') {
            steps {
                script {
                    echo 'Deploying to Production Server...'
                    
                    // 1. Copy docker-compose.yml to server
                    sh "scp docker-compose.yml ${SERVER_USER}@${SERVER_IP}:/root/vito/docker-compose.yml"
                    
                    // 2. Copy .env file (Optional: usually better to set env vars on server, but copying for now)
                    sh "scp VitoTechWebsiteBackend/.env ${SERVER_USER}@${SERVER_IP}:/root/vito/VitoTechWebsiteBackend/.env"

                    // 3. SSH and Deploy
                    def remoteCommand = """
                        cd /root/vito
                        # Pull the latest images
                        docker-compose pull
                        # Restart services
                        docker-compose up -d
                    """
                    sh "ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} '${remoteCommand}'"
                }
            }
        }
    }
    
    post {
        always {
            // Clean up local images to save space
            sh "docker rmi $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER} || true"
            sh "docker rmi $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER} || true"
        }
    }
}
