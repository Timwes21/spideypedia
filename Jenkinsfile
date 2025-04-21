pipeline{
    agent any

    environment{
        DOCKER_CREDENTIALS_ID = 'a2ac55bf-624e-4b33-83f4-2c28656540c4'
        DOCKER_FRONTEND = 'timwes21/spideypedia-frontend:latest'
        DOCKER_BACKEND = 'timwes21/spideypedia-backend:latest'
    }

    stages {
        stage('Login to Docker') {
            steps {
                withCredentials([usernamePassword(credentialsId: DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin'
                }
            }
        }
    }


    stages {
        stage('Clone Repo'){
            steps{
                git 'https://github.com/Timwes21/spideypedia.git'
            }
        }

        stage('Install Frontend'){
            steps{
                dir('frontend'){
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend'){
            steps{
                dir('frontend'){
                    sh 'npm run build'
                }
            }
        }

        stage('Install Backend'){
            steps{
                dir('backend'){
                    sh 'npm install'
                }
            }
        }

        stage('Build Backend'){
            steps{
                dir('backend'){
                    sh 'npm run build'
                }
            }
        }

        stage('Test Backend'){
            steps{
                dir('backend'){
                    sh 'npm test'
                }
            }
        }

        stage('Docker Build and Push frontend'){
            steps{
                dir('frontend'){
                    sh """
                        docker build -t $DOCKER_FRONTEND .
                        docker push $DOCKER_FRONTEND
                    """
                }
            }
        }

        stage('Docker Build and Push backend'){
            steps{
                dir('backend'){
                    sh """
                        docker build -t $DOCKER_BACKEND .
                        docker push $DOCKER_BACKEND
                    """
                }
            }
        }


    }
}