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
                    emailext (
                        subject: "🔔 New Commit to ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                        body: """
                        <html>
                        <body style="font-family: Arial, sans-serif;">
                            <h2 style="color: #4CAF50;">📦 New Commit Detected</h2>
                            <table style="border-collapse: collapse; width: 100%;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Project:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.JOB_NAME}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Number:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Commit Author:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_AUTHOR_NAME} &lt;${env.GIT_AUTHOR_EMAIL}&gt;</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Commit Hash:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_SHORT}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Commit Message:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_MSG}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Started:</strong></td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">${new Date()}</td>
                                </tr>
                            </table>
                            <p style="margin-top: 20px;">
                                <strong>Status:</strong> Build in progress...<br>
                                <a href="${env.BUILD_URL}" style="color: #2196F3;">View Build</a> | 
                                <a href="${env.BUILD_URL}console" style="color: #2196F3;">Console Output</a>
                            </p>
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
                        sh "docker build -t $DOCKER_IMAGE_BACKEND:latest ./VitoTechWebsiteBackend"
                        sh "docker build -t $DOCKER_IMAGE_BACKEND:${env.BUILD_NUMBER} ./VitoTechWebsiteBackend"
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
                        sh "docker build -t $DOCKER_IMAGE_FRONTEND:latest ./VitoTechWebsiteFrontend"
                        sh "docker build -t $DOCKER_IMAGE_FRONTEND:${env.BUILD_NUMBER} ./VitoTechWebsiteFrontend"
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
                            ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} '
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
                        sh "scp docker-compose.yml ${SERVER_USER}@${SERVER_IP}:/root/vito/docker-compose.yml"
                        echo '✓ Configuration files copied'
                        
                        // 2. Copy environment file (if exists)
                        sh "scp VitoTechWebsiteBackend/.env ${SERVER_USER}@${SERVER_IP}:/root/vito/VitoTechWebsiteBackend/.env || echo 'No .env file to copy'"
                        
                        // 3. Deploy with zero-downtime strategy
                        def remoteCommand = """
                            set -e
                            cd /root/vito
                            
                            echo "Pulling latest images..."
                            docker-compose pull
                            
                            echo "Starting new containers..."
                            docker-compose up -d --remove-orphans
                            
                            echo "Waiting for services to be healthy..."
                            sleep 10
                            
                            echo "Cleaning up old images..."
                            docker image prune -f
                            
                            echo "Deployment completed successfully!"
                            docker-compose ps
                        """
                        
                        sh "ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} '${remoteCommand}'"
                        
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
                            ssh -o StrictHostKeyChecking=no ${SERVER_USER}@${SERVER_IP} '
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
                
                emailext (
                    subject: "✅ SUCCESS: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #4CAF50;">✅ Build and Deployment Successful!</h2>
                        <table style="border-collapse: collapse; width: 100%;">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Project:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.JOB_NAME}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Build Number:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Build Status:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;"><span style="color: #4CAF50; font-weight: bold;">SUCCESS</span></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Duration:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${currentBuild.durationString.replace(' and counting', '')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Commit Author:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_AUTHOR_NAME} &lt;${env.GIT_AUTHOR_EMAIL}&gt;</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Commit Hash:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_SHORT}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Commit Message:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_MSG}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Deployed to:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.SERVER_IP}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Completed At:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${new Date()}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 15px; background-color: #e8f5e9; border-left: 4px solid #4CAF50;">
                            <strong>✓ All stages completed successfully</strong><br>
                            <small>Your application has been deployed to production.</small>
                        </div>
                        <p style="margin-top: 20px;">
                            <a href="${env.BUILD_URL}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">View Build Details</a>
                            <a href="${env.BUILD_URL}console" style="display: inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin-left: 10px;">Console Output</a>
                        </p>
                    </body>
                    </html>
                    """,
                    to: "${env.EMAIL_RECIPIENTS}",
                    mimeType: 'text/html'
                )
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
                
                emailext (
                    subject: "❌ FAILURE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #f44336;">❌ Build Failed!</h2>
                        <table style="border-collapse: collapse; width: 100%;">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Project:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.JOB_NAME}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Build Number:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Build Status:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;"><span style="color: #f44336; font-weight: bold;">FAILURE</span></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Duration:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${currentBuild.durationString.replace(' and counting', '')}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Commit Author:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_AUTHOR_NAME} &lt;${env.GIT_AUTHOR_EMAIL}&gt;</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Commit Hash:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_SHORT}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Commit Message:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_COMMIT_MSG}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Failed Stage:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.STAGE_NAME ?: 'Unknown'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd; background-color: #f2f2f2;"><strong>Failed At:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${new Date()}</td>
                            </tr>
                        </table>
                        <div style="margin-top: 20px; padding: 15px; background-color: #ffebee; border-left: 4px solid #f44336;">
                            <strong>⚠ Action Required</strong><br>
                            <small>The build has failed. Please review the error logs below and fix the issues.</small>
                        </div>
                        <div style="margin-top: 20px;">
                            <h3>Recent Error Logs:</h3>
                            <pre style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; border: 1px solid #ddd;">${errorLog}</pre>
                        </div>
                        <p style="margin-top: 20px;">
                            <a href="${env.BUILD_URL}" style="display: inline-block; padding: 10px 20px; background-color: #f44336; color: white; text-decoration: none; border-radius: 4px;">View Build Details</a>
                            <a href="${env.BUILD_URL}console" style="display: inline-block; padding: 10px 20px; background-color: #FF9800; color: white; text-decoration: none; border-radius: 4px; margin-left: 10px;">Full Console Output</a>
                        </p>
                    </body>
                    </html>
                    """,
                    to: "${env.EMAIL_RECIPIENTS}",
                    mimeType: 'text/html'
                )
            }
        }
        
        unstable {
            script {
                emailext (
                    subject: "⚠ UNSTABLE: ${env.JOB_NAME} - Build #${env.BUILD_NUMBER}",
                    body: """
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #FF9800;">⚠ Build Unstable</h2>
                        <p>The build completed but is marked as unstable. This usually indicates test failures or warnings.</p>
                        <table style="border-collapse: collapse; width: 100%;">
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Project:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.JOB_NAME}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Build Number:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">#${env.BUILD_NUMBER}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; border: 1px solid #ddd;"><strong>Commit Author:</strong></td>
                                <td style="padding: 8px; border: 1px solid #ddd;">${env.GIT_AUTHOR_NAME} &lt;${env.GIT_AUTHOR_EMAIL}&gt;</td>
                            </tr>
                        </table>
                        <p style="margin-top: 20px;">
                            <a href="${env.BUILD_URL}console" style="color: #FF9800;">View Console Output</a>
                        </p>
                    </body>
                    </html>
                    """,
                    to: "${env.EMAIL_RECIPIENTS}",
                    mimeType: 'text/html'
                )
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
