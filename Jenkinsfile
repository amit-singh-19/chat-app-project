pipeline {
    agent any

    environment {
        IMAGE_NAME = "chat-app"
    }

    stages {
        stage('Check Docker Availability') {
            steps {
                // Check if Docker is running
                bat 'docker --version'
            }
        }

        stage('Clone Repository') {
            steps {
                // Clone the GitHub repository
                git 'https://github.com/amit-singh-19/chat-app-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Check if Docker is available before building
                bat 'docker --version'
                // Build Docker image from the Dockerfile
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Check Docker Compose Availability') {
            steps {
                // Check if Docker Compose is available
                bat 'docker compose --version'
            }
        }

        stage('Run Docker Compose') {
            steps {
                // Bring down any existing containers
                bat 'docker compose down || exit 0'

                // Start containers in detached mode
                bat 'docker compose up -d --build'
            }
        }
    }

    post {
        success {
            echo 'Build and Deployment successful!'
        }
        failure {
            echo 'Build failed.'
        }
    }
}
