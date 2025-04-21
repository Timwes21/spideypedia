pipeline{
    agent any


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
}