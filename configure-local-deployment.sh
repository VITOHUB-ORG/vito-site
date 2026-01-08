#!/bin/bash

###############################################################################
# LOCAL DEPLOYMENT CONFIGURATION
# Use this if Jenkins and your application are on the SAME server
###############################################################################

echo "=========================================="
echo "Configuring Jenkins for Local Deployment"
echo "=========================================="
echo ""
echo "This script modifies the Jenkinsfile to deploy locally"
echo "(without SSH) since Jenkins is running on the same server."
echo ""

read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Backup original Jenkinsfile
cp /root/vito/Jenkinsfile /root/vito/Jenkinsfile.backup
echo "✓ Backed up Jenkinsfile to Jenkinsfile.backup"

# Create local deployment version
cat > /root/vito/Jenkinsfile.local <<'JENKINSFILE'
pipeline {
    agent any

    environment {
        // Credentials ID from Jenkins
        DOCKER_REGISTRY_CREDENTIALS_ID = 'docker-hub-credentials'
        DOCKER_IMAGE_BACKEND = 'your-dockerhub-username/vito-backend'
        DOCKER_IMAGE_FRONTEND = 'your-dockerhub-username/vito-frontend'
        
        // Git commit information
        GIT_COMMIT_MSG = sh(script: 'git log -1 --pretty=%B ${GIT_COMMIT}', returnStdout: true).trim()
        GIT_AUTHOR_NAME = sh(script: 'git log -1 --pretty=%an ${GIT_COMMIT}', returnStdout: true).trim()
        GIT_AUTHOR_EMAIL = sh(script: 'git log -1 --pretty=%ae ${GIT_COMMIT}', returnStdout: true).trim()
        GIT_COMMIT_SHORT = sh(script: 'git rev-parse --short ${GIT_COMMIT}', returnStdout: true).trim()
        
        // Email recipients
        EMAIL_RECIPIENTS = 'your-email@example.com'
        
        // Local deployment path
        DEPLOY_PATH = '/root/vito'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timestamps()
        timeout(time: 1, unit: 'HOURS')
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
                    
                    emailext (
                        subject: "🔔 New Commit - Build #${env.BUILD_NUMBER}",
                        body: """
                        <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2 style="color: #4CAF50;">📦 New Commit Detected</h2>
                            <table style="border-collapse: collapse; width: 100%;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Number:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Author:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_AUTHOR_NAME} &lt;${env.GIT_AUTHOR_EMAIL}&gt;</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Commit:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_SHORT}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_MSG}</td>
                                </tr>
                            </table>
                            <p><a href="${env.BUILD_URL}console">View Build</a></p>
                        </body>
                        </html>
                        """,
                        to: "${env.EMAIL_RECIPIENTS}",
                        mimeType: 'text/html'
                    )
                }
            }
        }

        stage('Pre-Build Checks') {
            steps {
                script {
                    echo 'Running pre-build checks...'
                    sh 'docker --version'
                    sh 'df -h'
                    sh 'test -f ./VitoTechWebsiteBackend/Dockerfile || exit 1'
                    sh 'test -f ./VitoTechWebsiteFrontend/Dockerfile || exit 1'
                    sh 'test -f ./docker-compose.yml || exit 1'
                    echo '✓ Pre-build checks passed'
                }
            }
        }

        stage('Build Images') {
            steps {
                script {
                    echo 'Building Docker images...'
                    sh "docker build -t $DOCKER_IMAGE_BACKEND:latest ./VitoTechWebsiteBackend"
                    sh "docker build -t $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER} ./VitoTechWebsiteBackend"
                    sh "docker build -t $DOCKER_IMAGE_FRONTEND:latest ./VitoTechWebsiteFrontend"
                    sh "docker build -t $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER} ./VitoTechWebsiteFrontend"
                    echo '✓ Images built successfully'
                }
            }
        }

        stage('Push to Registry') {
            steps {
                script {
                    echo 'Pushing images to Docker Hub...'
                    withCredentials([usernamePassword(credentialsId: DOCKER_REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push $DOCKER_IMAGE_BACKEND:latest"
                        sh "docker push $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER}"
                        sh "docker push $DOCKER_IMAGE_FRONTEND:latest"
                        sh "docker push $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER}"
                    }
                    echo '✓ Images pushed successfully'
                }
            }
        }

        stage('Deploy Locally') {
            steps {
                script {
                    echo 'Deploying to local server...'
                    dir(DEPLOY_PATH) {
                        // Pull latest images
                        sh 'docker-compose pull'
                        
                        // Deploy with zero-downtime
                        sh 'docker-compose up -d --remove-orphans'
                        
                        // Wait for services
                        sh 'sleep 10'
                        
                        // Clean up
                        sh 'docker image prune -f'
                        
                        // Verify
                        sh 'docker-compose ps'
                    }
                    echo '✓ Deployment completed'
                }
            }
        }
    }
    
    post {
        success {
            emailext (
                subject: "✅ SUCCESS: Build #${env.BUILD_NUMBER}",
                body: """
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2 style="color: #4CAF50;">✅ Build Successful!</h2>
                    <table style="border-collapse: collapse; width: 100%;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Build:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong style="color: #4CAF50;">SUCCESS</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Author:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_AUTHOR_NAME}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Commit:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_MSG}</td>
                        </tr>
                    </table>
                    <p><a href="${env.BUILD_URL}">View Details</a></p>
                </body>
                </html>
                """,
                to: "${env.EMAIL_RECIPIENTS}",
                mimeType: 'text/html'
            )
        }
        
        failure {
            emailext (
                subject: "❌ FAILURE: Build #${env.BUILD_NUMBER}",
                body: """
                <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2 style="color: #f44336;">❌ Build Failed!</h2>
                    <table style="border-collapse: collapse; width: 100%;">
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Build:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Status:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong style="color: #f44336;">FAILURE</strong></td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Author:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_AUTHOR_NAME}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; border: 1px solid #ddd;"><strong>Commit:</strong></td>
                            <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_MSG}</td>
                        </tr>
                    </table>
                    <p><a href="${env.BUILD_URL}console">View Console</a></p>
                </body>
                </html>
                """,
                to: "${env.EMAIL_RECIPIENTS}",
                mimeType: 'text/html'
            )
        }
        
        always {
            sh "docker rmi $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER} || true"
            sh "docker rmi $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER} || true"
        }
    }
}
JENKINSFILE

echo "✓ Created Jenkinsfile.local for local deployment"
echo ""
echo "To use local deployment:"
echo "  mv /root/vito/Jenkinsfile.local /root/vito/Jenkinsfile"
echo ""
echo "To restore remote deployment:"
echo "  mv /root/vito/Jenkinsfile.backup /root/vito/Jenkinsfile"
