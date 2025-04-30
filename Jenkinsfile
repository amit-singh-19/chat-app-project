pipeline {
    agent any

    environment {
        IMAGE_NAME = "chat-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/amit-singh-19/chat-app-project.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build -t %IMAGE_NAME% ."
            }
        }

        stage('Run Docker Compose') {
            steps {
                bat 'docker-compose down || exit 0'
                bat 'docker-compose up -d --build'
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
