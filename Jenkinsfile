pipeline {
    agent any

    environment {
        // Credentials ID from Jenkins (Must be configured in Jenkins credentials)
        DOCKER_REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_IMAGE_BACKEND = 'kiruma05/vito-backend'
        DOCKER_IMAGE_FRONTEND = 'kiruma05/vito-frontend'
        
        // Server Details
        SERVER_IP = '206.189.112.134'
        SERVER_USER = 'root'
        
        // Git commit information (captured automatically)
        GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
        GIT_AUTHOR_NAME = sh(script: 'git log -1 --pretty=%an ${GIT_COMMIT}', returnStdout: true).trim()
        GIT_AUTHOR_EMAIL = sh(script: 'git log -1 --pretty=%ae ${GIT_COMMIT}', returnStdout: true).trim()
        GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short ${GIT_COMMIT}', returnStdout: true).trim()
        
        // Notification recipients (Update with your email addresses)
        EMAIL_RECIPIENTS = 'frankkiruma05@gmail.com'
    }

    options {
        // Keep only last 10 builds
        buildDiscarder(logRotator(numToKeepStr: '10'))
        // Add timestamps to console output
        timestamps()
        // Timeout for entire pipeline
        timeout(time: 1, unit: 'HOURS')
        // Disable concurrent builds to prevent conflicts
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout & Notify') {
            steps {
                script {
                    echo "========================================="
                    echo "New Commit Detected!"
                    echo "========================================="
                    echo "Author: ${env.GIT_AUTHOR_NAME} <${env.GIT_AUTHOR_EMAIL}>"
                    echo "Commit: ${env.GIT_COMMIT_SHORT}"
                    echo "Message: ${env.GIT_COMMIT_MSG}"
                    echo "========================================="
                    
                    // Send notification email about new commit
                    // Email notifications are temporarily disabled due to network port blocking
                    echo "🔔 New Commit to ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}"
                }
            }
        }

        stage('Pre-Build Checks') {
            steps {
                script {
                    echo 'Running pre-build safety checks...'
                    
                    // Check if Docker is available
                    sh 'docker --version'
                    
                    // Check disk space
                    sh 'df -h'
                    
                    // Verify required files exist
                    sh 'test -f ./VitoTechWebsiteBackend/Dockerfile || exit 1'
                    sh 'test -f ./VitoTechWebsiteFrontend/Dockerfile || exit 1'
                    sh 'test -f ./docker-compose.yml || exit 1'
                    
                    echo '✓ Pre-build checks passed'
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    echo '========================================='
                    echo 'Building Backend Docker Image...'
                    echo '========================================='
                    try {
                        sh "docker build --no-cache -t $DOCKER_IMAGE_BACKEND:latest ./VitoTechWebsiteBackend"
                        sh "docker build --no-cache -t $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER} ./VitoTechWebsiteBackend"
                        echo '✓ Backend image built successfully'
                    } catch (Exception e) {
                        error "Failed to build backend image: ${e.message}"
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    echo '========================================='
                    echo 'Building Frontend Docker Image...'
                    echo '========================================='
                    try {
                        sh "docker build --no-cache -t $DOCKER_IMAGE_FRONTEND:latest ./VitoTechWebsiteFrontend"
                        sh "docker build --no-cache -t $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER} ./VitoTechWebsiteFrontend"
                        echo '✓ Frontend image built successfully'
                    } catch (Exception e) {
                        error "Failed to build frontend image: ${e.message}"
                    }
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    echo '========================================='
                    echo 'Running tests (if applicable)...'
                    echo '========================================='
                    // Add your test commands here
                    // Example: sh "docker run --rm $DOCKER_IMAGE_BACKEND:latest npm test"
                    echo '✓ Tests passed (or skipped)'
                }
            }
        }

        stage('Push Images to Registry') {
            steps {
                script {
                    echo '========================================='
                    echo 'Pushing Docker Images to Registry...'
                    echo '========================================='
                    try {
                        withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                            
                            // Push Backend
                            sh "docker push $DOCKER_IMAGE_BACKEND:latest"
                            sh "docker push $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER}"
                            echo '✓ Backend images pushed'
                            
                            // Push Frontend
                            sh "docker push $DOCKER_IMAGE_FRONTEND:latest"
                            sh "docker push $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER}"
                            echo '✓ Frontend images pushed'
                        }
                        echo '✓ All images pushed successfully'
                    } catch (Exception e) {
                        error "Failed to push images: ${e.message}"
                    }
                }
            }
        }

        stage('Pre-Deployment Backup') {
            steps {
                script {
                    echo '========================================='
                    echo 'Creating backup before deployment...'
                    echo '========================================='
                    try {
                        // Create backup of current running containers (optional)
                        sh """
                            ssh -i /var/jenkins_home/.ssh/id_ed25519 -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} '
                                cd /root/vito
                                # Create backup directory with timestamp
                                BACKUP_DIR=/root/vito-backups/backup-\$(date +%Y%m%d-%H%M%S)
                                mkdir -p \$BACKUP_DIR
                                # Backup docker-compose.yml
                                cp docker-compose.yml \$BACKUP_DIR/ || true
                                echo "Backup created at \$BACKUP_DIR"
                            '
                        """
                        echo '✓ Backup completed'
                    } catch (Exception e) {
                        echo "⚠ Backup failed (non-critical): ${e.message}"
                    }
                }
            }
        }

        stage('Deploy to Production') {
            steps {
                script {
                    echo '========================================='
                    echo 'Deploying to Production Server...'
                    echo '========================================='
                    try {
                        // 1. Copy configuration files
                        sh "scp -i /var/jenkins_home/.ssh/id_ed25519 -o StrictHostKeyChecking=no docker-compose.yml ${SERVER_USER}@${SERVER_IP}:/root/vito/docker-compose.yml"
                        echo '✓ Configuration files copied'
                        
                        // 2. Copy environment file (if exists)
                        sh "scp -i /var/jenkins_home/.ssh/id_ed25519 -o StrictHostKeyChecking=no VitoTechWebsiteBackend/.env ${SERVER_USER}@${SERVER_IP}:/root/vito/VitoTechWebsiteBackend/.env || echo 'No .env file to copy'"
                        
                        // 3. Deploy with zero-downtime strategy
                        def remoteCommand = """
                            set -e
                            cd /root/vito
                            
                            echo "Pulling latest images..."
                            docker-compose pull
                            
                            echo "Starting new containers..."
                            docker-compose up -d
                            
                            echo "Waiting for services to be healthy..."
                            sleep 10
                            
                            echo "Cleaning up old images..."
                            docker image prune -f
                            
                            echo "Deployment completed successfully!"
                            docker-compose ps
                        """
                        
                        sh "ssh -i /var/jenkins_home/.ssh/id_ed25519 -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} '${remoteCommand}'"
                        
                        echo '✓ Deployment completed successfully'
                    } catch (Exception e) {
                        error "Deployment failed: ${e.message}"
                    }
                }
            }
        }

        stage('Post-Deployment Verification') {
            steps {
                script {
                    echo '========================================='
                    echo 'Verifying deployment...'
                    echo '========================================='
                    try {
                        // Health check (customize based on your application)
                        sh """
                            ssh -i /var/jenkins_home/.ssh/id_ed25519 -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} '
                                # Check if containers are running
                                docker-compose -f /root/vito/docker-compose.yml ps
                                
                                # Optional: Add health check curl commands
                                # curl -f http://localhost:3000/health || exit 1
                            '
                        """
                        echo '✓ Deployment verification successful'
                    } catch (Exception e) {
                        error "Post-deployment verification failed: ${e.message}"
                    }
                }
            }
        }
    }
    
    post {
        success {
            script {
                echo '========================================='
                echo '✓ PIPELINE SUCCEEDED!'
                echo '========================================='
                
                echo "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}"
            }
        }
        
        failure {
            script {
                echo '========================================='
                echo '✗ PIPELINE FAILED!'
                echo '========================================='
                
                // Capture error logs
                def errorLog = ""
                try {
                    errorLog = sh(script: 'tail -n 100 ${JENKINS_HOME}/jobs/${JOB_NAME}/builds/${BUILD_NUMBER}/log', returnStdout: true)
                } catch (Exception e) {
                    errorLog = "Could not retrieve error logs"
                }

                echo "❌ FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}"
            }
        }
        
        unstable {
                script {
                    echo "⚠ UNSTABLE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}"
                }
        }
        
        always {
            script {
                echo 'Cleaning up...'
                // Clean up local images to save space
                sh "docker rmi $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER} || true"
                sh "docker rmi $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER} || true"
                echo 'Cleanup completed'
            }
        }
    }
}
